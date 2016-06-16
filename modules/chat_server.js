module.exports = function(io)
{
    var defaultRoomId = "Great Hall"
    var rooms = {};
    openRoom(defaultRoomId);

    function openRoom(id)
    {
        if(!rooms[id])
        {
            rooms[id] = { id: id, count: 0};
            io.emit("openRoom", id);
        }
    }

    io.on('connection', function(client)
    {
        var currRoom = rooms[defaultRoomId];
       
        var userName = client.request.session.user;
        joinRoom(currRoom);
        updateRooms();

        client.on('message', function(data)
        {
 
            switch(data.type)
            {
                case "newRoom":
                    leaveRoom(currRoom);
                    openRoom(data.message);
                    joinRoom(rooms[data.message]);
                    break;
                case "chat":
                    sendChat(data.message)
                    break;
            }  
        });

        client.on('disconnect', function()
        {
            if(currRoom)
            {
                leaveRoom(currRoom);
            }
        });

        function sendChat(message, noUser)
        {
            io.to(currRoom.id).emit("chat", {user: (noUser? null : userName), message:message});
        }

        function joinRoom(room)
        {
            currRoom = room; 
            client.join(room.id);
            room.count++;
            updateRooms();
            client.emit("room", room.id);
            sendChat(userName + " has entered the room.", true);
        }

        function leaveRoom()
        {
            if(currRoom)
            {
                client.leave(currRoom.id);
                sendChat(userName + " has left the room.", true);
                currRoom.count--;
                
                if(currRoom.count < 1 && currRoom.id != defaultRoomId)
                {
                    closeRoom(currRoom); 
                } 
                currRoom = null;

                updateRooms();
            }
        }

        function closeRoom(room)
        {
            delete rooms[room.id];
            updateRooms();
        }

        function updateRooms()
        {
            io.emit("updateRooms", rooms);
        }
    });
};
