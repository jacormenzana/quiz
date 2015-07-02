
// Primero-> Importa el modelo para acceder a la BBDD.

var models = require('../models/models.js');


//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res,next,quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId='+quizId));}
		}
	).catch(function(error) {next(error);});
};


// GET /quizes
exports.index = function(req, res) {

	//Parámetro de búsqueda search
	var parametroSearchEnQueryDeGetHttp = req.query.search;

	//Existe condicion de filtrado
	var tipo = 'Completo';

	if(parametroSearchEnQueryDeGetHttp === undefined) {
		//Si no existe parámetro, significa que búsqueda se ha ejecutado sin condición de filtrado
		// y busco todos
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index.ejs',{quizes: quizes, tipo: tipo, errors: []});
		})
	} else {
		//Si existe parámetro, significa que existe condición de filtrado y ejecuto búsqueda condicionada	
		patronBusqueda = "%".concat(parametroSearchEnQueryDeGetHttp.replace(/ +/g,'%'),"%");
		tipo = 'Filtrado';
		models.Quiz.findAll({where: ["pregunta like ?", patronBusqueda]}).then(function(quizes) {
			res.render('quizes/index.ejs',{quizes: quizes, tipo: tipo, errors: []});
		})
	}
};


// GET /quizes/:Id
exports.show = function(req, res) {
		res.render('quizes/show',{ quiz: req.quiz, errors: []});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if ( req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	} 	
	res.render('quizes/answer',	{quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /author
exports.author = function(req, res) {
	res.render('author');
};


// GET /new
exports.new = function(req, res) {
	var quiz = models.Quiz.build({pregunta:"Pregunta", respuesta: "Respuesta"});
	res.render('quizes/new',	{quiz: quiz, errors: []});
};


// POST /create
exports.create = function(req, res) {

	var quiz = models.Quiz.build(req.body.quiz);
	
	quiz.validate().then(function(err){
				if(err) {
					res.render('quizes/new',{quiz:quiz, errors:err.errors});
				} else {

					// guarda en DB los campos pregunta y respuesta de quiz
					quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
						res.redirect('/quizes');		
					});
				}
			}
		);
};
