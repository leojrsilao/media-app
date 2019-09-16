import React, {useContext, useState, useRef} from 'react';
import gql from 'graphql-tag';
import {useQuery, useMutation} from '@apollo/react-hooks';
import moment from 'moment';
import {AuthContext} from '../context/auth'; 
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import {Button, Card, Grid, Image, Icon, Label, Form, Popup} from 'semantic-ui-react'


function SinglePost(props){
    const postId = props.match.params.postId;
    const {user} = useContext(AuthContext);

    const commentInputRef = useRef(null);
    const [comment, setComment] = useState('');
    
    const {data}= useQuery(post, { variables: { postId} });

    const [submitComment] = useMutation(submit_comment, {
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables:{
            postId,
            body: comment
        }
    })
    function deletePost(){  
        props.history.push('/');

    }
    
    let postMarkup; 
    if(!data){
        postMarkup = <p>Loading post...</p>
    }
    else
    {
        
        const {
            id,
            body,
            created,
            username,
            comments,
            likes,
            likeCount,
            commentCount
          } = data.getPost;
     
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}> 
                    <img src='https://react.semantic-ui.com/images/avatar/large/steve.jpg' size="small" float="right" />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(created).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <Popup
                                    content="Comment on post"
                                    inverted
                                    trigger={
                                        <Button as="div" labelPosition="right" onClick={() => console.log('Comment on post')}>
                                            <Button color='blue' basic>
                                                <Icon name='comments' />
                                            </Button>
                                            <Label basic color='blue' pointing='left'>
                                                {commentCount}
                                            </Label>
                                        </Button>
                                    }
                                
                                />
                                
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePost}/>
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post new comment:</p>
                                    <Form> 
                                        <div className="ui action input fluid">
                                            <input type="text" placeholder="Comment .." name="comment" value={comment} onChange={evt => setComment(evt.target.value)} ref={commentInputRef}/>
                                            <button type="submit" className="ui button black" disabled={comment.trim() === ''} onClick ={submitComment}>Submit</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map( (comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/> 
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.created).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const post = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
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

const submit_comment = gql`
    mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
        id
        comments 
        {
            id
            username
            created
            body
        }
        commentCount
    }
    }
`;


export default SinglePost