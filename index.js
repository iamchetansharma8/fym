const express =require('express');
const cookieParser=require('cookie-parser');
const app=express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');

// to show flash messages
const flash=require('connect-flash');
// flash messages middleware
const customMWare=require('./config/middleware');

require('dotenv').config();
// used for session cookie
const session=require('express-session');
const passport = require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
// to store session cookie in db, so that everytime we restart server, all users shouldn't
// be logged out
const MongoStore=require('connect-mongo')(session);

app.use(express.urlencoded());
app.use(cookieParser());

// tell where to look for static files
app.use(express.static('./assets'));

// for multer files, making path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));

// use express-ejs-layout
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// setting view engine as ejs
app.set('view engine', 'ejs');
app.set('views', './views');

// encrypting session cookie
// mongo store is used to store session cookie in the db
app.use(session({
    name:'fyn',
    // todo : change the secret before deployment in production mode
    secret:'randomlysomething',
    resave: false,
    cookie:{
        // magAge in ms
        maxAge:(1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },function(err){
        console.log(err||'connect-mongodb setup okay');
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// putting flash after session, as it uses session cookies
app.use(flash());
app.use(customMWare.setFlash);

app.use('/',require('./routes/index'));
app.listen(port,function(err){
    if(err){
        console.log(`Error:${err}`);
    }
    else{
        console.log(`Server running on port ${port}`);
    }
});