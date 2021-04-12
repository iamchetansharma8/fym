const nodemailer=require('../config/nodemailer');
exports.forgotPass=(token,user)=>{
    // console.log('Inside new sign up mailer',user);
    // previous part of the path is defined in nodemailer.js
    console.log('Inside hhhh');
    console.log('printfff',user.name);
    console.log('printfff',token);
    let htmlString=nodemailer.renderTemplate({user:user,token:token},'/forgot_pass/forgot_pass_email.ejs');
    nodemailer.transporter.sendMail({
        from:process.env.NODEMAILER_MAIL_ID,
        to:user.email,
        subject:'Request to change password',
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