const {ApolloServer} = require('apollo-server'); 
const mongoose = require('mongoose');

const resolvers = require('./graphql/resolvers');
const {db} = require('./db.js');
const typeDefs = require('./graphql/typeDefs');

//creating apollo server with graphql 
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({req}) => ({req})
});

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
          console.log('MongoDB connected.');
          return server.listen({port:7000});  
      })
      .then( (res) => {
        console.log(`Server running at ${res.url}`);
       })
       .catch( () => {
        console.log("Promise Rejected");
   });
   


