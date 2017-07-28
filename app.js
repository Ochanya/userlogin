const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

// configure mustache
app.engine( 'mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//configure body parser
app.use(bodyParser.urlencoded({ extended: false}));

//configure public to statically served
app.use(express.static('public'));

app.use(session({ //what is this doing?
  secret: '2C44-4D44-WppQ38S',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', function(req, res){
  if (req.session && req.session.admin){//admin?
    res.render('root', {userInfo: userInfo});
  }else{
    res.redirect('/login');
  }
});


let userInfo = {
  'username': 'Ochanya',
  'password': '123'
}

app.get('/login',function(req, res){
  res.render('login');

});

app.post('/login',function(req,res){
  if (req.body.name === userInfo.name && req.body.password ===userInfo.password){
    req.session.admin = true;
    res.redirect('/');
  }
});

let auth = function(req, res, next){
  if (req.session && req.session.admin){
    return next();
  }else{
    return res.sendStatus(401);
  }
}

app.get('/', auth, function(req, res){
  res.render('root', {userInfo: userInfo});
});

app.post('/logout', function(req,res){
  req.session.destroy();
  res.render('logout');
});

app.listen(3000,function(){
  console.log('Login started on port 3000....')
});
