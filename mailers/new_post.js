const nodemailer=require('../config/nodemailer');
exports.newPost=(user,post)=>{
    let emails=[];
    for(i of user.connections){
        if(i.following.id!=user.id){
            emails.push(i.following.email);
        }
    }
    // console.log('Inside new sign up mailer',user);
    // previous part of the path is defined in nodemailer.js
    let htmlString=nodemailer.renderTemplate({user:user,post:post},'/new_post/new_post_email.ejs');
    nodemailer.transporter.sendMail({
        from:process.env.NODEMAILER_MAIL_ID,
        to:emails,
        subject:'A new post',
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
        return;
    });
}