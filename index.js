const express =require('express');
const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
// tell where to look for static files
app.use(express.static('./assets'));

// use express-ejs-layout
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// setting view engine as ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/',require('./routes/index'));
app.listen(port,function(err){
    if(err){
        console.log(`Error:${err}`);
    }
    else{
        console.log(`Server running on port ${port}`);
    }
});