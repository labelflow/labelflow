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
  DateTime: any;
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

export type ExampleWhereInput = {
  id?: Maybe<Scalars['ID']>;
};

export type ExampleWhereUniqueInput = {
  id: Scalars['ID'];
};

export enum ExampleOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type ImageCreateInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  width: Scalars['Int'];
  height: Scalars['Int'];
  url: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  id?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
};

export type ImageWhereUniqueInput = {
  id: Scalars['ID'];
};

export enum ImageOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type Mutation = {
  __typename?: 'Mutation';
  createExample?: Maybe<Example>;
  createImage?: Maybe<Image>;
};


export type MutationCreateExampleArgs = {
  data: ExampleCreateInput;
};


export type MutationCreateImageArgs = {
  data: ImageCreateInput;
};

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']>;
  examples: Array<Example>;
  example: Example;
  images: Array<Image>;
  image: Image;
};


export type QueryExamplesArgs = {
  where?: Maybe<ExampleWhereInput>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ExampleOrderByInput>;
};


export type QueryExampleArgs = {
  where: ExampleWhereUniqueInput;
};


export type QueryImagesArgs = {
  where?: Maybe<ImageWhereInput>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ImageOrderByInput>;
};


export type QueryImageArgs = {
  where: ImageWhereUniqueInput;
};


export type ImageWhereInput = {
  id?: Maybe<Scalars['ID']>;
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
  Example: ResolverTypeWrapper<Example>;
  String: ResolverTypeWrapper<Scalars['String']>;
  ExampleCreateInput: ExampleCreateInput;
  ExampleWhereInput: ExampleWhereInput;
  ExampleWhereUniqueInput: ExampleWhereUniqueInput;
  ExampleOrderByInput: ExampleOrderByInput;
  ImageCreateInput: ImageCreateInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Image: ResolverTypeWrapper<Image>;
  ImageWhereUniqueInput: ImageWhereUniqueInput;
  ImageOrderByInput: ImageOrderByInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  ImageWhereInput: ImageWhereInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Example: Example;
  String: Scalars['String'];
  ExampleCreateInput: ExampleCreateInput;
  ExampleWhereInput: ExampleWhereInput;
  ExampleWhereUniqueInput: ExampleWhereUniqueInput;
  ImageCreateInput: ImageCreateInput;
  Int: Scalars['Int'];
  Image: Image;
  ImageWhereUniqueInput: ImageWhereUniqueInput;
  Mutation: {};
  Query: {};
  DateTime: Scalars['DateTime'];
  ID: Scalars['ID'];
  ImageWhereInput: ImageWhereInput;
  Boolean: Scalars['Boolean'];
};

export type ExampleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Example'] = ResolversParentTypes['Example']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createExample?: Resolver<Maybe<ResolversTypes['Example']>, ParentType, ContextType, RequireFields<MutationCreateExampleArgs, 'data'>>;
  createImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateImageArgs, 'data'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  examples?: Resolver<Array<ResolversTypes['Example']>, ParentType, ContextType, RequireFields<QueryExamplesArgs, never>>;
  example?: Resolver<ResolversTypes['Example'], ParentType, ContextType, RequireFields<QueryExampleArgs, 'where'>>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<QueryImagesArgs, never>>;
  image?: Resolver<ResolversTypes['Image'], ParentType, ContextType, RequireFields<QueryImageArgs, 'where'>>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type Resolvers<ContextType = any> = {
  Example?: ExampleResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
