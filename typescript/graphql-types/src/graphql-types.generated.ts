import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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


export type Dataset = {
  __typename?: 'Dataset';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  slug: Scalars['String'];
  images: Array<Image>;
  labels: Array<Label>;
  labelClasses: Array<LabelClass>;
  imagesAggregates: ImagesAggregates;
  labelsAggregates: LabelsAggregates;
  labelClassesAggregates: LabelClassesAggregates;
  workspaceId: Scalars['ID'];
};


export type DatasetImagesArgs = {
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};

export type DatasetCreateInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  workspaceId: Scalars['ID'];
};

export type DatasetUpdateInput = {
  name: Scalars['String'];
};

export type DatasetWhereIdInput = {
  id: Scalars['ID'];
};

export type DatasetWhereInput = {
  workspaceId?: Maybe<Scalars['ID']>;
};

export type DatasetWhereUniqueInput = {
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};


export type Example = {
  __typename?: 'Example';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type ExampleCreateInput = {
  name: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
};

export enum ExampleOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type ExampleWhereInput = {
  id?: Maybe<Scalars['ID']>;
};

export type ExampleWhereUniqueInput = {
  id: Scalars['ID'];
};

export type ExportWhereUniqueInput = {
  datasetId: Scalars['ID'];
};

export type Geometry = {
  __typename?: 'Geometry';
  type: Scalars['String'];
  coordinates: Scalars['JSON'];
};

export type GeometryInput = {
  type: Scalars['String'];
  coordinates: Scalars['JSON'];
};

export type Image = {
  __typename?: 'Image';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
  externalUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  path: Scalars['String'];
  mimetype: Scalars['String'];
  height: Scalars['Int'];
  width: Scalars['Int'];
  labels: Array<Label>;
  datasetId: Scalars['ID'];
};

export type ImageCreateInput = {
  id?: Maybe<Scalars['ID']>;
  datasetId: Scalars['ID'];
  createdAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
  file?: Maybe<Scalars['Upload']>;
  url?: Maybe<Scalars['String']>;
  externalUrl?: Maybe<Scalars['String']>;
};

export type ImageWhereInput = {
  datasetId?: Maybe<Scalars['ID']>;
};

export type ImageWhereUniqueInput = {
  id: Scalars['ID'];
};

export type ImagesAggregates = {
  __typename?: 'ImagesAggregates';
  totalCount: Scalars['Int'];
};


export type Label = {
  __typename?: 'Label';
  id: Scalars['ID'];
  type: LabelType;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  imageId: Scalars['ID'];
  geometry: Geometry;
  labelClass?: Maybe<LabelClass>;
  x: Scalars['Float'];
  y: Scalars['Float'];
  height: Scalars['Float'];
  width: Scalars['Float'];
};

export type LabelClass = {
  __typename?: 'LabelClass';
  id: Scalars['ID'];
  index: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  color: Scalars['ColorHex'];
  labels: Array<Label>;
  datasetId: Scalars['ID'];
};

export type LabelClassCreateInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  color: Scalars['ColorHex'];
  datasetId: Scalars['ID'];
};

export type LabelClassReorderInput = {
  index: Scalars['Int'];
};

export type LabelClassUpdateInput = {
  name?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['ColorHex']>;
};

export type LabelClassWhereInput = {
  datasetId?: Maybe<Scalars['ID']>;
};

export type LabelClassWhereUniqueInput = {
  id: Scalars['ID'];
};

export type LabelClassesAggregates = {
  __typename?: 'LabelClassesAggregates';
  totalCount: Scalars['Int'];
};

export type LabelCreateInput = {
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<LabelType>;
  imageId: Scalars['ID'];
  labelClassId?: Maybe<Scalars['ID']>;
  geometry: GeometryInput;
};

export enum LabelType {
  Polygon = 'Polygon',
  Box = 'Box'
}

export type LabelUpdateInput = {
  labelClassId?: Maybe<Scalars['ID']>;
  geometry?: Maybe<GeometryInput>;
};

export type LabelWhereInput = {
  imageId?: Maybe<Scalars['ID']>;
  labelClassId?: Maybe<Scalars['ID']>;
  datasetId?: Maybe<Scalars['ID']>;
};

export type LabelWhereUniqueInput = {
  id: Scalars['ID'];
};

export type LabelsAggregates = {
  __typename?: 'LabelsAggregates';
  totalCount: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createExample?: Maybe<Example>;
  getUploadTarget: UploadTarget;
  createImage?: Maybe<Image>;
  createLabel?: Maybe<Label>;
  updateLabel?: Maybe<Label>;
  deleteLabel?: Maybe<Label>;
  createLabelClass?: Maybe<LabelClass>;
  updateLabelClass?: Maybe<LabelClass>;
  reorderLabelClass?: Maybe<LabelClass>;
  deleteLabelClass?: Maybe<LabelClass>;
  createDataset?: Maybe<Dataset>;
  createDemoDataset?: Maybe<Dataset>;
  updateDataset?: Maybe<Dataset>;
  deleteDataset?: Maybe<Dataset>;
  createWorkspace?: Maybe<Workspace>;
  updateWorkspace?: Maybe<Workspace>;
};


export type MutationCreateExampleArgs = {
  data: ExampleCreateInput;
};


export type MutationGetUploadTargetArgs = {
  data: UploadTargetInput;
};


export type MutationCreateImageArgs = {
  data: ImageCreateInput;
};


export type MutationCreateLabelArgs = {
  data: LabelCreateInput;
};


export type MutationUpdateLabelArgs = {
  where: LabelWhereUniqueInput;
  data: LabelUpdateInput;
};


export type MutationDeleteLabelArgs = {
  where: LabelWhereUniqueInput;
};


export type MutationCreateLabelClassArgs = {
  data: LabelClassCreateInput;
};


export type MutationUpdateLabelClassArgs = {
  where: LabelClassWhereUniqueInput;
  data: LabelClassUpdateInput;
};


export type MutationReorderLabelClassArgs = {
  where: LabelClassWhereUniqueInput;
  data: LabelClassReorderInput;
};


export type MutationDeleteLabelClassArgs = {
  where: LabelClassWhereUniqueInput;
};


export type MutationCreateDatasetArgs = {
  data: DatasetCreateInput;
};


export type MutationUpdateDatasetArgs = {
  where: DatasetWhereIdInput;
  data: DatasetUpdateInput;
};


export type MutationDeleteDatasetArgs = {
  where: DatasetWhereIdInput;
};


export type MutationCreateWorkspaceArgs = {
  data: WorkspaceCreateInput;
};


export type MutationUpdateWorkspaceArgs = {
  where: WorkspaceWhereUniqueInput;
  data: WorkspaceUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']>;
  example: Example;
  examples: Array<Example>;
  image: Image;
  images: Array<Image>;
  imagesAggregates: ImagesAggregates;
  labelClass: LabelClass;
  labelClasses: Array<LabelClass>;
  labelClassesAggregates: LabelClassesAggregates;
  labelsAggregates: LabelsAggregates;
  label: Label;
  labels: Array<Label>;
  dataset: Dataset;
  datasets: Array<Dataset>;
  workspace: Workspace;
  workspaces: Array<Workspace>;
  exportToCoco: Scalars['String'];
  debug: Scalars['JSON'];
};


export type QueryExampleArgs = {
  where: ExampleWhereUniqueInput;
};


export type QueryExamplesArgs = {
  where?: Maybe<ExampleWhereInput>;
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ExampleOrderByInput>;
};


export type QueryImageArgs = {
  where: ImageWhereUniqueInput;
};


export type QueryImagesArgs = {
  where?: Maybe<ImageWhereInput>;
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type QueryLabelClassArgs = {
  where: LabelClassWhereUniqueInput;
};


export type QueryLabelClassesArgs = {
  where?: Maybe<LabelClassWhereInput>;
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type QueryLabelArgs = {
  where: LabelWhereUniqueInput;
};


export type QueryLabelsArgs = {
  where?: Maybe<LabelWhereInput>;
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type QueryDatasetArgs = {
  where: DatasetWhereUniqueInput;
};


export type QueryDatasetsArgs = {
  where?: Maybe<DatasetWhereInput>;
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type QueryWorkspaceArgs = {
  where: WorkspaceWhereUniqueInput;
};


export type QueryWorkspacesArgs = {
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type QueryExportToCocoArgs = {
  where: ExportWhereUniqueInput;
};


export type UploadTarget = UploadTargetDirect | UploadTargetHttp;

export type UploadTargetDirect = {
  __typename?: 'UploadTargetDirect';
  direct: Scalars['Boolean'];
};

export type UploadTargetHttp = {
  __typename?: 'UploadTargetHttp';
  uploadUrl: Scalars['String'];
  downloadUrl: Scalars['String'];
};

export type UploadTargetInput = {
  key: Scalars['String'];
};

export type Workspace = {
  __typename?: 'Workspace';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  slug: Scalars['String'];
  type: WorkspaceType;
  plan: WorkspacePlan;
  datasets?: Maybe<Array<Dataset>>;
};

export type WorkspaceCreateInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
};

export enum WorkspacePlan {
  Community = 'community',
  Starter = 'starter',
  Pro = 'pro',
  Enterprise = 'enterprise'
}

export enum WorkspaceType {
  Local = 'local',
  Online = 'online'
}

export type WorkspaceUpdateInput = {
  name?: Maybe<Scalars['String']>;
};

export type WorkspaceWhereUniqueInput = {
  id: Scalars['ID'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
  ColorHex: ResolverTypeWrapper<Scalars['ColorHex']>;
  Dataset: ResolverTypeWrapper<Dataset>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  DatasetCreateInput: DatasetCreateInput;
  DatasetUpdateInput: DatasetUpdateInput;
  DatasetWhereIDInput: DatasetWhereIdInput;
  DatasetWhereInput: DatasetWhereInput;
  DatasetWhereUniqueInput: DatasetWhereUniqueInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Example: ResolverTypeWrapper<Example>;
  ExampleCreateInput: ExampleCreateInput;
  ExampleOrderByInput: ExampleOrderByInput;
  ExampleWhereInput: ExampleWhereInput;
  ExampleWhereUniqueInput: ExampleWhereUniqueInput;
  ExportWhereUniqueInput: ExportWhereUniqueInput;
  Geometry: ResolverTypeWrapper<Geometry>;
  GeometryInput: GeometryInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Image: ResolverTypeWrapper<Image>;
  ImageCreateInput: ImageCreateInput;
  ImageWhereInput: ImageWhereInput;
  ImageWhereUniqueInput: ImageWhereUniqueInput;
  ImagesAggregates: ResolverTypeWrapper<ImagesAggregates>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Label: ResolverTypeWrapper<Label>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  LabelClass: ResolverTypeWrapper<LabelClass>;
  LabelClassCreateInput: LabelClassCreateInput;
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
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UploadTarget: ResolversTypes['UploadTargetDirect'] | ResolversTypes['UploadTargetHttp'];
  UploadTargetDirect: ResolverTypeWrapper<UploadTargetDirect>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  UploadTargetHttp: ResolverTypeWrapper<UploadTargetHttp>;
  UploadTargetInput: UploadTargetInput;
  Workspace: ResolverTypeWrapper<Workspace>;
  WorkspaceCreateInput: WorkspaceCreateInput;
  WorkspacePlan: WorkspacePlan;
  WorkspaceType: WorkspaceType;
  WorkspaceUpdateInput: WorkspaceUpdateInput;
  WorkspaceWhereUniqueInput: WorkspaceWhereUniqueInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ColorHex: Scalars['ColorHex'];
  Dataset: Dataset;
  String: Scalars['String'];
  Int: Scalars['Int'];
  DatasetCreateInput: DatasetCreateInput;
  DatasetUpdateInput: DatasetUpdateInput;
  DatasetWhereIDInput: DatasetWhereIdInput;
  DatasetWhereInput: DatasetWhereInput;
  DatasetWhereUniqueInput: DatasetWhereUniqueInput;
  DateTime: Scalars['DateTime'];
  Example: Example;
  ExampleCreateInput: ExampleCreateInput;
  ExampleWhereInput: ExampleWhereInput;
  ExampleWhereUniqueInput: ExampleWhereUniqueInput;
  ExportWhereUniqueInput: ExportWhereUniqueInput;
  Geometry: Geometry;
  GeometryInput: GeometryInput;
  ID: Scalars['ID'];
  Image: Image;
  ImageCreateInput: ImageCreateInput;
  ImageWhereInput: ImageWhereInput;
  ImageWhereUniqueInput: ImageWhereUniqueInput;
  ImagesAggregates: ImagesAggregates;
  JSON: Scalars['JSON'];
  Label: Label;
  Float: Scalars['Float'];
  LabelClass: LabelClass;
  LabelClassCreateInput: LabelClassCreateInput;
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
  Mutation: {};
  Query: {};
  Upload: Scalars['Upload'];
  UploadTarget: ResolversParentTypes['UploadTargetDirect'] | ResolversParentTypes['UploadTargetHttp'];
  UploadTargetDirect: UploadTargetDirect;
  Boolean: Scalars['Boolean'];
  UploadTargetHttp: UploadTargetHttp;
  UploadTargetInput: UploadTargetInput;
  Workspace: Workspace;
  WorkspaceCreateInput: WorkspaceCreateInput;
  WorkspaceUpdateInput: WorkspaceUpdateInput;
  WorkspaceWhereUniqueInput: WorkspaceWhereUniqueInput;
};

export interface ColorHexScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ColorHex'], any> {
  name: 'ColorHex';
}

export type DatasetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dataset'] = ResolversParentTypes['Dataset']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<DatasetImagesArgs, never>>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  labelClasses?: Resolver<Array<ResolversTypes['LabelClass']>, ParentType, ContextType>;
  imagesAggregates?: Resolver<ResolversTypes['ImagesAggregates'], ParentType, ContextType>;
  labelsAggregates?: Resolver<ResolversTypes['LabelsAggregates'], ParentType, ContextType>;
  labelClassesAggregates?: Resolver<ResolversTypes['LabelClassesAggregates'], ParentType, ContextType>;
  workspaceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ExampleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Example'] = ResolversParentTypes['Example']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeometryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Geometry'] = ResolversParentTypes['Geometry']> = {
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coordinates?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  datasetId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImagesAggregatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImagesAggregates'] = ResolversParentTypes['ImagesAggregates']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Label'] = ResolversParentTypes['Label']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['LabelType'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  imageId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  geometry?: Resolver<ResolversTypes['Geometry'], ParentType, ContextType>;
  labelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelClassResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabelClass'] = ResolversParentTypes['LabelClass']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['ColorHex'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  datasetId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createExample?: Resolver<Maybe<ResolversTypes['Example']>, ParentType, ContextType, RequireFields<MutationCreateExampleArgs, 'data'>>;
  getUploadTarget?: Resolver<ResolversTypes['UploadTarget'], ParentType, ContextType, RequireFields<MutationGetUploadTargetArgs, 'data'>>;
  createImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateImageArgs, 'data'>>;
  createLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationCreateLabelArgs, 'data'>>;
  updateLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationUpdateLabelArgs, 'where' | 'data'>>;
  deleteLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationDeleteLabelArgs, 'where'>>;
  createLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationCreateLabelClassArgs, 'data'>>;
  updateLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationUpdateLabelClassArgs, 'where' | 'data'>>;
  reorderLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationReorderLabelClassArgs, 'where' | 'data'>>;
  deleteLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationDeleteLabelClassArgs, 'where'>>;
  createDataset?: Resolver<Maybe<ResolversTypes['Dataset']>, ParentType, ContextType, RequireFields<MutationCreateDatasetArgs, 'data'>>;
  createDemoDataset?: Resolver<Maybe<ResolversTypes['Dataset']>, ParentType, ContextType>;
  updateDataset?: Resolver<Maybe<ResolversTypes['Dataset']>, ParentType, ContextType, RequireFields<MutationUpdateDatasetArgs, 'where' | 'data'>>;
  deleteDataset?: Resolver<Maybe<ResolversTypes['Dataset']>, ParentType, ContextType, RequireFields<MutationDeleteDatasetArgs, 'where'>>;
  createWorkspace?: Resolver<Maybe<ResolversTypes['Workspace']>, ParentType, ContextType, RequireFields<MutationCreateWorkspaceArgs, 'data'>>;
  updateWorkspace?: Resolver<Maybe<ResolversTypes['Workspace']>, ParentType, ContextType, RequireFields<MutationUpdateWorkspaceArgs, 'where' | 'data'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  example?: Resolver<ResolversTypes['Example'], ParentType, ContextType, RequireFields<QueryExampleArgs, 'where'>>;
  examples?: Resolver<Array<ResolversTypes['Example']>, ParentType, ContextType, RequireFields<QueryExamplesArgs, never>>;
  image?: Resolver<ResolversTypes['Image'], ParentType, ContextType, RequireFields<QueryImageArgs, 'where'>>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<QueryImagesArgs, never>>;
  imagesAggregates?: Resolver<ResolversTypes['ImagesAggregates'], ParentType, ContextType>;
  labelClass?: Resolver<ResolversTypes['LabelClass'], ParentType, ContextType, RequireFields<QueryLabelClassArgs, 'where'>>;
  labelClasses?: Resolver<Array<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<QueryLabelClassesArgs, never>>;
  labelClassesAggregates?: Resolver<ResolversTypes['LabelClassesAggregates'], ParentType, ContextType>;
  labelsAggregates?: Resolver<ResolversTypes['LabelsAggregates'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['Label'], ParentType, ContextType, RequireFields<QueryLabelArgs, 'where'>>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<QueryLabelsArgs, never>>;
  dataset?: Resolver<ResolversTypes['Dataset'], ParentType, ContextType, RequireFields<QueryDatasetArgs, 'where'>>;
  datasets?: Resolver<Array<ResolversTypes['Dataset']>, ParentType, ContextType, RequireFields<QueryDatasetsArgs, never>>;
  workspace?: Resolver<ResolversTypes['Workspace'], ParentType, ContextType, RequireFields<QueryWorkspaceArgs, 'where'>>;
  workspaces?: Resolver<Array<ResolversTypes['Workspace']>, ParentType, ContextType, RequireFields<QueryWorkspacesArgs, never>>;
  exportToCoco?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryExportToCocoArgs, 'where'>>;
  debug?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
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
  uploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  downloadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkspaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Workspace'] = ResolversParentTypes['Workspace']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['WorkspaceType'], ParentType, ContextType>;
  plan?: Resolver<ResolversTypes['WorkspacePlan'], ParentType, ContextType>;
  datasets?: Resolver<Maybe<Array<ResolversTypes['Dataset']>>, ParentType, ContextType>;
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
  JSON?: GraphQLScalarType;
  Label?: LabelResolvers<ContextType>;
  LabelClass?: LabelClassResolvers<ContextType>;
  LabelClassesAggregates?: LabelClassesAggregatesResolvers<ContextType>;
  LabelsAggregates?: LabelsAggregatesResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadTarget?: UploadTargetResolvers<ContextType>;
  UploadTargetDirect?: UploadTargetDirectResolvers<ContextType>;
  UploadTargetHttp?: UploadTargetHttpResolvers<ContextType>;
  Workspace?: WorkspaceResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
