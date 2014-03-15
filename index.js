var express     = require('express')
  , stylus      = require('stylus')
  , nib         = require('nib')
  , browserify  = require('browserify-middleware')
  , app         = module.exports = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(stylus.middleware({
    src: __dirname + '/assets',
    dest: __dirname + '/public',
    compile: function(str, path) {return stylus(str).set('filename', path).use(nib());}
  }));
  app.use(express.static(__dirname + '/public'));
  app.use('/data', express.static(__dirname + '/assets/data'));
  app.use("/images", express.static(__dirname + '/assets/images'))

  app.locals.pretty = true;
});

app.get('/app.js', browserify('./assets/js/index.js'));

app.get('/', function(req, res) {
  res.render('index');
});

require('./lib/api')(app);

app.listen(app.get('port'), function() {
  console.log('listening on %d', app.get('port'));
});
