var fs = require('fs'),
	path = require('path');
	
var sidebar = require('../helpers/sidebar');

module.exports = {
	index: function(req, res) {

		var viewModel = {
	        image: {
	            uniqueId:       1,
	            title:          'Sample Image 1',
	            description:    'This is a sample.',
	            filename:       'sample1.jpg',
	            views:          0,
	            likes:          0,
	            timestamp:      Date.now
	        },
	        comments: [
	            {
	                image_id:   1,
	                email:      'test@testing.com',
	                name:       'Test Tester',
	                gravatar:   'http://www.gravatar.com/avatar/9a99fac7b524fa443560ec7b5ece5ca1?d=monsterid&s=45',
	                comment:    'This is a test comment...',
	                timestamp:  Date.now()
	            },{
	                image_id:   1,
	                email:      'test@testing.com',
	                name:       'Test Tester',
	                gravatar:   'http://www.gravatar.com/avatar/9a99fac7b524fa443560ec7b5ece5ca1?d=monsterid&s=45',
	                comment:    'Another followup comment!',
	                timestamp:  Date.now()
	            }
	        ]
	    };

	    sidebar(viewModel, function(viewModel){
	    	res.render('image', viewModel); // param добавлено благодаря urlencoded
	    })
	},

	create: function(req, res){
		var saveImage = function(){
			var possible = '1234567890qwertyuiopasdfghjklzxcvbnm',
				imageUrl = '';
			
			for(var i = 0; i < 6; i++){
				imageUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			var tempPath = req.files.file.path,
				ext = path.extname(req.files.file.name),
				targetPath = path.resolve('./public/upload/' + imageUrl + ext);
			if(ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg'){
				fs.rename(tempPath, targetPath, function(err){
					if(err) throw err;

					res.redirect('/images/' + imageUrl);
				});
			} else {
				fs.unlink(tempPath, function(){
					if(err) throw err;

					res.json(500, {error: 'Only image files are allowed'});
				});
			}
		};

		saveImage();
	},

	like: function(req, res){
		res.json({likes: 1});
	},

	comment: function(req, res){
		res.send('image:comment POST ');
	}
};