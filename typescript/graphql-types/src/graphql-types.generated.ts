import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ColorHex: any;
  DateTime: any;
  JSON: any;
  Upload: any;
};

export type CreateIogLabelInput = {
  centerPoint: Array<Scalars['Float']>;
  height: Scalars['Float'];
  id?: InputMaybe<Scalars['ID']>;
  imageId: Scalars['String'];
  labelClassId?: InputMaybe<Scalars['ID']>;
  width: Scalars['Float'];
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export enum CurrentUserCanAcceptInvitation {
  AlreadyAccepted = 'AlreadyAccepted',
  AlreadyDeclined = 'AlreadyDeclined',
  AlreadyMemberOfTheWorkspace = 'AlreadyMemberOfTheWorkspace',
  Yes = 'Yes'
}

export type Dataset = {
  __typename?: 'Dataset';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  images: Array<Image>;
  imagesAggregates: ImagesAggregates;
  labelClasses: Array<LabelClass>;
  labelClassesAggregates: LabelClassesAggregates;
  labels: Array<Label>;
  labelsAggregates: LabelsAggregates;
  name: Scalars['String'];
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  workspace: Workspace;
};


export type DatasetImagesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type DatasetCreateInput = {
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  workspaceSlug: Scalars['String'];
};

export type DatasetImportInput = {
  format: ExportFormat;
  options?: InputMaybe<ImportOptions>;
  url: Scalars['String'];
};

export type DatasetUpdateInput = {
  name: Scalars['String'];
};

export type DatasetWhereInput = {
  workspaceSlug: Scalars['String'];
};

export type DatasetWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
  slugs?: InputMaybe<WorkspaceSlugAndDatasetSlug>;
};

export type Example = {
  __typename?: 'Example';
  createdAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ExampleCreateInput = {
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export enum ExampleOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type ExampleWhereInput = {
  id?: InputMaybe<Scalars['ID']>;
};

export type ExampleWhereUniqueInput = {
  id: Scalars['ID'];
};

export enum ExportFormat {
  Coco = 'COCO',
  Csv = 'CSV',
  Yolo = 'YOLO'
}

export type ExportOptions = {
  coco?: InputMaybe<ExportOptionsCoco>;
  csv?: InputMaybe<ExportOptionsCsv>;
  yolo?: InputMaybe<ExportOptionsYolo>;
};

export type ExportOptionsCoco = {
  avoidImageNameCollisions?: InputMaybe<Scalars['Boolean']>;
  exportImages?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ExportOptionsCsv = {
  name?: InputMaybe<Scalars['String']>;
};

export type ExportOptionsYolo = {
  avoidImageNameCollisions?: InputMaybe<Scalars['Boolean']>;
  exportImages?: InputMaybe<Scalars['Boolean']>;
  includePolygons?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ExportWhereUniqueInput = {
  datasetId: Scalars['ID'];
};

export type Geometry = {
  __typename?: 'Geometry';
  coordinates: Scalars['JSON'];
  type: Scalars['String'];
};

export type GeometryInput = {
  coordinates: Scalars['JSON'];
  type: Scalars['String'];
};

export type IdInInput = {
  in: Array<Scalars['ID']>;
};

export type Image = {
  __typename?: 'Image';
  createdAt: Scalars['DateTime'];
  dataset: Dataset;
  externalUrl?: Maybe<Scalars['String']>;
  height: Scalars['Int'];
  id: Scalars['ID'];
  labels: Array<Label>;
  metadata?: Maybe<Scalars['JSON']>;
  mimetype: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
  thumbnail20Url?: Maybe<Scalars['String']>;
  thumbnail50Url?: Maybe<Scalars['String']>;
  thumbnail100Url?: Maybe<Scalars['String']>;
  thumbnail200Url?: Maybe<Scalars['String']>;
  thumbnail500Url?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
  width: Scalars['Int'];
};

export type ImageCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  datasetId: Scalars['ID'];
  externalUrl?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['Upload']>;
  height?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  metadata?: InputMaybe<Scalars['JSON']>;
  mimetype?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  noThumbnails?: InputMaybe<Scalars['Boolean']>;
  path?: InputMaybe<Scalars['String']>;
  thumbnail20Url?: InputMaybe<Scalars['String']>;
  thumbnail50Url?: InputMaybe<Scalars['String']>;
  thumbnail100Url?: InputMaybe<Scalars['String']>;
  thumbnail200Url?: InputMaybe<Scalars['String']>;
  thumbnail500Url?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  width?: InputMaybe<Scalars['Int']>;
};

export type ImageCreateManyInput = {
  datasetId: Scalars['ID'];
  images: Array<ImageCreateManySingleInput>;
};

export type ImageCreateManySingleInput = {
  createdAt?: InputMaybe<Scalars['DateTime']>;
  externalUrl?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['Upload']>;
  height?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  mimetype?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  noThumbnails?: InputMaybe<Scalars['Boolean']>;
  path?: InputMaybe<Scalars['String']>;
  thumbnail20Url?: InputMaybe<Scalars['String']>;
  thumbnail50Url?: InputMaybe<Scalars['String']>;
  thumbnail100Url?: InputMaybe<Scalars['String']>;
  thumbnail200Url?: InputMaybe<Scalars['String']>;
  thumbnail500Url?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  width?: InputMaybe<Scalars['Int']>;
};

export type ImageUpdateInput = {
  thumbnail20Url?: InputMaybe<Scalars['String']>;
  thumbnail50Url?: InputMaybe<Scalars['String']>;
  thumbnail100Url?: InputMaybe<Scalars['String']>;
  thumbnail200Url?: InputMaybe<Scalars['String']>;
  thumbnail500Url?: InputMaybe<Scalars['String']>;
};

export type ImageWhereInput = {
  datasetId?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<IdInInput>;
};

export type ImageWhereUniqueInput = {
  id: Scalars['ID'];
};

export type ImagesAggregates = {
  __typename?: 'ImagesAggregates';
  totalCount: Scalars['Int'];
};

export type ImportOptions = {
  coco?: InputMaybe<ImportOptionsCoco>;
};

export type ImportOptionsCoco = {
  annotationsOnly?: InputMaybe<Scalars['Boolean']>;
};

export type ImportStatus = {
  __typename?: 'ImportStatus';
  error?: Maybe<Scalars['String']>;
  warnings?: Maybe<Array<Scalars['String']>>;
};

export enum InvitationResult {
  Error = 'Error',
  Sent = 'Sent',
  UserAlreadyIn = 'UserAlreadyIn'
}

export type InviteMemberInput = {
  email: Scalars['String'];
  role: MembershipRole;
  workspaceSlug: Scalars['String'];
};

export type Label = {
  __typename?: 'Label';
  createdAt: Scalars['DateTime'];
  geometry: Geometry;
  height: Scalars['Float'];
  id: Scalars['ID'];
  imageId: Scalars['ID'];
  labelClass?: Maybe<LabelClass>;
  smartToolInput?: Maybe<Scalars['JSON']>;
  type: LabelType;
  updatedAt: Scalars['DateTime'];
  width: Scalars['Float'];
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type LabelClass = {
  __typename?: 'LabelClass';
  color: Scalars['ColorHex'];
  createdAt: Scalars['DateTime'];
  dataset: Dataset;
  id: Scalars['ID'];
  index: Scalars['Int'];
  labels: Array<Label>;
  labelsAggregates: LabelsAggregates;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type LabelClassCreateInput = {
  color?: InputMaybe<Scalars['ColorHex']>;
  datasetId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type LabelClassCreateManyInput = {
  datasetId: Scalars['ID'];
  labelClasses: Array<LabelClassCreateManySingleInput>;
};

export type LabelClassCreateManySingleInput = {
  color?: InputMaybe<Scalars['ColorHex']>;
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type LabelClassReorderInput = {
  index: Scalars['Int'];
};

export type LabelClassUpdateInput = {
  color?: InputMaybe<Scalars['ColorHex']>;
  name?: InputMaybe<Scalars['String']>;
};

export type LabelClassWhereInput = {
  datasetId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type LabelClassWhereUniqueInput = {
  id: Scalars['ID'];
};

export type LabelClassesAggregates = {
  __typename?: 'LabelClassesAggregates';
  totalCount: Scalars['Int'];
};

export type LabelCreateInput = {
  geometry: GeometryInput;
  id?: InputMaybe<Scalars['ID']>;
  imageId: Scalars['ID'];
  labelClassId?: InputMaybe<Scalars['ID']>;
  smartToolInput?: InputMaybe<Scalars['JSON']>;
  type?: InputMaybe<LabelType>;
};

export enum LabelType {
  Box = 'Box',
  Classification = 'Classification',
  Polygon = 'Polygon'
}

export type LabelUpdateInput = {
  geometry?: InputMaybe<GeometryInput>;
  labelClassId?: InputMaybe<Scalars['ID']>;
  smartToolInput?: InputMaybe<Scalars['JSON']>;
};

export type LabelWhereInput = {
  datasetId?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<IdInInput>;
  imageId?: InputMaybe<Scalars['ID']>;
  labelClassId?: InputMaybe<Scalars['ID']>;
};

export type LabelWhereUniqueInput = {
  id: Scalars['ID'];
};

export type LabelsAggregates = {
  __typename?: 'LabelsAggregates';
  totalCount: Scalars['Int'];
};

export type Membership = {
  __typename?: 'Membership';
  createdAt: Scalars['DateTime'];
  currentUserCanAcceptInvitation: CurrentUserCanAcceptInvitation;
  declinedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  invitationEmailSentTo?: Maybe<Scalars['String']>;
  role: MembershipRole;
  status: MembershipStatus;
  updatedAt: Scalars['DateTime'];
  user?: Maybe<User>;
  workspace: Workspace;
};

export type MembershipCreateInput = {
  id?: InputMaybe<Scalars['ID']>;
  role: MembershipRole;
  userId?: InputMaybe<Scalars['ID']>;
  workspaceSlug: Scalars['String'];
};

export enum MembershipRole {
  Admin = 'Admin',
  Member = 'Member',
  Owner = 'Owner'
}

export enum MembershipStatus {
  Active = 'Active',
  Declined = 'Declined',
  Sent = 'Sent'
}

export type MembershipUpdateInput = {
  role?: InputMaybe<MembershipRole>;
};

export type MembershipWhereInput = {
  workspaceSlug?: InputMaybe<Scalars['String']>;
};

export type MembershipWhereUniqueInput = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation?: Maybe<Membership>;
  createDataset?: Maybe<Dataset>;
  createExample?: Maybe<Example>;
  createImage?: Maybe<Image>;
  createIogLabel?: Maybe<Label>;
  createLabel?: Maybe<Label>;
  createLabelClass?: Maybe<LabelClass>;
  createManyImages: Array<Image>;
  createManyLabelClasses: Array<LabelClass>;
  createMembership?: Maybe<Membership>;
  createWorkspace?: Maybe<Workspace>;
  declineInvitation?: Maybe<Membership>;
  deleteDataset?: Maybe<Dataset>;
  deleteImage?: Maybe<Image>;
  deleteLabel?: Maybe<Label>;
  deleteLabelClass?: Maybe<LabelClass>;
  deleteManyImages: Scalars['Int'];
  deleteManyLabels: Array<Label>;
  deleteMembership?: Maybe<Membership>;
  deleteWorkspace?: Maybe<Workspace>;
  getUploadTarget: UploadTarget;
  importDataset?: Maybe<ImportStatus>;
  inviteMember?: Maybe<InvitationResult>;
  reorderLabelClass?: Maybe<LabelClass>;
  runAiAssistant: RunAiAssistantOutput;
  updateDataset?: Maybe<Dataset>;
  updateImage?: Maybe<Image>;
  updateIogLabel?: Maybe<Label>;
  updateLabel?: Maybe<Label>;
  updateLabelClass?: Maybe<LabelClass>;
  updateMembership?: Maybe<Membership>;
  updateUser?: Maybe<User>;
  updateWorkspace?: Maybe<Workspace>;
};


export type MutationAcceptInvitationArgs = {
  where: MembershipWhereUniqueInput;
};


export type MutationCreateDatasetArgs = {
  data: DatasetCreateInput;
};


export type MutationCreateExampleArgs = {
  data: ExampleCreateInput;
};


export type MutationCreateImageArgs = {
  data: ImageCreateInput;
};


export type MutationCreateIogLabelArgs = {
  data: CreateIogLabelInput;
};


export type MutationCreateLabelArgs = {
  data: LabelCreateInput;
};


export type MutationCreateLabelClassArgs = {
  data: LabelClassCreateInput;
};


export type MutationCreateManyImagesArgs = {
  data: ImageCreateManyInput;
};


export type MutationCreateManyLabelClassesArgs = {
  data: LabelClassCreateManyInput;
};


export type MutationCreateMembershipArgs = {
  data: MembershipCreateInput;
};


export type MutationCreateWorkspaceArgs = {
  data: WorkspaceCreateInput;
  options?: InputMaybe<WorkspaceCreateOptions>;
};


export type MutationDeclineInvitationArgs = {
  where: MembershipWhereUniqueInput;
};


export type MutationDeleteDatasetArgs = {
  where: DatasetWhereUniqueInput;
};


export type MutationDeleteImageArgs = {
  where: ImageWhereUniqueInput;
};


export type MutationDeleteLabelArgs = {
  where: LabelWhereUniqueInput;
};


export type MutationDeleteLabelClassArgs = {
  where: LabelClassWhereUniqueInput;
};


export type MutationDeleteManyImagesArgs = {
  where: ImageWhereInput;
};


export type MutationDeleteManyLabelsArgs = {
  where: LabelWhereInput;
};


export type MutationDeleteMembershipArgs = {
  where: MembershipWhereUniqueInput;
};


export type MutationDeleteWorkspaceArgs = {
  where: WorkspaceWhereUniqueInput;
};


export type MutationGetUploadTargetArgs = {
  data: UploadTargetInput;
};


export type MutationImportDatasetArgs = {
  data: DatasetImportInput;
  where: DatasetWhereUniqueInput;
};


export type MutationInviteMemberArgs = {
  where: InviteMemberInput;
};


export type MutationReorderLabelClassArgs = {
  data: LabelClassReorderInput;
  where: LabelClassWhereUniqueInput;
};


export type MutationRunAiAssistantArgs = {
  data: RunAiAssistantInput;
};


export type MutationUpdateDatasetArgs = {
  data: DatasetUpdateInput;
  where: DatasetWhereUniqueInput;
};


export type MutationUpdateImageArgs = {
  data: ImageUpdateInput;
  where: ImageWhereUniqueInput;
};


export type MutationUpdateIogLabelArgs = {
  data: UpdateIogInput;
};


export type MutationUpdateLabelArgs = {
  data: LabelUpdateInput;
  where: LabelWhereUniqueInput;
};


export type MutationUpdateLabelClassArgs = {
  data: LabelClassUpdateInput;
  where: LabelClassWhereUniqueInput;
};


export type MutationUpdateMembershipArgs = {
  data: MembershipUpdateInput;
  where: MembershipWhereUniqueInput;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};


export type MutationUpdateWorkspaceArgs = {
  data: WorkspaceUpdateInput;
  where: WorkspaceWhereUniqueInput;
};

export type Query = {
  __typename?: 'Query';
  dataset: Dataset;
  datasets: Array<Dataset>;
  debug: Scalars['JSON'];
  example: Example;
  examples: Array<Example>;
  exportDataset: Scalars['String'];
  hello?: Maybe<Scalars['String']>;
  image: Image;
  images: Array<Image>;
  imagesAggregates: ImagesAggregates;
  label: Label;
  labelClass: LabelClass;
  labelClassExists: Scalars['Boolean'];
  labelClasses: Array<LabelClass>;
  labelClassesAggregates: LabelClassesAggregates;
  labels: Array<Label>;
  labelsAggregates: LabelsAggregates;
  membership: Membership;
  memberships: Array<Membership>;
  searchDataset?: Maybe<Dataset>;
  user: User;
  users: Array<User>;
  workspace: Workspace;
  workspaceExists: Scalars['Boolean'];
  workspaces: Array<Workspace>;
};


export type QueryDatasetArgs = {
  where: DatasetWhereUniqueInput;
};


export type QueryDatasetsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DatasetWhereInput>;
};


export type QueryExampleArgs = {
  where: ExampleWhereUniqueInput;
};


export type QueryExamplesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ExampleOrderByInput>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ExampleWhereInput>;
};


export type QueryExportDatasetArgs = {
  format: ExportFormat;
  options?: InputMaybe<ExportOptions>;
  where: ExportWhereUniqueInput;
};


export type QueryImageArgs = {
  where: ImageWhereUniqueInput;
};


export type QueryImagesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ImageWhereInput>;
};


export type QueryLabelArgs = {
  where: LabelWhereUniqueInput;
};


export type QueryLabelClassArgs = {
  where: LabelClassWhereUniqueInput;
};


export type QueryLabelClassExistsArgs = {
  where: LabelClassWhereInput;
};


export type QueryLabelClassesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LabelClassWhereInput>;
};


export type QueryLabelsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LabelWhereInput>;
};


export type QueryMembershipArgs = {
  where: MembershipWhereUniqueInput;
};


export type QueryMembershipsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MembershipWhereInput>;
};


export type QuerySearchDatasetArgs = {
  where: DatasetWhereUniqueInput;
};


export type QueryUserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryUsersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryWorkspaceArgs = {
  where: WorkspaceWhereUniqueInput;
};


export type QueryWorkspaceExistsArgs = {
  where: WorkspaceWhereUniqueInput;
};


export type QueryWorkspacesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkspaceWhereInput>;
};

export type RunAiAssistantInput = {
  aiAssistantId: Scalars['ID'];
  imageId: Scalars['ID'];
  useAutoPolygon?: InputMaybe<Scalars['Boolean']>;
};

export type RunAiAssistantOutput = {
  __typename?: 'RunAiAssistantOutput';
  labelClasses: Array<Scalars['ID']>;
  labels: Array<Label>;
};

export type RunIogInput = {
  centerPoint?: InputMaybe<Array<Scalars['Float']>>;
  height?: InputMaybe<Scalars['Float']>;
  id: Scalars['ID'];
  imageUrl?: InputMaybe<Scalars['String']>;
  pointsInside?: InputMaybe<Array<InputMaybe<Array<Scalars['Float']>>>>;
  pointsOutside?: InputMaybe<Array<InputMaybe<Array<Scalars['Float']>>>>;
  width?: InputMaybe<Scalars['Float']>;
  x?: InputMaybe<Scalars['Float']>;
  y?: InputMaybe<Scalars['Float']>;
};

export type UpdateIogInput = {
  centerPoint?: InputMaybe<Array<Scalars['Float']>>;
  height?: InputMaybe<Scalars['Float']>;
  id: Scalars['ID'];
  pointsInside?: InputMaybe<Array<InputMaybe<Array<Scalars['Float']>>>>;
  pointsOutside?: InputMaybe<Array<InputMaybe<Array<Scalars['Float']>>>>;
  width?: InputMaybe<Scalars['Float']>;
  x?: InputMaybe<Scalars['Float']>;
  y?: InputMaybe<Scalars['Float']>;
};

export type UploadTarget = UploadTargetDirect | UploadTargetHttp;

export type UploadTargetDirect = {
  __typename?: 'UploadTargetDirect';
  direct: Scalars['Boolean'];
};

export type UploadTargetHttp = {
  __typename?: 'UploadTargetHttp';
  downloadUrl: Scalars['String'];
  uploadUrl: Scalars['String'];
};

export type UploadTargetInput = {
  key: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  memberships: Array<Membership>;
  name?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type UserUpdateInput = {
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UserWhereUniqueInput = {
  id: Scalars['ID'];
};

export type Workspace = {
  __typename?: 'Workspace';
  createdAt: Scalars['DateTime'];
  datasets: Array<Dataset>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  imagesAggregates: ImagesAggregates;
  memberships: Array<Membership>;
  name: Scalars['String'];
  plan: WorkspacePlan;
  slug: Scalars['String'];
  status: WorkspaceStatus;
  stripeCustomerPortalUrl?: Maybe<Scalars['String']>;
  type: WorkspaceType;
  updatedAt: Scalars['DateTime'];
};

export type WorkspaceCreateInput = {
  id?: InputMaybe<Scalars['ID']>;
  image?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  plan?: InputMaybe<WorkspacePlan>;
};

export type WorkspaceCreateOptions = {
  createTutorial?: InputMaybe<Scalars['Boolean']>;
};

export enum WorkspacePlan {
  Community = 'Community',
  Pro = 'Pro',
  Starter = 'Starter'
}

export type WorkspaceSlugAndDatasetSlug = {
  slug: Scalars['String'];
  workspaceSlug: Scalars['String'];
};

export enum WorkspaceStatus {
  Active = 'Active',
  Canceled = 'Canceled',
  Incomplete = 'Incomplete',
  IncompleteExpired = 'IncompleteExpired',
  PastDue = 'PastDue',
  Trialing = 'Trialing',
  Unpaid = 'Unpaid'
}

export enum WorkspaceType {
  Local = 'Local',
  Online = 'Online'
}

export type WorkspaceUpdateInput = {
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type WorkspaceWhereInput = {
  slug?: InputMaybe<Scalars['String']>;
};

export type WorkspaceWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ColorHex: ResolverTypeWrapper<Scalars['ColorHex']>;
  CreateIogLabelInput: CreateIogLabelInput;
  CurrentUserCanAcceptInvitation: CurrentUserCanAcceptInvitation;
  Dataset: ResolverTypeWrapper<Dataset>;
  DatasetCreateInput: DatasetCreateInput;
  DatasetImportInput: DatasetImportInput;
  DatasetUpdateInput: DatasetUpdateInput;
  DatasetWhereInput: DatasetWhereInput;
  DatasetWhereUniqueInput: DatasetWhereUniqueInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Example: ResolverTypeWrapper<Example>;
  ExampleCreateInput: ExampleCreateInput;
  ExampleOrderByInput: ExampleOrderByInput;
  ExampleWhereInput: ExampleWhereInput;
  ExampleWhereUniqueInput: ExampleWhereUniqueInput;
  ExportFormat: ExportFormat;
  ExportOptions: ExportOptions;
  ExportOptionsCoco: ExportOptionsCoco;
  ExportOptionsCsv: ExportOptionsCsv;
  ExportOptionsYolo: ExportOptionsYolo;
  ExportWhereUniqueInput: ExportWhereUniqueInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Geometry: ResolverTypeWrapper<Geometry>;
  GeometryInput: GeometryInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IdInInput: IdInInput;
  Image: ResolverTypeWrapper<Image>;
  ImageCreateInput: ImageCreateInput;
  ImageCreateManyInput: ImageCreateManyInput;
  ImageCreateManySingleInput: ImageCreateManySingleInput;
  ImageUpdateInput: ImageUpdateInput;
  ImageWhereInput: ImageWhereInput;
  ImageWhereUniqueInput: ImageWhereUniqueInput;
  ImagesAggregates: ResolverTypeWrapper<ImagesAggregates>;
  ImportOptions: ImportOptions;
  ImportOptionsCoco: ImportOptionsCoco;
  ImportStatus: ResolverTypeWrapper<ImportStatus>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  InvitationResult: InvitationResult;
  InviteMemberInput: InviteMemberInput;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Label: ResolverTypeWrapper<Label>;
  LabelClass: ResolverTypeWrapper<LabelClass>;
  LabelClassCreateInput: LabelClassCreateInput;
  LabelClassCreateManyInput: LabelClassCreateManyInput;
  LabelClassCreateManySingleInput: LabelClassCreateManySingleInput;
  LabelClassReorderInput: LabelClassReorderInput;
  LabelClassUpdateInput: LabelClassUpdateInput;
  LabelClassWhereInput: LabelClassWhereInput;
  LabelClassWhereUniqueInput: LabelClassWhereUniqueInput;
  LabelClassesAggregates: ResolverTypeWrapper<LabelClassesAggregates>;
  LabelCreateInput: LabelCreateInput;
  LabelType: LabelType;
  LabelUpdateInput: LabelUpdateInput;
  LabelWhereInput: LabelWhereInput;
  LabelWhereUniqueInput: LabelWhereUniqueInput;
  LabelsAggregates: ResolverTypeWrapper<LabelsAggregates>;
  Membership: ResolverTypeWrapper<Membership>;
  MembershipCreateInput: MembershipCreateInput;
  MembershipRole: MembershipRole;
  MembershipStatus: MembershipStatus;
  MembershipUpdateInput: MembershipUpdateInput;
  MembershipWhereInput: MembershipWhereInput;
  MembershipWhereUniqueInput: MembershipWhereUniqueInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RunAiAssistantInput: RunAiAssistantInput;
  RunAiAssistantOutput: ResolverTypeWrapper<RunAiAssistantOutput>;
  RunIogInput: RunIogInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateIogInput: UpdateIogInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UploadTarget: ResolversTypes['UploadTargetDirect'] | ResolversTypes['UploadTargetHttp'];
  UploadTargetDirect: ResolverTypeWrapper<UploadTargetDirect>;
  UploadTargetHttp: ResolverTypeWrapper<UploadTargetHttp>;
  UploadTargetInput: UploadTargetInput;
  User: ResolverTypeWrapper<User>;
  UserUpdateInput: UserUpdateInput;
  UserWhereUniqueInput: UserWhereUniqueInput;
  Workspace: ResolverTypeWrapper<Workspace>;
  WorkspaceCreateInput: WorkspaceCreateInput;
  WorkspaceCreateOptions: WorkspaceCreateOptions;
  WorkspacePlan: WorkspacePlan;
  WorkspaceSlugAndDatasetSlug: WorkspaceSlugAndDatasetSlug;
  WorkspaceStatus: WorkspaceStatus;
  WorkspaceType: WorkspaceType;
  WorkspaceUpdateInput: WorkspaceUpdateInput;
  WorkspaceWhereInput: WorkspaceWhereInput;
  WorkspaceWhereUniqueInput: WorkspaceWhereUniqueInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  ColorHex: Scalars['ColorHex'];
  CreateIogLabelInput: CreateIogLabelInput;
  Dataset: Dataset;
  DatasetCreateInput: DatasetCreateInput;
  DatasetImportInput: DatasetImportInput;
  DatasetUpdateInput: DatasetUpdateInput;
  DatasetWhereInput: DatasetWhereInput;
  DatasetWhereUniqueInput: DatasetWhereUniqueInput;
  DateTime: Scalars['DateTime'];
  Example: Example;
  ExampleCreateInput: ExampleCreateInput;
  ExampleWhereInput: ExampleWhereInput;
  ExampleWhereUniqueInput: ExampleWhereUniqueInput;
  ExportOptions: ExportOptions;
  ExportOptionsCoco: ExportOptionsCoco;
  ExportOptionsCsv: ExportOptionsCsv;
  ExportOptionsYolo: ExportOptionsYolo;
  ExportWhereUniqueInput: ExportWhereUniqueInput;
  Float: Scalars['Float'];
  Geometry: Geometry;
  GeometryInput: GeometryInput;
  ID: Scalars['ID'];
  IdInInput: IdInInput;
  Image: Image;
  ImageCreateInput: ImageCreateInput;
  ImageCreateManyInput: ImageCreateManyInput;
  ImageCreateManySingleInput: ImageCreateManySingleInput;
  ImageUpdateInput: ImageUpdateInput;
  ImageWhereInput: ImageWhereInput;
  ImageWhereUniqueInput: ImageWhereUniqueInput;
  ImagesAggregates: ImagesAggregates;
  ImportOptions: ImportOptions;
  ImportOptionsCoco: ImportOptionsCoco;
  ImportStatus: ImportStatus;
  Int: Scalars['Int'];
  InviteMemberInput: InviteMemberInput;
  JSON: Scalars['JSON'];
  Label: Label;
  LabelClass: LabelClass;
  LabelClassCreateInput: LabelClassCreateInput;
  LabelClassCreateManyInput: LabelClassCreateManyInput;
  LabelClassCreateManySingleInput: LabelClassCreateManySingleInput;
  LabelClassReorderInput: LabelClassReorderInput;
  LabelClassUpdateInput: LabelClassUpdateInput;
  LabelClassWhereInput: LabelClassWhereInput;
  LabelClassWhereUniqueInput: LabelClassWhereUniqueInput;
  LabelClassesAggregates: LabelClassesAggregates;
  LabelCreateInput: LabelCreateInput;
  LabelUpdateInput: LabelUpdateInput;
  LabelWhereInput: LabelWhereInput;
  LabelWhereUniqueInput: LabelWhereUniqueInput;
  LabelsAggregates: LabelsAggregates;
  Membership: Membership;
  MembershipCreateInput: MembershipCreateInput;
  MembershipUpdateInput: MembershipUpdateInput;
  MembershipWhereInput: MembershipWhereInput;
  MembershipWhereUniqueInput: MembershipWhereUniqueInput;
  Mutation: {};
  Query: {};
  RunAiAssistantInput: RunAiAssistantInput;
  RunAiAssistantOutput: RunAiAssistantOutput;
  RunIogInput: RunIogInput;
  String: Scalars['String'];
  UpdateIogInput: UpdateIogInput;
  Upload: Scalars['Upload'];
  UploadTarget: ResolversParentTypes['UploadTargetDirect'] | ResolversParentTypes['UploadTargetHttp'];
  UploadTargetDirect: UploadTargetDirect;
  UploadTargetHttp: UploadTargetHttp;
  UploadTargetInput: UploadTargetInput;
  User: User;
  UserUpdateInput: UserUpdateInput;
  UserWhereUniqueInput: UserWhereUniqueInput;
  Workspace: Workspace;
  WorkspaceCreateInput: WorkspaceCreateInput;
  WorkspaceCreateOptions: WorkspaceCreateOptions;
  WorkspaceSlugAndDatasetSlug: WorkspaceSlugAndDatasetSlug;
  WorkspaceUpdateInput: WorkspaceUpdateInput;
  WorkspaceWhereInput: WorkspaceWhereInput;
  WorkspaceWhereUniqueInput: WorkspaceWhereUniqueInput;
};

export interface ColorHexScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ColorHex'], any> {
  name: 'ColorHex';
}

export type DatasetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dataset'] = ResolversParentTypes['Dataset']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, Partial<DatasetImagesArgs>>;
  imagesAggregates?: Resolver<ResolversTypes['ImagesAggregates'], ParentType, ContextType>;
  labelClasses?: Resolver<Array<ResolversTypes['LabelClass']>, ParentType, ContextType>;
  labelClassesAggregates?: Resolver<ResolversTypes['LabelClassesAggregates'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  labelsAggregates?: Resolver<ResolversTypes['LabelsAggregates'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  workspace?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ExampleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Example'] = ResolversParentTypes['Example']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeometryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Geometry'] = ResolversParentTypes['Geometry']> = {
  coordinates?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dataset?: Resolver<ResolversTypes['Dataset'], ParentType, ContextType>;
  externalUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail20Url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail50Url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail100Url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail200Url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail500Url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImagesAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImagesAggregates'] = ResolversParentTypes['ImagesAggregates']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportStatus'] = ResolversParentTypes['ImportStatus']> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  warnings?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Label'] = ResolversParentTypes['Label']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  geometry?: Resolver<ResolversTypes['Geometry'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType>;
  smartToolInput?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['LabelType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelClassResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabelClass'] = ResolversParentTypes['LabelClass']> = {
  color?: Resolver<ResolversTypes['ColorHex'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dataset?: Resolver<ResolversTypes['Dataset'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  labelsAggregates?: Resolver<ResolversTypes['LabelsAggregates'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelClassesAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabelClassesAggregates'] = ResolversParentTypes['LabelClassesAggregates']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelsAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabelsAggregates'] = ResolversParentTypes['LabelsAggregates']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MembershipResolvers<ContextType = any, ParentType extends ResolversParentTypes['Membership'] = ResolversParentTypes['Membership']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentUserCanAcceptInvitation?: Resolver<ResolversTypes['CurrentUserCanAcceptInvitation'], ParentType, ContextType>;
  declinedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invitationEmailSentTo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['MembershipRole'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MembershipStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  workspace?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptInvitation?: Resolver<Maybe<ResolversTypes['Membership']>, ParentType, ContextType, RequireFields<MutationAcceptInvitationArgs, 'where'>>;
  createDataset?: Resolver<Maybe<ResolversTypes['Dataset']>, ParentType, ContextType, RequireFields<MutationCreateDatasetArgs, 'data'>>;
  createExample?: Resolver<Maybe<ResolversTypes['Example']>, ParentType, ContextType, RequireFields<MutationCreateExampleArgs, 'data'>>;
  createImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateImageArgs, 'data'>>;
  createIogLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationCreateIogLabelArgs, 'data'>>;
  createLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationCreateLabelArgs, 'data'>>;
  createLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationCreateLabelClassArgs, 'data'>>;
  createManyImages?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateManyImagesArgs, 'data'>>;
  createManyLabelClasses?: Resolver<Array<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationCreateManyLabelClassesArgs, 'data'>>;
  createMembership?: Resolver<Maybe<ResolversTypes['Membership']>, ParentType, ContextType, RequireFields<MutationCreateMembershipArgs, 'data'>>;
  createWorkspace?: Resolver<Maybe<ResolversTypes['Workspace']>, ParentType, ContextType, RequireFields<MutationCreateWorkspaceArgs, 'data'>>;
  declineInvitation?: Resolver<Maybe<ResolversTypes['Membership']>, ParentType, ContextType, RequireFields<MutationDeclineInvitationArgs, 'where'>>;
  deleteDataset?: Resolver<Maybe<ResolversTypes['Dataset']>, ParentType, ContextType, RequireFields<MutationDeleteDatasetArgs, 'where'>>;
  deleteImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationDeleteImageArgs, 'where'>>;
  deleteLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationDeleteLabelArgs, 'where'>>;
  deleteLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationDeleteLabelClassArgs, 'where'>>;
  deleteManyImages?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationDeleteManyImagesArgs, 'where'>>;
  deleteManyLabels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationDeleteManyLabelsArgs, 'where'>>;
  deleteMembership?: Resolver<Maybe<ResolversTypes['Membership']>, ParentType, ContextType, RequireFields<MutationDeleteMembershipArgs, 'where'>>;
  deleteWorkspace?: Resolver<Maybe<ResolversTypes['Workspace']>, ParentType, ContextType, RequireFields<MutationDeleteWorkspaceArgs, 'where'>>;
  getUploadTarget?: Resolver<ResolversTypes['UploadTarget'], ParentType, ContextType, RequireFields<MutationGetUploadTargetArgs, 'data'>>;
  importDataset?: Resolver<Maybe<ResolversTypes['ImportStatus']>, ParentType, ContextType, RequireFields<MutationImportDatasetArgs, 'data' | 'where'>>;
  inviteMember?: Resolver<Maybe<ResolversTypes['InvitationResult']>, ParentType, ContextType, RequireFields<MutationInviteMemberArgs, 'where'>>;
  reorderLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationReorderLabelClassArgs, 'data' | 'where'>>;
  runAiAssistant?: Resolver<ResolversTypes['RunAiAssistantOutput'], ParentType, ContextType, RequireFields<MutationRunAiAssistantArgs, 'data'>>;
  updateDataset?: Resolver<Maybe<ResolversTypes['Dataset']>, ParentType, ContextType, RequireFields<MutationUpdateDatasetArgs, 'data' | 'where'>>;
  updateImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationUpdateImageArgs, 'data' | 'where'>>;
  updateIogLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationUpdateIogLabelArgs, 'data'>>;
  updateLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationUpdateLabelArgs, 'data' | 'where'>>;
  updateLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationUpdateLabelClassArgs, 'data' | 'where'>>;
  updateMembership?: Resolver<Maybe<ResolversTypes['Membership']>, ParentType, ContextType, RequireFields<MutationUpdateMembershipArgs, 'data' | 'where'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'data' | 'where'>>;
  updateWorkspace?: Resolver<Maybe<ResolversTypes['Workspace']>, ParentType, ContextType, RequireFields<MutationUpdateWorkspaceArgs, 'data' | 'where'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  dataset?: Resolver<ResolversTypes['Dataset'], ParentType, ContextType, RequireFields<QueryDatasetArgs, 'where'>>;
  datasets?: Resolver<Array<ResolversTypes['Dataset']>, ParentType, ContextType, Partial<QueryDatasetsArgs>>;
  debug?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  example?: Resolver<ResolversTypes['Example'], ParentType, ContextType, RequireFields<QueryExampleArgs, 'where'>>;
  examples?: Resolver<Array<ResolversTypes['Example']>, ParentType, ContextType, Partial<QueryExamplesArgs>>;
  exportDataset?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryExportDatasetArgs, 'format' | 'where'>>;
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  image?: Resolver<ResolversTypes['Image'], ParentType, ContextType, RequireFields<QueryImageArgs, 'where'>>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, Partial<QueryImagesArgs>>;
  imagesAggregates?: Resolver<ResolversTypes['ImagesAggregates'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['Label'], ParentType, ContextType, RequireFields<QueryLabelArgs, 'where'>>;
  labelClass?: Resolver<ResolversTypes['LabelClass'], ParentType, ContextType, RequireFields<QueryLabelClassArgs, 'where'>>;
  labelClassExists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryLabelClassExistsArgs, 'where'>>;
  labelClasses?: Resolver<Array<ResolversTypes['LabelClass']>, ParentType, ContextType, Partial<QueryLabelClassesArgs>>;
  labelClassesAggregates?: Resolver<ResolversTypes['LabelClassesAggregates'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType, Partial<QueryLabelsArgs>>;
  labelsAggregates?: Resolver<ResolversTypes['LabelsAggregates'], ParentType, ContextType>;
  membership?: Resolver<ResolversTypes['Membership'], ParentType, ContextType, RequireFields<QueryMembershipArgs, 'where'>>;
  memberships?: Resolver<Array<ResolversTypes['Membership']>, ParentType, ContextType, Partial<QueryMembershipsArgs>>;
  searchDataset?: Resolver<Maybe<ResolversTypes['Dataset']>, ParentType, ContextType, RequireFields<QuerySearchDatasetArgs, 'where'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'where'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
  workspace?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType, RequireFields<QueryWorkspaceArgs, 'where'>>;
  workspaceExists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryWorkspaceExistsArgs, 'where'>>;
  workspaces?: Resolver<Array<ResolversTypes['Workspace']>, ParentType, ContextType, Partial<QueryWorkspacesArgs>>;
};

export type RunAiAssistantOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['RunAiAssistantOutput'] = ResolversParentTypes['RunAiAssistantOutput']> = {
  labelClasses?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UploadTargetResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadTarget'] = ResolversParentTypes['UploadTarget']> = {
  __resolveType: TypeResolveFn<'UploadTargetDirect' | 'UploadTargetHttp', ParentType, ContextType>;
};

export type UploadTargetDirectResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadTargetDirect'] = ResolversParentTypes['UploadTargetDirect']> = {
  direct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadTargetHttpResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadTargetHttp'] = ResolversParentTypes['UploadTargetHttp']> = {
  downloadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  memberships?: Resolver<Array<ResolversTypes['Membership']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workspace'] = ResolversParentTypes['Workspace']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  datasets?: Resolver<Array<ResolversTypes['Dataset']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imagesAggregates?: Resolver<ResolversTypes['ImagesAggregates'], ParentType, ContextType>;
  memberships?: Resolver<Array<ResolversTypes['Membership']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  plan?: Resolver<ResolversTypes['WorkspacePlan'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['WorkspaceStatus'], ParentType, ContextType>;
  stripeCustomerPortalUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['WorkspaceType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ColorHex?: GraphQLScalarType;
  Dataset?: DatasetResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Example?: ExampleResolvers<ContextType>;
  Geometry?: GeometryResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  ImagesAggregates?: ImagesAggregatesResolvers<ContextType>;
  ImportStatus?: ImportStatusResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Label?: LabelResolvers<ContextType>;
  LabelClass?: LabelClassResolvers<ContextType>;
  LabelClassesAggregates?: LabelClassesAggregatesResolvers<ContextType>;
  LabelsAggregates?: LabelsAggregatesResolvers<ContextType>;
  Membership?: MembershipResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RunAiAssistantOutput?: RunAiAssistantOutputResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadTarget?: UploadTargetResolvers<ContextType>;
  UploadTargetDirect?: UploadTargetDirectResolvers<ContextType>;
  UploadTargetHttp?: UploadTargetHttpResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Workspace?: WorkspaceResolvers<ContextType>;
};

