var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req,res) =>{
  res.send('11')
})

app.post('/api/0/projects/threatbook-sentry/:name/plugins/webhooks/', (req, res) => {
  console.log(222, req)
    // handleRequest(req, res)
});


module.exports = app;
