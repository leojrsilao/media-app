const Post = require('../../models/post');
const auth = require('../../util/auth');
const {AuthenticationError, UserInputError} = require('apollo-server');

module.exports = {
    Mutation: {
        createComment: async(_, {postId, body}, context) => {
            const {username} = auth(context);
            if(body.trim() === '')
            {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty.'
                    }
                })
            }
            
            const post = await Post.findById(postId);

            if(post){
                post.comments.unshift({
                    body,
                    username,
                    created: new Date().toISOString()
                })
                await post.save();
                return post;
            }
            else throw new UserInputError('Post not found');
        },
        async deleteComment(_, {postId, commentId}, context){
            const {username} = auth(context);

            const post = await Post.findById(postId);
            //check if post exist to comment 
            if(post){
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
                //checks if the user 
                if(post.comments[commentIndex].username === username){
                    //removes 1 comment
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                }
                else
                {
                    throw new AuthenticationError('Action not allowed.');
                }
            }
            else
            {
                throw new UserInputError('Post not found.');
            }
        }
    }
}