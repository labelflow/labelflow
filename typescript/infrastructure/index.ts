/* eslint-disable no-await-in-loop */
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as cloudflare from "@pulumi/cloudflare";
import * as k8sOfficial from "@kubernetes/client-node";
// import { writeFileSync } from "fs";

// Create a GKE cluster
const engineVersion = gcp.container
  .getEngineVersions()
  .then((v) => v.latestMasterVersion);
const cluster = new gcp.container.Cluster("test-iog-cluster", {
  initialNodeCount: 2,
  minMasterVersion: engineVersion,
  nodeVersion: engineVersion,
  nodeConfig: {
    machineType: "n1-standard-1",
    oauthScopes: [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ],
  },
});

// Export the Cluster name
export const clusterName = cluster.name.apply((name) => `${name}`);

// Manufacture a GKE-style kubeconfig. Note that this is slightly "different"
// because of the way GKE requires gcloud to be in the picture for cluster
// authentication (rather than using the client cert/key directly).
export const kubeconfig = pulumi
  .all([cluster.name, cluster.endpoint, cluster.masterAuth])
  .apply(([name, endpoint, masterAuth]) => {
    const context = `${gcp.config.project}_${gcp.config.zone}_${name}`;
    const kubeconfigContent = `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`;
    // // If you want to write the kubeconfig file for local experimentation
    // writeFileSync("./kubeconfig", kubeconfigContent);
    return kubeconfigContent;
  });

// Create a Kubernetes provider instance that uses our cluster from above.
const clusterProvider = new k8s.Provider("test-iog-provider", {
  kubeconfig,
});

// Create a Kubernetes Namespace
const ns = new k8s.core.v1.Namespace(
  "test-iog-namespace",
  {},
  { provider: clusterProvider }
);

// Export the Namespace name
export const namespaceName = ns.metadata.apply((m) => m.name);

// Create a Deployment
const appLabels = { appClass: clusterName };
const deployment = new k8s.apps.v1.Deployment(
  "test-iog-deployment",
  {
    metadata: {
      namespace: namespaceName,
      labels: appLabels,
    },
    spec: {
      replicas: 1,
      selector: { matchLabels: appLabels },
      template: {
        metadata: {
          labels: appLabels,
        },
        spec: {
          containers: [
            {
              name: "test-iog-container",
              image:
                "us-central1-docker.pkg.dev/labelflow-321909/labelflow/iog:1",
              ports: [{ containerPort: 5000 }],
              readinessProbe: {
                httpGet: { path: "/graphql/", port: 5000 },
                initialDelaySeconds: 10,
                periodSeconds: 10,
                timeoutSeconds: 5,
              },
              livenessProbe: {
                httpGet: { path: "/graphql/", port: 5000 },
                initialDelaySeconds: 10,
                periodSeconds: 10,
                timeoutSeconds: 5,
              },
            },
          ],
        },
      },
    },
  },
  {
    provider: clusterProvider,
  }
);

// Export the Deployment name
export const deploymentName = deployment.metadata.apply((m) => m.name);

// Create a LoadBalancer Service for the NGINX Deployment
const service = new k8s.core.v1.Service(
  "test-iog-service",
  {
    metadata: {
      //   annotations: {
      //     "cloud.google.com/app-protocols": '{"": }',
      //   },
      labels: appLabels,
      namespace: namespaceName,
    },
    spec: {
      type: "NodePort",
      ports: [{ port: 80, targetPort: 5000 }],
      selector: appLabels,
    },
  },
  {
    provider: clusterProvider,
  }
);

// Export the Service name and public LoadBalancer endpoint
export const serviceName = service.metadata.apply((m) => m.name);
// export const servicePublicIP = service.status.apply(
//   (s) => s.loadBalancer.ingress[0].ip
// );

const ipAddress = new gcp.compute.Address("test-iog-address", {});
export const staticIpAddress = ipAddress.address;
export const staticIpName = ipAddress.name;

export const managedCertificate = new k8s.apiextensions.CustomResource(
  "test-iog-managed-certificate",
  {
    apiVersion: "networking.gke.io/v1",
    kind: "ManagedCertificate",
    metadata: {
      namespace: namespaceName,
    },
    spec: { domains: ["iog.labelflow.net"] },
  },
  { provider: clusterProvider }
);

const managedCertificateName = managedCertificate.metadata.apply((m) => m.name);

export const ingress = new k8s.networking.v1.Ingress(
  "test-iog-ingress",
  {
    metadata: {
      namespace: namespaceName,
      annotations: {
        // "kubernetes.io/ingress.global-static-ip-name": staticIpName,
        "kubernetes.io/ingress.allow-http": "false",
        // "networking.gke.io/managed-certificates": managedSslCertificate.name,
        "networking.gke.io/managed-certificates": managedCertificateName,
        // "kubernetes.io/ingress.class": "gce",
      },
    },
    spec: {
      // ingressClassName: "gce",
      // tls: [{ secretName: secret.metadata.name }],
      // defaultBackend: { service: { name: serviceName, port: { number: 80 } } },
      rules: [
        {
          host: "iog.labelflow.net",
          http: {
            paths: [
              {
                path: "/*",
                pathType: "ImplementationSpecific",
                backend: {
                  service: { name: serviceName, port: { number: 80 } },
                },
              },
            ],
          },
        },
      ],
    },
  },
  { provider: clusterProvider }
);

if (!process.env?.CLOUDFLARE_LABELFLOWNET_ZONE_ID) {
  throw new Error(
    `Cannot create cloudfare record: env var CLOUDFLARE_LABELFLOWNET_ZONE_ID not set`
  );
}

export const ingressIpAddress = pulumi
  .all([ingress.status, ingress.metadata, kubeconfig])
  .apply(async ([status, metadata, kubeconfigResult]) => {
    if (pulumi.runtime.isDryRun()) {
      return "";
    }
    if (status?.loadBalancer?.ingress?.[0]?.ip) {
      return status?.loadBalancer?.ingress?.[0]?.ip;
    }

    // Connect directly in kubernetes to listen to the status of the ingress
    // until it has the required information...

    const kc = new k8sOfficial.KubeConfig();
    kc.loadFromString(kubeconfigResult);
    const k8sApi = kc.makeApiClient(k8sOfficial.NetworkingV1Api);

    const maxRetries = 60;

    let ingressResult = null;
    for (let retry = 0; retry <= maxRetries; retry += 1) {
      try {
        ingressResult = (
          await k8sApi.readNamespacedIngressStatus(
            metadata.name,
            metadata.namespace
          )
        ).body;

        pulumi.log.info(JSON.stringify(ingressResult));

        const { ip } = ingressResult!.status!.loadBalancer!.ingress![0]!;
        return ip!;
      } catch (e) {
        pulumi.log.info(
          `retry ${retry}: ${JSON.stringify(ingressResult?.status)}`
        );

        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }
    throw new Error(`Failed to get ingress IP address`);
  });

export const record = new cloudflare.Record("test-iog-record", {
  name: "iog",
  zoneId: process.env?.CLOUDFLARE_LABELFLOWNET_ZONE_ID,
  type: "A",
  // value: staticIpAddress,
  // value: "34.117.17.101", // FIXME Hardcoded for now....
  value: ingressIpAddress,
  ttl: 3600,
});
