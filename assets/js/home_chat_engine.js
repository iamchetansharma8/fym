class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        // here this connect fires an event connection which is detected in server side
        this.socket=io.connect("https://fymapp.tech:5000");
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
            let allData={
                msg:msg,
                email:self.userEmail,
                chatroom:'fymroom'
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
            $('.home-chat-list').append(newMessage);
            }

            // // appending span and sub to newly created list newMessage
            // newMessage.append($('<span>',{
            //     'html':data.message
            // }));
            // let today = new Date();
            // let hour=today.getHours();
            // let min=today.getMinutes();
            // if(hour<10){hour="0"+hour};
            // if(min<10){min="0"+min};
            // let time1 = hour + ":" + min;
            // newMessage.append($('<sub>',{
            //     'html':time1
            // }));

            // // okay now let's add class messageType to determine style of new list item
            // newMessage.addClass(messageType);
            console.log('no')
            console.log(messageType)
            if(messageType=='other-msg'){
                console.log('yes')
                let p=JSON.stringify(data.user_email);
                let id_sender=p.split("@")[0];
                id_sender=id_sender.replace(/["]+/g, '');
                let contactDiv=$('<div>');
                contactDiv.append($('<div>',{
                    'html':id_sender
                }));
                let contentDiv=$('<div>');
                contentDiv.append($('<span>',{
                    'html':data.message
                }));
                let today = new Date();
                let hour=today.getHours();
                let min=today.getMinutes();
                if(hour<10){hour="0"+hour};
                if(min<10){min="0"+min};
                let time1 = hour + ":" + min;
                contentDiv.append($('<sub>',{
                    'html':time1
                }));
                contactDiv.addClass('other-msg-user');
                contentDiv.addClass('other-msg-content');
                let finalDiv=$('<div>');
                finalDiv.addClass('other-msg-box');
                finalDiv.append(contactDiv);
                finalDiv.append(contentDiv);
                let finalLi=$('<li>');
                finalLi.append(finalDiv);
                finalLi.addClass(messageType);
                $('.home-chat-list').append(finalLi);
                // $('.other-msg-box').append(contactDiv);
                // $('.other-msg-box').append(contentDiv);
                
            }
            // finally let's just append this newMessage to main list, i.e. .home-chat-list class
            // $('.home-chat-list').append(newMessage);
            $('.home-chat-input').val("");
            // $('.home-chats').scrollTop = $('.home-chats').scrollHeight;
            // $('.home-chats').scrollTop($('.home-chats').height()+ini);
            $('.home-chats').scrollTop($('.home-chats')[0].scrollHeight);
            // console.log($('.home-chats').height());
            // console.log($('.home-chats')[0].scrollHeight);
        });
    }
}
$('.home-chats').scrollTop($('.home-chats')[0].scrollHeight);