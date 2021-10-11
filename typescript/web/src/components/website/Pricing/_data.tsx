import {
  // Badge,
  Heading,
  Text,
  Stack,
  Button,
  Stat,
  StatHelpText,
  // StatLabel,
  StatNumber,
  Box,
} from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";

export const data = [
  {
    type: "header",
    description: <Box minW="12em" />,
    free: (
      <Stack>
        <Heading>Free</Heading>
        <Text fontWeight="normal">
          Ideal for testing the platform with smaller volumes and limited
          workforce
        </Text>
      </Stack>
    ),
    starter: (
      <Stack>
        <Heading>Starter</Heading>
        <Text fontWeight="normal">
          Ideal for self-service mid-size projects with limited workforce
        </Text>
      </Stack>
    ),
    pro: (
      <Stack>
        <Heading>Pro</Heading>
        <Text fontWeight="normal">
          Ideal for large volume projects with no set cycle and one-time ML
          tasks
        </Text>
      </Stack>
    ),
    enterprise: (
      <Stack>
        <Heading>Enterprise</Heading>
        <Text fontWeight="normal">
          Best for well-established, strategically defined projects with
          recurring high-volume tasks
        </Text>
      </Stack>
    ),
  },
  {
    description: "Price",
    free: (
      <Stat>
        <StatNumber>$0</StatNumber>
        <StatHelpText>/month</StatHelpText>
      </Stat>
    ),
    starter: (
      <Stat>
        <StatNumber>$59</StatNumber>
        <StatHelpText>/month/user</StatHelpText>
      </Stat>
    ),
    pro: (
      <NextLink href="/request-access">
        <Button>Request a demo</Button>
      </NextLink>
    ),
    enterprise: (
      <NextLink href="/request-access">
        <Button>Contact us</Button>
      </NextLink>
    ),
  },
  {
    description: "Free period",
    free: (
      <Stat>
        <StatNumber>Forever</StatNumber>
        <StatHelpText>Free</StatHelpText>
      </Stat>
    ),
    starter: (
      <Stat>
        <StatNumber>14 days</StatNumber>
        <StatHelpText>Free trial</StatHelpText>
      </Stat>
    ),
    pro: (
      <Stat>
        <StatNumber>14 days</StatNumber>
        <StatHelpText>Free trial</StatHelpText>
      </Stat>
    ),
    enterprise: (
      <NextLink href="/request-access">
        <Button>Contact us</Button>
      </NextLink>
    ),
  },
  {
    description: "Number of users",
    free: "up to 5",
    starter: "up to 25",
    pro: "unlimited",
    enterprise: "unlimited",
  },
  {
    description: "Number of images",
    free: "up to 100/month",
    starter: "up to 10,000/month",
    pro: "unlimited",
    enterprise: "unlimited",
  },

  {
    type: "sectionHeader",
    description: "Label and annotate images",
    free: "",
    starter: "",
    pro: "",
    enterprise: "",
  },
  {
    description: (
      <>
        <Text>Classification editor</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          simply apply labels to whole image
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Vector editor</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          detection bounding box, polygon, ellipse, polyline, keypoints,
          templates, etc.
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Pixel editor</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          semantic and panoptic segmentation
        </Text>
      </>
    ),
    free: "soon",
    starter: "soon",
    pro: "soon",
    enterprise: "soon",
  },

  {
    description: (
      <>
        <Text>Video support</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          videos with tracking of detections between frames
        </Text>
      </>
    ),
    free: "up to 100 frames",
    starter: "up to 100 frames",
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Tiled imagery support</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          geospatial images, maps, orthophotos, large-scale non-gis images, etc.
        </Text>
      </>
    ),
    free: "up to 10 images",
    starter: "up to 10 images",
    pro: true,
    enterprise: true,
  },

  {
    type: "sectionHeader",
    description: "Integrate your data and tools easily",
    free: "",
    starter: "",
    pro: "",
    enterprise: "",
  },
  {
    description: (
      <>
        <Text>Dataset import</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          COCO, Yolo, ImageNet, TFrecord, CSV, PASCAL VOC, etc.
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Dataset export</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          COCO, Yolo, ImageNet, TFrecord, CSV, PASCAL VOC, etc.
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>API access</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          GraphQL and HTTP Rest API
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>SDK access</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Python SDK, Typescript and Javascript SDK
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Pluggable storage</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Amazon S3, Google Cloud Storage, Azure Blob storage, Minio, etc.
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Pluggable database</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          PostgreSQL, MySQL, Snowflake, BigQuery, AWS Redshift, etc.
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Zapier connector</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Connect with 3000+ tools
        </Text>
      </>
    ),
    free: false,
    starter: false,
    pro: "soon",
    enterprise: "soon",
  },

  {
    type: "sectionHeader",
    description: "Manage your data pipelines seamlessly",
    free: "",
    starter: "",
    pro: "",
    enterprise: "",
  },
  {
    description: (
      <>
        <Text>Projects management</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Organize in projects, folders and files
        </Text>
      </>
    ),
    // description: "Project management",
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>User roles</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          QC roles, role-based access control, authorizations, etc.
        </Text>
      </>
    ),
    // description: "User roles",
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Auto Workflows</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Quality management, automatic task distribution, consensus,
          benchmarks, review labels, etc.
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Workflow editor</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Workflow editor with custom steps
        </Text>
      </>
    ),
    free: false,
    starter: false,
    pro: "soon",
    enterprise: "soon",
  },
  {
    type: "sectionHeader",
    description: "Get smart help for your labeling tasks",
    free: "",
    starter: "",
    pro: "",
    enterprise: "",
  },
  {
    description: (
      <>
        <Text>Smart labeling tools</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Label faster thanks to advanced computer-vision-based tools
        </Text>
      </>
    ),
    free: false,
    starter: "soon",
    pro: "soon",
    enterprise: "soon",
  },
  {
    description: (
      <>
        <Text>Pre labeling</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Get your images pre-labelled by your AI or our AI
        </Text>
      </>
    ),
    free: false,
    starter: "soon",
    pro: "soon",
    enterprise: "soon",
  },
  {
    description: (
      <>
        <Text>Your AI in the loop</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Have your AI assist your labeling and learn continuously
        </Text>
      </>
    ),
    free: false,
    starter: "soon",
    pro: "soon",
    enterprise: "soon",
  },
  {
    description: (
      <>
        <Text>Active learning</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Label in priority images that your AI is confused about
        </Text>
      </>
    ),
    free: false,
    starter: "soon",
    pro: "soon",
    enterprise: "soon",
  },
  {
    description: (
      <>
        <Text>Humans labeling marketplace</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Get real humans in the loop through our marketplace
        </Text>
      </>
    ),
    free: false,
    starter: "soon",
    pro: "soon",
    enterprise: "soon",
  },
  {
    type: "sectionHeader",
    description: "Analyze performance and get insights",
    free: "",
    starter: "",
    pro: "",
    enterprise: "",
  },
  {
    description: (
      <>
        <Text>Annotator Analytics</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Dashboards to analyze performance and quality of annotators
        </Text>
      </>
    ),

    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Task Analytics</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Analyze your labeling tasks, identify hard ones and better plan
          campaigns
        </Text>
      </>
    ),

    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Dataset Analytics</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Analyze datasets and models, identify issues in your datasets
        </Text>
      </>
    ),

    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    type: "sectionHeader",
    description: "Own your data and ensure compliance and security",
    free: "",
    starter: "",
    pro: "",
    enterprise: "",
  },
  {
    description: (
      <>
        <Text>Fully compliant solution</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          SOC II, ISO 27001 compliance
        </Text>
      </>
    ),

    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>On-premise backend</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Fully on-premise and airgapped image store and database. No data goes
          through LabelFlow servers
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>White label deployment</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Deploy LabelFlow as part of your solution. JS components and server.
        </Text>
      </>
    ),
    free: false,
    starter: false,
    pro: "add-on",
    enterprise: "add-on",
  },
  {
    description: (
      <>
        <Text>On-premise frontend</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Fully on-premise or airgapped deployment of the entire solution
        </Text>
      </>
    ),
    free: false,
    starter: false,
    pro: false,
    enterprise: "soon",
  },
  {
    description: (
      <>
        <Text>Single Sign On</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          SSO, SAML, and Enterprise authentication features
        </Text>
      </>
    ),
    free: false,
    starter: false,
    pro: false,
    enterprise: "soon",
  },
  {
    description: (
      <>
        <Text>Compliance Controls</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          PII and GDPR data controls, Audit logs visibility on all account
          activity
        </Text>
      </>
    ),
    free: false,
    starter: false,
    pro: false,
    enterprise: "soon",
  },
  {
    type: "sectionHeader",
    description: "Get support and access the community",
    free: "",
    starter: "",
    pro: "",
    enterprise: "",
  },
  {
    description: (
      <>
        <Text>Public community</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Github issues and discussions
        </Text>
      </>
    ),
    free: true,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Community</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Access to a vibrant community on Slack
        </Text>
      </>
    ),
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Basic support</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Chat and email support
        </Text>
      </>
    ),
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Humans labeling marketplace</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Get human workers to help label your data
        </Text>
      </>
    ),
    free: false,
    starter: "soon",
    pro: "soon",
    enterprise: "soon",
  },

  {
    description: (
      <>
        <Text>Advanced support</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Slack channel, dedicated success manager and engineers
        </Text>
      </>
    ),
    free: false,
    starter: false,
    pro: true,
    enterprise: true,
  },
  {
    description: (
      <>
        <Text>Enterprise support</Text>
        <Text fontSize="xs" lineHeight="1" color="gray.500">
          Dedicated ML engineer and consulting to ensure smooth operation
        </Text>
      </>
    ),
    free: false,
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    type: "header",
    description: <Box minW="12em" />,
    free: (
      <Stack>
        <Heading>Free</Heading>
        {/* <Text fontWeight="normal">
          Ideal for testing the platform with smaller volumes and limited
          workforce
        </Text> */}
      </Stack>
    ),
    starter: (
      <Stack>
        <Heading>Starter</Heading>
        {/* <Text fontWeight="normal">
          Ideal for self-service mid-size projects with limited workforce
        </Text> */}
      </Stack>
    ),
    pro: (
      <Stack>
        <Heading>Pro</Heading>
        {/* <Text fontWeight="normal">
          Ideal for large volume projects with no set cycle and one-time ML
          tasks
        </Text> */}
      </Stack>
    ),
    enterprise: (
      <Stack>
        <Heading>Enterprise</Heading>
        {/* <Text fontWeight="normal">
          Best for well-established, strategically defined projects with
          recurring high-volume tasks
        </Text> */}
      </Stack>
    ),
  },
  {
    type: "header",
    description: <Box minW="12em" />,
    free: (
      <NextLink href="/local/datasets">
        <Button colorScheme="brand">Try it now</Button>
      </NextLink>
    ),
    starter: (
      <NextLink href="/request-access">
        <Button colorScheme="brand">Request Access</Button>
      </NextLink>
    ),
    pro: (
      <NextLink href="/request-access">
        <Button colorScheme="brand">Request a demo</Button>
      </NextLink>
    ),
    enterprise: (
      <NextLink href="/request-access">
        <Button colorScheme="brand">Contact us</Button>
      </NextLink>
    ),
  },
];

export const columns = [
  {
    accessor: "description",
  },
  {
    accessor: "free",
  },
  {
    accessor: "starter",
  },
  {
    accessor: "pro",
  },
  {
    accessor: "enterprise",
  },
];
