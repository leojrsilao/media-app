const {gql} = require('apollo-server');

//similar to typescript, initialize the type of variable
module.exports = gql`
    
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        created: String! 

    }
    type Post{
            id: ID!
            body: String!
            username: String!
            created: String!
            comments: [Comment]!
            likes: [Like]!
            likeCount: Int!
            commentCount: Int!
    }
    type Comment{
        id: ID!
        created: String!
        username: String!
        body: String!
    }
    type Like{
        id: ID!
        created: String!
        username: String!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPw: String!
        email: String!
    }
    type Query{
            getPosts: [Post],
            getPost(postId: ID!): Post
    }
    type Mutation{
       register(registerInput: RegisterInput): User!
       login(username: String!, password: String!): User!
       createPost(body:String!): Post!
       deletePost(postId: ID!): String!
       createComment(postId: String!, body: String!): Post!
       deleteComment(postId: ID!, commentId: ID!): Post!
       likePost(postId: ID!): Post!

    }
`;