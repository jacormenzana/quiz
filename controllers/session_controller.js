//MW de autorización de accesps HTTP restringidos

exports.loginRequired = function(req, res, next){

	if(req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};



// GET /login  -- Formulario de login
exports.new = function(req, res) {
	var errors= req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new.ejs',	{errors: errors});
};


// POST /login  -- Crear la sesion
exports.create = function(req, res) {

	var login    = req.body.login;
	var password = req.body.password;	


	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {

		if (error){	// si hay error retornamos mensajes de error de sesión
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;
		}

		// Crear req.session.user y guardar los campos id y username
		// La sesión se define por la existencia de req.user.session

//		req.session.user = {id:user.id, username:user.username};
		req.session.user = { id: user.id, username: user.username, lastRequestTime: Date.now() }
		res.redirect(req.session.redir.toString()); //redirección a path anterior a login

	});

};


// DELETE /logout -- Destruir sesión

exports.destroy = function(req, res) {

	delete req.session.user;
	res.redirect(req.session.redir.toString());
};