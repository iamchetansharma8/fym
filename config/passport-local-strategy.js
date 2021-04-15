const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback:true
   },
//    below email is the one passed by user from browser
   function(req,email,password,done){
    //    find user and establish identity, 1st email is from User model 2nd from browser
    // in argument above
    User.findOne({email:email},function(err,user){
        if(err){
            req.flash('error',err);
            console.log('Error in finding user in schema(passport)');
            return done(err);
        }
        if(!user){
            req.flash('error','This account is not registered with us, sign up first');
            console.log('This account is not registered with us, sign up first');
            return done(null, false);
        }
        if (user.password!=password) { 
            req.flash('error','Invalid username|password');
            console.log('Invalid username|password');
            return done(null, false); 
        }
        console.log('fr',user.verified);
        if(user.verified==false){
            console.log('Please verify your account before signing in');
            return done(null, false);
        }
        return done(null,user);
    });
   }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
})
// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user in schema(passport');
            return done(err);
        }
        return done(null,user);
    })
});

// check if user is authenticated
passport.checkAuthentication=function(req,res,next){
    // if user is signed in, pass the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if user in not signed in
    return res.redirect('/users/sign_in');
}
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contails the current signed in user and we're just sending it to the locals
        // to be used in views
        // we'll do the stuff like make profile page accessible only when user is signed in
        // with the help of this locals.user in .ejs files
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;