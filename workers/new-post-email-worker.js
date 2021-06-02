const queue=require('../config/kue');

const postMailer=require('../mailers/new_post');

queue.process('newPostEmails',function(job,done){
    // console.log('emails worker is processing a job',job.data.userCur.connections[0].following);
    // console.log('amsn',job.data.userCur.connections[0].following._id,'ll');
    postMailer.newPost(job.data.userCur,job.data.post);
    done();
});