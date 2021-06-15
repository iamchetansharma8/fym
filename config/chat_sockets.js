module.exports.chatSockets=function(socketServer){
    let io=require('socket.io')(socketServer,{
        // searched a lot of net to fix this bug, so from sockect 3.0 onwards we 
        // need to explicitly define cors with port of http server(in case of localhost)
        // or https://example.com
        cors:{
            origin: "http://fymapp.tech",
            methods: ["GET", "POST"]
        }
    });

    // connect event in front end fired this event connection , in callback function 
    // we get an object socket from this callback which has multiple properties
    // this then emits back to front end connectHandler(basically connect event has occured
    // which is received there) and console.log will occur there
    io.sockets.on('connection',function(socket){
        console.log('new Connection received',socket.id);

        socket.on('disconnect',function(){
            console.log('socket disconnected');
        });

        // detecting a request(001) of client side where I'm(signed in user is requesting 
        // to join room)
        // join_room (same name as in 001)
        socket.on('join_room',function(data){
            console.log('Joining request received ,DATA : ',data);

            // if chatroom already exists, user will be added to this chatroom, otherwise
            // new room with name chatroom will be created and current user will be
            // added to it
            socket.join(data.chatroom);

            // cool so now cur_user has joined the chat room, let's tell the whole room 
            // about it
            io.in(data.chatroom).emit('user_joined', data);
            // now this will be detected in client side
        });

        // start user rooms 1
        socket.on('join_user_room',function(data){
            console.log('Joining request for room : ',data.chatroom,' received ,data:: ',data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('custom_user_joined', data);
        });
        socket.on('send_user_message',function(data){
            io.in(data.chatroom).emit('receive_user_message',data);
        });
        // end user rooms 1

        // detect send_message fired from frontend code while clicking on submit of home
        socket.on('send_message',function(data){

            // firing an event in joined chatroom(io.in does that) to receive and show
            // message on front end
            io.in(data.chatroom).emit('receive_message',data);
        });
    });
}