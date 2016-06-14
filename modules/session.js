module.exports = function(app, io)
{
    var session = require('cookie-session');
    
    var sess =session(
    {
        //*jb - would not store thumbprint in code, needs to be stored in secured configuration
        keys: ['sdf09398234sdf9sdf'],
        name: 'session'
    });
   
    app.set('trust proxy', 1) // trust first proxy
    app.use(function(req, res, next)
    {
        sess(req, res, next);
    });
    
    io.use(function(socket, next)
    {
        sess(socket.request, socket.request.res, next);
    });

    return sess;
};