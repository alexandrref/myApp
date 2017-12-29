var connect = require('connect'),
	path = require('path'),
	routes = require('./routes'),
	exphbs = require('express3-handlebars');

module.exports = function(app){

	app.engine('handlebars', exphbs.create({
		defaultLayout: 'main',
		layoutsDir: app.get('views') + '/layouts',
		partialsDir: [app.get('views') + '/partials'] // может быть массивом строк
	}).engine);

	app.set('view engine', 'handlebars');

	app.use(connect.logger('dev')); // логирует каждый запрос
	app.use(connect.bodyParser({
		uploadDir: path.join(__dirname, '../public/upload/temp')
	})); // req.body содержит данные POST

	app.use(connect.json()); // req.body содержит данные json
	app.use(connect.urlencoded()); //req.query содержит GET
	app.use(connect.methodOverride()); // для поддержки старыми браузерами REST
	app.use(connect.cookieParser('some-secret-valye-here')); // позволяет работать сcookie
	app.use(app.router); // что то позапросам REST
	app.use('/public/', connect.static(path.join(__dirname, '../public'))); // подгружает статические файлы

	if('development' === app.get('env')) {
		app.use(connect.errorHandler()); // обработчик ошибок 
	}

	routes.initialize(app);

	return app;
}