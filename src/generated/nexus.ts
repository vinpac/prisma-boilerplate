/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { Context } from "./../context"
import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  PostCreateInput: { // input type
    content?: string | null; // String
    title: string; // String!
  }
  PostOrderByUpdatedAtInput: { // input type
    updatedAt: NexusGenEnums['SortOrder']; // SortOrder!
  }
  UserCreateInput: { // input type
    email: string; // String!
    name?: string | null; // String
    posts?: NexusGenInputs['PostCreateInput'][] | null; // [PostCreateInput!]
  }
  UserUniqueInput: { // input type
    email?: string | null; // String
    id?: number | null; // Int
  }
}

export interface NexusGenEnums {
  SortOrder: "asc" | "desc"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Comment: { // root type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Mutation: {};
  Post: { // root type
    content?: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    published: boolean; // Boolean!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    viewCount: number; // Int!
  }
  Query: {};
  User: { // root type
    email: string; // String!
    id: number; // Int!
    name?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Comment: { // field return type
    content: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Mutation: { // field return type
    commentPost: NexusGenRootTypes['Comment']; // Comment!
    createDraft: NexusGenRootTypes['Post']; // Post!
    likePost: boolean; // Boolean!
    login: string; // String!
    registerEmail: number; // Int!
  }
  Post: { // field return type
    author: NexusGenRootTypes['User'] | null; // User
    comments: Array<NexusGenRootTypes['Comment'] | null> | null; // [Comment]
    content: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    published: boolean; // Boolean!
    title: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    viewCount: number; // Int!
  }
  Query: { // field return type
    allUsers: NexusGenRootTypes['User'][]; // [User!]!
    feed: NexusGenRootTypes['Post'][]; // [Post!]!
  }
  User: { // field return type
    email: string; // String!
    id: number; // Int!
    name: string | null; // String
    posts: NexusGenRootTypes['Post'][]; // [Post!]!
  }
}

export interface NexusGenFieldTypeNames {
  Comment: { // field return type name
    content: 'String'
    createdAt: 'DateTime'
    id: 'Int'
    updatedAt: 'DateTime'
  }
  Mutation: { // field return type name
    commentPost: 'Comment'
    createDraft: 'Post'
    likePost: 'Boolean'
    login: 'String'
    registerEmail: 'Int'
  }
  Post: { // field return type name
    author: 'User'
    comments: 'Comment'
    content: 'String'
    createdAt: 'DateTime'
    id: 'Int'
    published: 'Boolean'
    title: 'String'
    updatedAt: 'DateTime'
    viewCount: 'Int'
  }
  Query: { // field return type name
    allUsers: 'User'
    feed: 'Post'
  }
  User: { // field return type name
    email: 'String'
    id: 'Int'
    name: 'String'
    posts: 'Post'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    commentPost: { // args
      authorId: number; // Int!
      content: string; // String!
      postId: number; // Int!
    }
    createDraft: { // args
      data: NexusGenInputs['PostCreateInput']; // PostCreateInput!
      userId: number; // Int!
    }
    likePost: { // args
      postId: number; // Int!
      userId: number; // Int!
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
    registerEmail: { // args
      email: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}