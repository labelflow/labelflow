/* eslint-disable no-await-in-loop */
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as cloudflare from "@pulumi/cloudflare";
import * as k8sOfficial from "@kubernetes/client-node";
// import { writeFileSync } from "fs";

/*
 * WARNING: in case of deploying from scratch, you'll need to deploy twice
 * - Once with lines flagged "FIRST DEPLOYMENT ONLY" uncommented and lines flagged "NON FIRST DEPLOYMENT ONLY" commented
 * - Once with lines flagged "NON FIRST DEPLOYMENT ONLY" uncommented and lines flagged "FIRST DEPLOYMENT ONLY" commented
 */

const domain = "labelflow.net";
const subdomain = "iog";
const fullyQualifiedDomain = `${subdomain}.${domain}`;

// https://console.cloud.google.com/iam-admin/quotas/details;servicem=compute.googleapis.com;metricm=compute.googleapis.com%2Fa2_cpus;limitIdm=1%2F%7Bproject%7D;allQuotasPageStatem=%28%22expandableQuotasTable%22:%28%22f%22:%22%255B%257B_22k_22_3A_22serviceName_22_2C_22t_22_3A10_2C_22v_22_3A_22_5C_22compute.googleapis.com_5C_22_22%257D_2C%257B_22k_22_3A_22_22_2C_22t_22_3A10_2C_22v_22_3A_22_5C_22A2_CPUS_5C_22_22%257D%255D%22%29%29?project=labelflow-321909
// Add quotas
// const myProject = gcp.organizations.Project("")
// export const quotasCpus = new gcp.serviceusage.ConsumerQuotaOverride(
//   "a2-cpus-quota",
//   {
//     service: "compute.googleapis.com",
//     limit: "%2Fproject%2Fregion",
//     overrideValue: "12",
//     metric: "compute.googleapis.com%2Fa2_cpus",
//   }
// );

// Create a GKE cluster
const engineVersion = gcp.container
  .getEngineVersions()
  .then((v) => v.latestMasterVersion);
const cluster = new gcp.container.Cluster(
  "test-iog-cluster",
  {
    initialNodeCount: 1,
    minMasterVersion: engineVersion,
    nodeVersion: engineVersion,
    nodeConfig: {
      machineType: "n1-standard-4",
      diskSizeGb: 100,
      oauthScopes: [
        "https://www.googleapis.com/auth/devstorage.read_only",
        "https://www.googleapis.com/auth/logging.write",
        "https://www.googleapis.com/auth/monitoring",
        "https://www.googleapis.com/auth/servicecontrol",
        "https://www.googleapis.com/auth/service.management.readonly",
        "https://www.googleapis.com/auth/trace.append",
      ],
      metadata: {
        "disable-legacy-endpoints": "true",
      },
      imageType: "COS_CONTAINERD",
      guestAccelerators: [
        {
          count: 1,
          type: "nvidia-tesla-t4",
        },
      ],
      diskType: "pd-standard",
      shieldedInstanceConfig: {
        enableIntegrityMonitoring: true,
      },
    },
  }
  // { dependsOn: [quotasCpus] }
);

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

// https://cloud.google.com/kubernetes-engine/docs/how-to/gpus?_ga=2.53663592.-1577952204.1632929004#installing_drivers
export const nvidiaDriverInstaller = new k8s.apps.v1.DaemonSet(
  "nvidia-driver-installer",
  {
    metadata: {
      name: "nvidia-driver-installer",
      namespace: "kube-system",
      labels: {
        "k8s-app": "nvidia-driver-installer",
      },
    },
    spec: {
      selector: {
        matchLabels: {
          "k8s-app": "nvidia-driver-installer",
        },
      },
      updateStrategy: {
        type: "RollingUpdate",
      },
      template: {
        metadata: {
          labels: {
            name: "nvidia-driver-installer",
            "k8s-app": "nvidia-driver-installer",
          },
        },
        spec: {
          affinity: {
            nodeAffinity: {
              requiredDuringSchedulingIgnoredDuringExecution: {
                nodeSelectorTerms: [
                  {
                    matchExpressions: [
                      {
                        key: "cloud.google.com/gke-accelerator",
                        operator: "Exists",
                      },
                    ],
                  },
                ],
              },
            },
          },
          tolerations: [
            {
              operator: "Exists",
            },
          ],
          hostNetwork: true,
          hostPID: true,
          volumes: [
            {
              name: "dev",
              hostPath: {
                path: "/dev",
              },
            },
            {
              name: "vulkan-icd-mount",
              hostPath: {
                path: "/home/kubernetes/bin/nvidia/vulkan/icd.d",
              },
            },
            {
              name: "nvidia-install-dir-host",
              hostPath: {
                path: "/home/kubernetes/bin/nvidia",
              },
            },
            {
              name: "root-mount",
              hostPath: {
                path: "/",
              },
            },
            {
              name: "cos-tools",
              hostPath: {
                path: "/var/lib/cos-tools",
              },
            },
          ],
          initContainers: [
            {
              image: "cos-nvidia-installer:fixed",
              imagePullPolicy: "Never",
              name: "nvidia-driver-installer",
              resources: {
                requests: {
                  cpu: "0.15",
                },
              },
              securityContext: {
                privileged: true,
              },
              env: [
                {
                  name: "NVIDIA_INSTALL_DIR_HOST",
                  value: "/home/kubernetes/bin/nvidia",
                },
                {
                  name: "NVIDIA_INSTALL_DIR_CONTAINER",
                  value: "/usr/local/nvidia",
                },
                {
                  name: "VULKAN_ICD_DIR_HOST",
                  value: "/home/kubernetes/bin/nvidia/vulkan/icd.d",
                },
                {
                  name: "VULKAN_ICD_DIR_CONTAINER",
                  value: "/etc/vulkan/icd.d",
                },
                {
                  name: "ROOT_MOUNT_DIR",
                  value: "/root",
                },
                {
                  name: "COS_TOOLS_DIR_HOST",
                  value: "/var/lib/cos-tools",
                },
                {
                  name: "COS_TOOLS_DIR_CONTAINER",
                  value: "/build/cos-tools",
                },
              ],
              volumeMounts: [
                {
                  name: "nvidia-install-dir-host",
                  mountPath: "/usr/local/nvidia",
                },
                {
                  name: "vulkan-icd-mount",
                  mountPath: "/etc/vulkan/icd.d",
                },
                {
                  name: "dev",
                  mountPath: "/dev",
                },
                {
                  name: "root-mount",
                  mountPath: "/root",
                },
                {
                  name: "cos-tools",
                  mountPath: "/build/cos-tools",
                },
              ],
            },
          ],
          containers: [
            {
              image: "gcr.io/google-containers/pause:2.0",
              name: "pause",
            },
          ],
        },
      },
    },
  },
  { provider: clusterProvider }
);

// Create a Kubernetes Namespace
const ns = new k8s.core.v1.Namespace(
  "test-iog-namespace",
  {},
  { provider: clusterProvider }
);

// Export the Namespace name
export const namespaceName = ns.metadata.apply((m) => m.name);

if (!process.env?.IOG_VERSION) {
  throw new Error("Cannot create deployment: env var IOG_VERSION not set");
}

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
              image: `us-central1-docker.pkg.dev/labelflow-321909/labelflow/iog:${process.env?.IOG_VERSION}`,
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
              resources: {
                limits: {
                  // https://cloud.google.com/kubernetes-engine/docs/how-to/gpus?_ga=2.53663592.-1577952204.1632929004#pods_gpus
                  "nvidia.com/gpu": "1",
                },
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
    spec: { domains: [fullyQualifiedDomain] },
  },
  { provider: clusterProvider }
);

// FIRST DEPLOYMENT ONLY
// const managedCertificateName = managedCertificate.metadata.apply((m) => m.name);

export const ingress = new k8s.networking.v1.Ingress(
  "test-iog-ingress",
  {
    metadata: {
      namespace: namespaceName,
      annotations: {
        "kubernetes.io/ingress.class": "gce",

        // FIRST DEPLOYMENT ONLY
        // "networking.gke.io/managed-certificates": managedCertificateName,

        // See https://github.com/kubernetes/ingress-gce/issues/764
        // NON FIRST DEPLOYMENT ONLY
        "kubernetes.io/ingress.allow-http": "false",
        // NON FIRST DEPLOYMENT ONLY
        "kubernetes.io/ingress.global-static-ip-name": staticIpName,
      },
    },
    spec: {
      rules: [
        {
          host: fullyQualifiedDomain,
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
  name: subdomain,
  zoneId: process.env?.CLOUDFLARE_LABELFLOWNET_ZONE_ID,
  type: "A",
  // value: staticIpAddress, // This seems legit but doesn't work after a while...
  value: ingressIpAddress,
  ttl: 3600,
});
