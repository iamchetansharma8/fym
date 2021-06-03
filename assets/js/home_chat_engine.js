class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        // here this connect fires an event connection which is detected in server side
        this.socket=io.connect('http://localhost:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }
    connectionHandler(){
        let self=this;
        this.socket.on('connect', function(){
            console.log('Connection Estabilished using sockets.....');

            // sending a request(001) to join room
            // in 2nd argument passing data about user who wants to join and which room 
            // he wants to join
            // let's name the event join_room
            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:'fymroom'
            });

            // detecting event user_joined fired from front end everytime a new user enters
            // the chatroom
            self.socket.on('user_joined',function(data){
                // printing in front end
                console.log('user joined in chatroom, data : ',data);
            });
        });

        // firing an event along with message when clicked on submit present in frontend
        $('#send-home-msg').click(function(){
            let msg=$('.home-chat-input').val();

            if(msg!=''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email:self.userEmail,
                    chatroom:'fymroom'
                });
            }
        });

        // receiving event receive_message to broadcast messages over frontend
        self.socket.on('receive_message',function(data){
            console.log('message received, data_msg : ',data.message);

            // creating a new li
            let newMessage=$('<li>');

            let messageType='other-msg';
            if(data.user_email==self.userEmail){
                messageType='self-msg';
            }

            // appending span and sub to newly created list newMessage
            newMessage.append($('<span>',{
                'html':data.message
            }));
            newMessage.append($('<sub>',{
                'html':data.user_email
            }));

            // okay now let's add class messageType to determine style of new list item
            newMessage.addClass(messageType);

            // finally let's just append this newMessage to main list, i.e. .home-chat-list class
            $('.home-chat-list').append(newMessage);
            $('.home-chat-input').val("");
            // $('.home-chats').scrollTop = $('.home-chats').scrollHeight;
            // $('.home-chats').scrollTop($('.home-chats').height()+ini);
            $('.home-chats').scrollTop($('.home-chats')[0].scrollHeight);
            // console.log($('.home-chats').height());
            // console.log($('.home-chats')[0].scrollHeight);
        });
    }
}