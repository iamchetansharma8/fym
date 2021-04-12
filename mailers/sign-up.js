const nodemailer=require('../config/nodemailer');
exports.newSignUp=(user)=>{
    // console.log('Inside new sign up mailer',user);
    // previous part of the path is defined in nodemailer.js
    let htmlString=nodemailer.renderTemplate({user:user},'/sign-ups/new_signup.ejs');
    nodemailer.transporter.sendMail({
        from:process.env.NODEMAILER_MAIL_ID,
        to:user.email,
        subject:'New Sign Up from your account',
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return
        }
        console.log('Message sent',info);
        return;
    });
}