$(document).ready(function()
{
    var pnlConversation = $("#pnlConversation");
    var txtMessage = $("#txtMessage");
    var btnSend = $("#btnSend");
    var roomName = $("#roomName");
    var lstRooms = $("#lstRooms");
    var txtNewRoom = $("#txtNewRoom");
    var btnNewRoom = $("#btnNewRoom");
    var roomIndex = {};
    
    var socket = io();
    var currRoom;

    socket.on("room", function(room)
    {
        currRoom = room;
        roomName.text(room);
        pnlConversation.html("");
    });

    socket.on("chat", function(data)
    {
        var message = $("<div/>").text((data.user ? data.user + ": ": "") +  data.message);
        pnlConversation.append(message);
    });

    socket.on("updateRooms", function(data)
    {
        roomIndex = {};
        lstRooms.html("");
        for(var roomId in data)
        {
            var room = data[roomId];
            if(room && room.id)
            {
                var item = $("<li></li>").text(room.id + " (" + room.count + ")");
                $.data(item.get(0),"id", room.id);
                if(room.id == currRoom)
                {
                    item.addClass("selected");
                }
                lstRooms.append(item)
                roomIndex[room.id] = item;
            }
        }
    });
    
    lstRooms.on("click", function(evtData)
    {
        var target = evtData.target;
        if(target.nodeName == "LI")
        {
            var id= $.data(target, "id");
            if(id != currRoom)
            {
               newRoom(id);
            }
        }
    });


    
    txtNewRoom.keydown(function(evtData)
    {
        if(evtData.keyCode == 13)
        {
            newRoom();
        }
    });   
 
    btnNewRoom.on("click", function(evtArgs)
    {
        newRoom();
    });

    function newRoom(forceRoom)
    {
        var room = forceRoom || txtNewRoom.val();
        if(room)
        {
            currRoom = room;
            socket.emit('message', {type: "newRoom", message: currRoom });
            txtNewRoom.val(null);
        }
    }
    
    txtMessage.keydown(function(evtData)
    {
        if(evtData.keyCode == 13)
        {
            sendChat();
        }
    });

    btnSend.on("click", function(evtArgs)
    {
        sendChat();
    });
    
    function sendChat()
    {
        if(txtMessage.val())
        {
            socket.emit('message', {type: "chat", message: txtMessage.val()});
            txtMessage.val(null);
        }
    }

});