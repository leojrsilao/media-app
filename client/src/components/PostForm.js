import React from 'react';
import {Form, Button} from 'semantic-ui-react';
import {useForm} from '../util/hooks';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {FETCH_POSTS_QUERY} from '../util/graphql';

function PostForm(){

    const {values, onChange, onSubmit} = useForm(createPostCallback,{
        body: ''
    });

    const [createPost, { error }] = useMutation(create_post, {
        variables: values,
        update(proxy, result) {
            
          const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY
          });
          
          proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: {
              getPosts:
              [result.data.createPost, ...data.getPosts]
          }});
          values.body = '';
        }
      });

    function createPostCallback(){
        createPost();
    }

    return (
        <>
          <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
              <Form.Input
                placeholder="Insert message here..."
                name="body"
                onChange={onChange}
                value={values.body}
                error={error ? true : false}
              />
              <Button type="submit" color="black">
                Submit
              </Button>
            </Form.Field>
          </Form>
          {error && (
            <div className="ui error message" style={{ marginBottom: 15 }}>
              <ul className="list">
                <li>{error.graphQLErrors[0].message}</li>
              </ul>
            </div>
          )}
        </>
      );
}

const create_post = gql`
mutation createPost($body: String!) {
  createPost(body: $body) {
    id
    body
    created
    username
    likes {
      id
      username
      created
    }
    likeCount
    comments {
      id
      body
      username
      created
    }
    commentCount
  }
}
`;

export default PostForm