var express = require('express');
var bodyParser = require('body-parser');
var users = require('./users.json');

var app = express();
app.use(bodyParser.json());

app.get('/api/users', function(req,res,next){
  if(req.query.language){
    var result = users.filter(
      function(value){
        return (value.language === req.query.language);
      }
    )
    res.status(200).json(result);
  } else if (req.query.age){
    var result = users.filter(
      function(value){
        return (value.age === req.query.age);
      }
    )
    res.status(200).json(result);
  } else if (req.query.city){
    var result = users.filter(
      function(value){
        return (value.city.toLowerCase() === req.query.city.toLowerCase());
      }
    )
    res.status(200).json(result);
  } else if (req.query.state){
    var result = users.filter(
      function(value){
        return (value.state.toLowerCase() === req.query.state.toLowerCase());
      }
    )
    res.status(200).json(result);
  } else if (req.query.gender){
    var result = users.filter(
      function(value){
        return (value.gender.toLowerCase() === req.query.gender.toLowerCase());
      }
    )
    res.status(200).json(result);
  } else {
    res.status(200).json(users);
  }
});

app.get('/api/users/:typeOrId', function(req,res,next){
  if(isNaN(req.params.typeOrId)) {
    var result = users.filter(
    function (value){
      return (value.type === req.params.typeOrId)
    }
    );
    if (result) {
      // console.log(result);
      res.status(200).json(result);
    } else {
      res.status(404).send('User type could not be found');
    }
  }
  else {
    var result = users.find(
    function (value){
      return (value.id == req.params.typeOrId)
    }
    );
    if (result) {
      // console.log(result);
      res.status(200).json(result);
    } else {
      res.status(404).send('User could not be found');
    }
  }
});

app.post('/api/users', function(req,res,next){
  req.body.id = users.length+1;
  req.body.favorites = [];
  users.push(req.body);
  res.status(200).json(req.body);
  // console.log(req.body);
});

app.post('/api/users/:type', function(req,res,next){
  req.body.id = users.length+1;
  req.body.favorites = [];
  req.body.type = req.params.type;
  users.push(req.body);
  res.status(200).json(req.body);
  // console.log(req.body);
});

app.post('/api/users/language/:userId', function(req,res,next){
  var result = users.find(
    function (value){
      if (value.id == req.params.userId){
        value.language = req.body.language;
        return (value.id == req.params.userId);
      }
    }
  );
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json('User could not be found');
  }
});

app.post('/api/users/forums/:userId', function(req,res,next){
  var result = users.find(
    function (value){
      return (value.id == req.params.userId)
    }
  );
  if (result) {
    result.favorites.push(req.body.add);
    res.status(200).json(result);
  } else {
    res.status(404).json('User could not be found');
  }
});

app.delete('/api/users/forums/:userId', function(req,res,next){
  var id = +req.params.userId;
  var deleteFavorite = req.query.favorite;
  users.map(function(e, i) {
       if (e.id === id) {
           e.favorites.splice(e.favorites.indexOf(deleteFavorite), 1);
           res.status(200).json(e.favorites);
       }
   });
});

app.delete('/api/users/:userId', function(req,res,next){
  var result = users.find(
    function (value){
      return (value.id == req.params.userId)
    }
  );
  if (result) {
    // console.log(result);
    users.splice(users.indexOf(result),1);
    res.sendStatus(200);
  } else {
    res.status(404).json('User could not be found');
  }
});

app.put('/api/users/:userId', function(req,res,next){
  var id = +req.params.userId;
  users.map(function(e,i){
    if(e.id === id){
      for(var key in req.body){
        e[key] = req.body[key];
      }
      res.status(200).json(e);
    }
  });
});

app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
});

module.exports = app;
