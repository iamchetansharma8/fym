const nodemailer=require('../config/nodemailer');
exports.verifyAccount=(token,user)=>{
    console.log('Inside verify account mailer',user);
    // previous part of the path is defined in nodemailer.js
    let htmlString=nodemailer.renderTemplate({user:user,token:token},'/sign-ups/verify.ejs');
    nodemailer.transporter.sendMail({
        from:process.env.NODEMAILER_MAIL_ID,
        to:user.email,
        subject:'Verify your sign up on fyn',
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return
        }
        console.log('Verification Message sent',info);
        return;
    });
}