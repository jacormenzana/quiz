
//APP.JS: Primero-> Importa primero los MWs que va a instalar con require(….).
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

//APP.JS: Segundo-> Importa enrutadores
var routes = require('./routes/index');


//APP.JS: Tercero-> Crea aplicación
var app = express();


//APP.JS: Cuarto-> Instala el generador de vistas ejs
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(partials());


//APP.JS: Quinto-> Instala MWs con app.use().
//                  Los MWs se instalan en el orden en que deben ejecutarse
//                  cuando llegue una transacción HTTP.Cada transacción HTTP 
//                  ejecuta los MWs instalados en orden en que han sido instalados.

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'public','images','favicon.ico'));
app.use(favicon(__dirname + '/public/images/ball.ico'));
//app.use(favicon('./public/images/ball.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz_2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



//APP.JS: Sexto-> Se define un MW que realiza dos funciones
//                  Guarda la ruta de cada solicitud HTTP en la variable session.redir 
//                  para que esté accesible en las vistas
//
//                  Copia la sesión que stá accesible en req.session en res.locals.session 
//                  para  que esté accesible en las vistas



//Helpers dinámicos
app.use(function(req, res, next) {

  // guardar parth en session.redir para despues de .login
  if (!req.path.match(/\/login|\/logout/)) {
      req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});


app.use(function(req, res, next) {
    if (req.session.user) {
      if (Date.now() - req.session.user.lastRequestTime > 120000) {
          delete req.session.user;
      } else {
          req.session.user.lastRequestTime = Date.now();
      }
    }
    next();
});


//APP.JS: Sexto-> Instala enrutadores
//                Asocia rutas con sus gestores
app.use('/', routes);






//APP.JS: Séptimo-> Se crean e instalan tres MWs

//                  MW que atiende a rutas no atendidas por 
//                  rutas anteriores. Se genera error HTTP 404 
//                  catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//                  MW gestor de errores para la fase de
//                  desarrollo del proyecto. 
//                  error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err, 
      errors: []
    });
  });
}

//                  MW gestor de errores para la fase de
//                  producción del proyecto. 
//                  no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}, 
    errors: []
  });
});

// APP.JS: Octavo-> Exporta app para comando de arranque
module.exports = app;
