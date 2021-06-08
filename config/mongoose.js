const mongoose=require('mongoose');
const env=require('../config/environment');
mongoose.connect(`mongodb://localhost/${env.db}`);

// acquire connection
const db=mongoose.connection;

// if error occurs
db.on('err',console.error.bind('console','Error connecting to mongodb'));

// once the connection is open
db.once('open',function(){
    console.log('connected to db');
});
module.exports=db;