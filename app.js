var express = require('express');
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = express();

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({dest: 'uploads'})); // dest is not necessary if you are happy with the default: /tmp

app.locals.title = 'Extended Express Example';

app.all('*', function(req, res, next){
  fs.readFile('posts.json', function(err, data){
    res.locals.posts = JSON.parse(data);
    next();
  });
});

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/post/:slug', function(req, res, next){
  res.locals.posts.forEach(function(post){
    if (req.params.slug === post.slug){
      res.render('post.ejs', { post: post });
    }
  })
});

app.get('/api/posts', function(req, res){
  res.json(res.locals.posts);
});

app.get('/upload', function(req, res){
  res.render('upload.ejs');
});

app.post('/uploads', function (req, res) {
    //console.log(req.files);

    var files = req.files.file;
    if (Array.isArray(files)) {
        // response with multiple files (old form may send multiple files)
        console.log("Got " + files.length + " files");
    }
    else {
        // dropzone will send multiple requests per default
        console.log("Got one file");
    }
    res.status(204);
    res.send();
});

app.listen(3000);
console.log('app is listening at localhost:3000');
