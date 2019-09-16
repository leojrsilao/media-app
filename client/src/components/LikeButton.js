import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Button, Icon, Label, Popup} from 'semantic-ui-react';


function LikeButton({ user, post: { id, likeCount, likes } }) 
{   
    const [liked, setLiked] = useState(false);
    

    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
          setLiked(true);
        } else setLiked(false);
      }, [user, likes]);

    const [likePost] = useMutation(like_post, {
        variables: {postId: id}
    });

    const likeButton = user ? (
        liked ? (
            <Button color='red' basic>
                <Icon name='heart' />
                
            </Button>
        )
        : (
            <Button color='red' basic>
                <Icon name='heart' />
                
            </Button>
        )
    ) : (
        <Button as={Link} to='/login' color='red' basic>
                <Icon name='heart' />
                
            </Button>
    )
    return(
        <Popup
            content={liked ? "Unlike post" : "Like post"}
            inverted
            trigger={
                <Button as='div' labelPosition='right' onClick={likePost}>
                    {likeButton}
                <Label  basic color='red' pointing='left'>
                    {likeCount}
                </Label>
                </Button>
            }
        />
        
    )

}

const like_post = gql`

    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                username
                id
            }
            likeCount
            
        }
    }
`
export default LikeButton;