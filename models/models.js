var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null,null,
						{dialect: "sqlite", storage: "quiz.sqlite"}
						);

//Importar la definición de la tabla quiz
var Quiz =sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // exportar definición de Quiz

//sequelize.sync() crea e inicializa la tabla quiz
sequelize.sync().then(function() {
	//success(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count === 0) {
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma' 
			})
			.then(function(){console.log('Base de datos inicializada')});
		};
	}); 
});