var fs = require('fs'),
	path = require('path'),
	Models = require('../models'),
	MD5 = require('MD5');
	
var sidebar = require('../helpers/sidebar');

module.exports = {
	index: function(req, res) {

		var viewModel = {
	        image: {},
	        comments: []
	    };

	    Models.Image.findOne({ filename: { $regex: req.params.image_id } }, function(err, image){
	    	if(err) throw err;

	    	if(image){
	    		image.views += 1;
	    		viewModel.image = image;
	    		image.save();

	    		Models.Comment.find({ image_id: image._id },
	    							{},
	    							{ sort: { timestamp: 1 } },
	    							function(err, comments){
	    								viewModel.comments = comments;
	    								sidebar(viewModel, function(viewModel){
	    									res.render('image', viewModel); // param добавлено благодаря urlencoded
	    								});
	    							}
	    		);
	    	} else {
	    		res.redirect('/');
	    	}
	    });
	},

	create: function(req, res){
		var saveImage = function(){
			var possible = '1234567890qwertyuiopasdfghjklzxcvbnm',
				imgUrl = '';
			
			for(var i = 0; i < 6; i++){
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			Models.Image.find({ filename: imgUrl }, function(err, images){
				if(err) throw err;

				if(images.length > 0){
					saveImage();
				} else {
					var tempPath = req.files.file.path,
						ext = path.extname(req.files.file.name),
						targetPath = path.resolve('./public/upload/' + imgUrl + ext);
					if(ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg'){
						fs.rename(tempPath, targetPath, function(err){
							if(err) throw err;

							var newImg = new Models.Image({
								title: req.body.title,
								description: req.body.description,
								filename: imgUrl + ext
							});

							newImg.save(function(err, image){
								console.log('Successfully inserted image: ' + image.filename);
								res.redirect('/images/' + image.uniqueId);
							});
						});
					} else {
						fs.unlink(tempPath, function(){
							if(err) throw err;

							res.json(500, {error: 'Only image files are allowed'});
						});
					}
				}
			});
		};

		saveImage();
	},

	like: function(req, res) {
        Models.Image.findOne({ filename: { $regex: req.params.image_id } },
            function(err, image) {
                if (!err && image) {
                    image.likes = image.likes + 1;
                    image.save(function(err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json({ likes: image.likes });
                        }
                    });
                }
            });
    },

	comment: function(req, res){
		Models.Image.findOne({ filename: { $regex: req.params.image_id } }, function(err, image){
			if(!err && image) {
				var newComment = new Models.Comment(req.body);
				newComment.image_id = image._id;
				newComment.save(function(err, comment){
					if(err) throw err;
					res.redirect('/images/' + image.uniqueId + '#' + comment._id);
				});
			} else {
				res.redirect('/');
			}
		});
	}
};