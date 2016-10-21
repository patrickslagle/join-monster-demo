import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql'

import {
  globalIdField,
  connectionDefinitions
} from 'graphql-relay'

import { Post } from './Post'
import User from './User'
import { nodeInterface } from './Node'

export const Comment = new GraphQLObjectType({
  description: 'Comments on posts',
  name: 'Comment',
  sqlTable: 'comments',
  uniqueKey: 'id',
  // also implements the node interface
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: {
      ...globalIdField(),
      sqlDeps: [ 'id' ]
    },
    clearId: {
      type: GraphQLInt,
      sqlColumn: 'id'
    },
    body: {
      description: 'The content of the comment',
      type: GraphQLString
    },
    post: {
      description: 'The post that the comment belongs to',
      type: Post,
      sqlJoin: (commentTable, postTable) => `${commentTable}.post_id = ${postTable}.id`
    },
    author: {
      description: 'The user who wrote the comment',
      type: User,
      sqlJoin: (commentTable, userTable) => `${commentTable}.author_id = ${userTable}.id`
    }
  })
})

// create a connection type from the Comment type
const { connectionType: CommentConnection } = connectionDefinitions({ nodeType: Comment })
export { CommentConnection }
