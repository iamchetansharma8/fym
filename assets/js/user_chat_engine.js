class ChatEngineUser{
    constructor(chatBoxId,userEmail,profileId){
        this.profileId=profileId;
        this.customBox=chatBoxId;
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        // here this connect fires an event connection which is detected in server side
        this.socket=io.connect("https://fymapp.tech:5000",{secure: true});
        if(this.userEmail){
            this.connectionHandler();
        }
    }
    connectionHandler(){
        let self=this;
        this.socket.on('connect', function(){
            console.log('User Connection Estabilished using sockets.....');

            // sending a request(002) to join user room
            // in 2nd argument passing data about user who wants to join and which room 
            // he wants to join
            // let's name the event join_user_room
            self.socket.emit('join_user_room',{
                user_email:self.userEmail,
                chatroom:self.customBox
            });

            // detecting event user_joined fired from front end everytime a new user enters
            // the chatroom
            self.socket.on('custom_user_joined',function(data){
                // printing in front end
                console.log('custom user joined in chatroom, data : ',data);
            });
        });

        // firing an event along with message when clicked on submit present in frontend
        $('#send-user-msg').click(function(){
            let msg=$('.user-chat-input').val();
            let allData={
                msg:msg,
                email:self.userEmail,
                chatroom:self.customBox,
                profile_id:self.profileId
            }
            if(msg!=''){
                //start
                console.log(allData,'llk');
                // let tosend=JSON.stringify(allData);
                $.post('/home-msg',   // url
                { myData: allData }, // data to be submit
                    function(data, status, jqXHR) {// success callback
                        console.log(status,'**');
                });
                // end
                self.socket.emit('send_user_message',{
                    message: msg,
                    user_email:self.userEmail,
                    chatroom:self.customBox
                });
            }
        });
        // receiving event receive_message to broadcast messages over frontend
        self.socket.on('receive_user_message',function(data){
            console.log('user message received, data_msg : ',data.message);

            // creating a new li
            let newMessage=$('<li>');

            let messageType='other-msg1';
            if(data.user_email==self.userEmail){
                messageType='self-msg1';
            }
            // console.log('msss',data.mes)
            // appending span and sub to newly created list newMessage
            newMessage.append($('<span>',{
                'html':data.message
            }));
            let today = new Date();
            let hour=today.getHours();
            let min=today.getMinutes();
            if(hour<10){hour="0"+hour};
            if(min<10){min="0"+min};
            let time1 = hour + ":" + min;
            newMessage.append($('<sub>',{
                'html':time1
            }));

            // okay now let's add class messageType to determine style of new list item
            newMessage.addClass(messageType);

            // finally let's just append this newMessage to main list, i.e. .home-chat-list class
            $('.user-chat-list').append(newMessage);
            $('.user-chat-input').val("");
            // $('.home-chats').scrollTop = $('.home-chats').scrollHeight;
            // $('.home-chats').scrollTop($('.home-chats').height()+ini);
            $('.user-chats').scrollTop($('.user-chats')[0].scrollHeight);
            // console.log($('.home-chats').height());
            // console.log($('.home-chats')[0].scrollHeight);
        });
    }
}
$('.user-chats').scrollTop($('.user-chats')[0].scrollHeight);