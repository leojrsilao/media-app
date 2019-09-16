import React, {useState} from 'react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {Button, Icon, Confirm, Popup} from 'semantic-ui-react';
import {FETCH_POSTS_QUERY} from '../util/graphql';

function DeleteButton({postId, commentId, callback}){

    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? delete_comment : delete_post;

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy){ 
            setConfirmOpen(false);
            if(!commentId)
            {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
               
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: {
                    getPosts: data.getPosts.filter(p=> p.id !== postId)
                }});
            }
            if(callback)
            {
                callback();
            }
        },
        variables: {
            postId,
            commentId
        }
    })

    return (
        <>
        <Popup
            content={commentId ? "Delete comment" : "Delete post"}
            inverted
            trigger={
                <Button as="div" color="black" onClick={()=> setConfirmOpen(true)} floated="right">
                    <Icon name="trash" style={{margin: 0}}/>
                 </Button>
            }
        />
        <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrMutation}/>
        </>
    )
}

const delete_post = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const delete_comment = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id
                username
                created
                body
            }
            commentCount
        }
    }
`

export default DeleteButton;