module.exports = function(app)
{
var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/chat.html', function(req, res, next) 
{
  //if logged in, go to chat.html
  if(!req.session.user)
  {
    res.redirect("../index.html")
  }
  else
  {
    next();
  }
});

//handle authetication
router.post("/login", function(req, res, next)
{  
    var name = req.body.user;
    var pass = req.body.password;
    var sess = req.session;
    sess.user = name;

    res.redirect("../chat.html");
});

app.use('/', router);

app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


return router;
};


