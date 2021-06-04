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
  Upload: any;
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

export type Image = {
  __typename?: 'Image';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
  name: Scalars['String'];
  path: Scalars['String'];
  mimetype: Scalars['String'];
  height: Scalars['Int'];
  width: Scalars['Int'];
  labels: Array<Label>;
};

export type ImageCreateInput = {
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
  file?: Maybe<Scalars['Upload']>;
  url?: Maybe<Scalars['String']>;
};

export type ImageWhereInput = {
  id?: Maybe<Scalars['ID']>;
};

export type ImageWhereUniqueInput = {
  id: Scalars['ID'];
};

export type Label = {
  __typename?: 'Label';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  imageId: Scalars['ID'];
  labelClass?: Maybe<LabelClass>;
  x: Scalars['Float'];
  y: Scalars['Float'];
  height: Scalars['Int'];
  width: Scalars['Int'];
};

export type LabelClass = {
  __typename?: 'LabelClass';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  color: Scalars['ColorHex'];
  labels: Array<Label>;
};

export type LabelClassCreateInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  color: Scalars['ColorHex'];
};

export type LabelClassWhereUniqueInput = {
  id: Scalars['ID'];
};

export type LabelCreateInput = {
  id?: Maybe<Scalars['ID']>;
  imageId: Scalars['ID'];
  labelClassId?: Maybe<Scalars['ID']>;
  x: Scalars['Float'];
  y: Scalars['Float'];
  width: Scalars['Int'];
  height: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createExample?: Maybe<Example>;
  createImage?: Maybe<Image>;
  createLabel?: Maybe<Label>;
  createLabelClass?: Maybe<LabelClass>;
};


export type MutationCreateExampleArgs = {
  data: ExampleCreateInput;
};


export type MutationCreateImageArgs = {
  data: ImageCreateInput;
};


export type MutationCreateLabelArgs = {
  data: LabelCreateInput;
};


export type MutationCreateLabelClassArgs = {
  data: LabelClassCreateInput;
};

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']>;
  example: Example;
  examples: Array<Example>;
  image: Image;
  images: Array<Image>;
  labelClass: LabelClass;
  labelClasses: Array<LabelClass>;
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
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
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
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Example: ResolverTypeWrapper<Example>;
  String: ResolverTypeWrapper<Scalars['String']>;
  ExampleCreateInput: ExampleCreateInput;
  ExampleOrderByInput: ExampleOrderByInput;
  ExampleWhereInput: ExampleWhereInput;
  ExampleWhereUniqueInput: ExampleWhereUniqueInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Image: ResolverTypeWrapper<Image>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ImageCreateInput: ImageCreateInput;
  ImageWhereInput: ImageWhereInput;
  ImageWhereUniqueInput: ImageWhereUniqueInput;
  Label: ResolverTypeWrapper<Label>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  LabelClass: ResolverTypeWrapper<LabelClass>;
  LabelClassCreateInput: LabelClassCreateInput;
  LabelClassWhereUniqueInput: LabelClassWhereUniqueInput;
  LabelCreateInput: LabelCreateInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ColorHex: Scalars['ColorHex'];
  DateTime: Scalars['DateTime'];
  Example: Example;
  String: Scalars['String'];
  ExampleCreateInput: ExampleCreateInput;
  ExampleWhereInput: ExampleWhereInput;
  ExampleWhereUniqueInput: ExampleWhereUniqueInput;
  ID: Scalars['ID'];
  Image: Image;
  Int: Scalars['Int'];
  ImageCreateInput: ImageCreateInput;
  ImageWhereInput: ImageWhereInput;
  ImageWhereUniqueInput: ImageWhereUniqueInput;
  Label: Label;
  Float: Scalars['Float'];
  LabelClass: LabelClass;
  LabelClassCreateInput: LabelClassCreateInput;
  LabelClassWhereUniqueInput: LabelClassWhereUniqueInput;
  LabelCreateInput: LabelCreateInput;
  Mutation: {};
  Query: {};
  Upload: Scalars['Upload'];
  Boolean: Scalars['Boolean'];
};

export interface ColorHexScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ColorHex'], any> {
  name: 'ColorHex';
}

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

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Label'] = ResolversParentTypes['Label']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  imageId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelClassResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabelClass'] = ResolversParentTypes['LabelClass']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['ColorHex'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createExample?: Resolver<Maybe<ResolversTypes['Example']>, ParentType, ContextType, RequireFields<MutationCreateExampleArgs, 'data'>>;
  createImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateImageArgs, 'data'>>;
  createLabel?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<MutationCreateLabelArgs, 'data'>>;
  createLabelClass?: Resolver<Maybe<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<MutationCreateLabelClassArgs, 'data'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  example?: Resolver<ResolversTypes['Example'], ParentType, ContextType, RequireFields<QueryExampleArgs, 'where'>>;
  examples?: Resolver<Array<ResolversTypes['Example']>, ParentType, ContextType, RequireFields<QueryExamplesArgs, never>>;
  image?: Resolver<ResolversTypes['Image'], ParentType, ContextType, RequireFields<QueryImageArgs, 'where'>>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<QueryImagesArgs, never>>;
  labelClass?: Resolver<ResolversTypes['LabelClass'], ParentType, ContextType, RequireFields<QueryLabelClassArgs, 'where'>>;
  labelClasses?: Resolver<Array<ResolversTypes['LabelClass']>, ParentType, ContextType, RequireFields<QueryLabelClassesArgs, never>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = any> = {
  ColorHex?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Example?: ExampleResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Label?: LabelResolvers<ContextType>;
  LabelClass?: LabelClassResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
