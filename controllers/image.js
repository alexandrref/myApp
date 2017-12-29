module.exports = {
	index: function(req, res) {
		res.send('image:index ' + req.params.image_id); // param добавлено благодаря urlencoded
	},

	create: function(req, res){
		res.send('image:create POST');
	},

	like: function(req, res){
		res.send('image:like POST ');
	},

	comment: function(req, res){
		res.send('image:comment POST ');
	}
};