const nodemailer=require('nodemailer');
const { relative } = require('path');
const ejs=require('ejs');
const path=require('path');
const env=require('./environment');
// defines how the communication is going to happen
let transporter=nodemailer.createTransport(env.smtp);

// used to send an html file from views/mailers as email
let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers', relativePath),
        data,
        function(err,template){
            if(err){
                console.log('Error in rendering template');
                return;
            }
            mailHTML=template;
        }
    )
    return mailHTML;
}
module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}