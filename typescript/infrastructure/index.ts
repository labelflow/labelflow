import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as cloudflare from "@pulumi/cloudflare";
import * as tls from "@pulumi/tls";

const name = "test-iog-cluster";

// Create a GKE cluster
const engineVersion = gcp.container
  .getEngineVersions()
  .then((v) => v.latestMasterVersion);
const cluster = new gcp.container.Cluster(name, {
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
export const clusterName = cluster.name;

// Manufacture a GKE-style kubeconfig. Note that this is slightly "different"
// because of the way GKE requires gcloud to be in the picture for cluster
// authentication (rather than using the client cert/key directly).
export const kubeconfig = pulumi
  .all([cluster.name, cluster.endpoint, cluster.masterAuth])
  .apply(([name, endpoint, masterAuth]) => {
    const context = `${gcp.config.project}_${gcp.config.zone}_${name}`;
    return `apiVersion: v1
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
  });

// Create a Kubernetes provider instance that uses our cluster from above.
const clusterProvider = new k8s.Provider(name, {
  kubeconfig,
});

// Create a Kubernetes Namespace
const ns = new k8s.core.v1.Namespace(name, {}, { provider: clusterProvider });

// Export the Namespace name
export const namespaceName = ns.metadata.apply((m) => m.name);

// Create a NGINX Deployment
const appLabels = { appClass: name };
const deployment = new k8s.apps.v1.Deployment(
  name,
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
              name,
              image:
                "us-central1-docker.pkg.dev/labelflow-321909/labelflow/iog:1",
              ports: [{ containerPort: 5000 }],
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
  name,
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

// const ipAddress = new gcp.compute.Address("static-ip-adress", {});
// export const staticIpAddress = ipAddress.address;

// const key = new tls.PrivateKey("my-private-key", {
//   algorithm: "ECDSA",
//   ecdsaCurve: "P384",
// });

// const secret = new k8s.core.v1.Secret("tls_credentials", {
//   type: "kubernetes.io/tls",
// });

// const certRequest = new tls.CertRequest("request", {})

// const managedSslCertificate = new gcp.compute.ManagedSslCertificate(
//   "default-managed-ssl-certificate",
//   {
//     managed: {
//       domains: ["iog.labelflow.net."],
//     },
//   }
// );

export const ingress = new k8s.networking.v1.Ingress(
  "main-ingress",
  {
    metadata: {
      annotations: {
        // "kubernetes.io/ingress.global-static-ip-name": staticIpAddress,
        //   "kubernetes.io/ingress.allow-http": "false",
        // "networking.gke.io/managed-certificates": managedSslCertificate.name,
        "kubernetes.io/ingress.class": "gce",
      },
    },
    spec: {
      // ingressClassName: "gce",
      // tls: [{ secretName: secret.metadata.name }],
      rules: [
        {
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

// export const record = new cloudflare.Record("iog-record", {
//   name: "iog",
//   zoneId: process.env?.CLOUDFLARE_LABELFLOWNET_ZONE_ID,
//   type: "A",
//   // value: staticIpAddress,
//   value: ingress.status.loadBalancer.ingress[0].ip,
//   ttl: 3600,
// });
