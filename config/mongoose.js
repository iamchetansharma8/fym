const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/fym_db');

// acquire connection
const db=mongoose.connection;

// if error occurs
db.on('err',console.error.bind('console','Error connecting to mongodb'));

// once the connection is open
db.once('open',function(){
    console.log('connected to db');
});
module.exports=db;