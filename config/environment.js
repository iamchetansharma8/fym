const fs=require('fs');
const rfs=require('rotating-file-stream');
const path=require('path');

const logDirectory=path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream=rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});

const development={
    name:'development',
    asset_path:process.env.FYM_ASSET_PATH,
    session_cookie_key:'randomlysomething',
    db:'fym_db',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:'587',
        secure:false,
        auth: {
            user:process.env.FYM_NODEMAILER_MAIL_ID,
            pass:process.env.FYM_NODEMAILER_MAIL_PASSWORD
          }
    },
    google_client_id:process.env.FYM_GOOGLE_CLIENT_ID,
    google_client_secret:process.env.FYM_GOOGLE_CLIENT_SECRET,
    google_callback_url:process.env.FYM_GOOGLE_CALLBACK_URL,
    jwt_secret:'fym',
    morgan:{
        mode: 'dev',
        options: {stream :accessLogStream}
    }
}

const production={
    name:'production',
    asset_path:process.env.FYM_ASSET_PATH,
    session_cookie_key:process.env.FYM_SESSION_COOKIE,
    db:process.env.FYM_DB,
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:'587',
        secure:false,
        auth: {
            user:process.env.FYM_NODEMAILER_MAIL_ID,
            pass:process.env.FYM_NODEMAILER_MAIL_PASSWORD
          }
    },
    google_client_id:process.env.FYM_GOOGLE_CLIENT_ID,
    google_client_secret:process.env.FYM_GOOGLE_CLIENT_SECRET,
    google_callback_url:process.env.FYM_GOOGLE_CALLBACK_URL,
    jwt_secret:process.env.FYM_JWT_SECRET_KEY,
    morgan:{
        mode: 'combined',
        options: {stream :accessLogStream}
    }
}
// console.log('yyyyy',process.env.FYM_ENVIRONMENT);
// console.log('xxxx',eval(process.env.FYM_ENVIRONMENT)==undefined ? development : eval(process.env.FYM_ENVIRONMENT));
module.exports=eval(process.env.FYM_ENVIRONMENT)==undefined ? development : eval(process.env.FYM_ENVIRONMENT);
// module.exports=development;