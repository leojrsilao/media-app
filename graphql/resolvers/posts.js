const Post = require('../../models/post');
const auth = require('../../util/auth');
const {AuthenticationError, UserInputError} = require('apollo-server');
 
module.exports = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find().sort({created: -1});
                return posts;
            }
            catch(err){
                throw new Error(err);
            }
        },
        async getPost(_, {postId}){
            try{
                const post = await Post.findById(postId);
                if(post)
                {
                    return post;
                }
                else{
                    throw new Error('Post not found');
                }
            }
            catch(err){
                throw new Error(err);
            }
        }
       
        
    },
    Mutation: {
        async createPost(_, {body}, context){
            //checks if user exists with an authenticated token. 
            const user = auth(context);
            
            if(body.trim() === '')
            {
                throw new Error('Post body must not be empty');
            }
            

            //creating a new post if user is authenticated with token.
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                created: new Date().toISOString()
            });
            
            const post = await newPost.save();

            return post;
        },  
        async deletePost(_, {postId}, context)
        {
            const user = auth(context);
            
            //only allowed to delete their own post
            try{
                const post = await Post.findById(postId);
                if(user.username === post.username)
                {
                    await post.delete();
                    return 'Post deleted sucessful'
                }
                else
                {
                    throw new AuthenticationError('Action not allowed');
                }
            }
            catch(err){
                throw new Error(err);
            }
        },
        async likePost(_,{postId}, context){
            const {username} = auth(context);

            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username))
                {
                    //User already liked
                    post.likes = post.likes.filter(like => like.username !== username);
                    
                }
                else
                {
                    //User did not like
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            }
            else
            {
                throw new UserInputError('Post not found.');
            }
        }
    }


};