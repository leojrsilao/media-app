import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
{
  getPosts {
    id
    body
    created
    username
    likeCount
    likes {
      username
    }
    commentCount
    comments {
      id
      username
      created
      body
    }
  }
}
`;
