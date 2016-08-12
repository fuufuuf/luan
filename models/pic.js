var AV = require('avoscloud-sdk').AV;
AV.initialize("la83xay208v19srmcjmah9pk6e30ygyhcv2qj9yhhgee454b", "vx993snij5vl4k4lc70kaxoxhuaabtw19trx4ckwzuuolgt0");
var formidable = require('formidable');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var Luan_hot_photo = AV.Object.extend("Luan_hot_photo_android");
var Luan_photo_Info = AV.Object.extend("Luan_photo_Info");
var async = require('async');

exports.list = function(req, res) {
    res.render('list', {
        title: 'List',
        items: [1991, 'fu', 'express', 'Node.js']
    });
};

//列出所有素材
exports.allp = function(req, res, next) {


    var query = new AV.Query("Luan_photo_Info");
    var pic_list = [];
    query.limit(1000);
    query.ascending("GroupID");
    query.find({
        success: function (results) {
            console.log("Successfully retrieved " + results.length + "photo");
            //get all pics for specified group
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                // console.log(object.get("File").thumbnailURL(100, 100), object.get("PhotoID"), object.get("GroupID"));
                pic_list[i] = {"url" : object.get("File").thumbnailURL(100, 100),
                    "groupID" : object.get("GroupID"),
                    "PhotoID": object.get("PhotoID"),
                    "shiftScale": object.get("P1"),
                    "shiftX": object.get("P2"),
                    "shiftY": object.get("P3"),
                    "width": object.get("P4"),
                    "height": object.get("P5"),
                    "picID": object.id
                };

            }

            res.render('allp', { title: 'ALL PICS',
                    pic:pic_list}
            );
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });

};

//修改指定素材

exports.modify = function(req, res) {
    var pic = AV.Object.extend("Luan_photo_Info");
    var query = new AV.Query(pic);

    var id = req.body.c||req.body.d;
    //console.log(id+' body c '+req.body.c+'body d '+req.body.d);
    //console.log(req.body);

    if (req.body.c){
        //这个 id 是要修改条目的 objectId，你在生成这个实例并成功保存时可以获取到，请看前面的文档
        console.log(id);
        query.get(id, {
            success: function(pic) {
                // 成功，回调中可以取得这个 Post 对象的一个实例，然后就可以修改它了
                console.log('find out the pic');

                pic.set("P1", parseFloat(req.body.P1));
                pic.set("P2", parseFloat(req.body.P2));
                pic.set("P3", parseFloat(req.body.P3));
                pic.set("P4", parseFloat(req.body.P4));
                pic.set("P5", parseFloat(req.body.P5));
                pic.save(null, {
                    success: function(pic) {
                        // Execute any logic that should take place after the object is saved.
                        console.log('New object created with objectId: ' + pic.id);
                        res.locals.success = 'succeeded!!!';
                        res.render('upwork', { title: 'updated',
                            picID: pic.id });
                    },
                    error: function(pic, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a AV.Error with an error code and description.
                        err_mesg = 'Failed to create/UPDATE Luan_photo, with error code: ' + error.message;
                        console.log(err_mesg);
                        res.render('upfail', { err: err_mesg });
                    }
                });
            },
            error: function(object, error) {
                // 失败了.
                console.log('NO SUCH PIC ON product CLOUD');

                var pic = AV.Object.extend("Luan_group_test");
                var query = new AV.Query(pic);

                query.get(id, {
                    success: function(pic) {
                        // 成功，回调中可以取得这个 Post 对象的一个实例，然后就可以修改它了
                        console.log('find out the pic');

                        pic.set("P1", parseFloat(req.body.P1));
                        pic.set("P2", parseFloat(req.body.P2));
                        pic.set("P3", parseFloat(req.body.P3));
                        pic.set("P4", parseFloat(req.body.P4));
                        pic.set("P5", parseFloat(req.body.P5));
                        pic.save(null, {
                            success: function(pic) {
                                // Execute any logic that should take place after the object is saved.
                                console.log('New object created with objectId: ' + pic.id);
                                res.locals.success = 'succeeded!!!';
                                res.render('upwork', { title: 'updated',
                                    picID: pic.id });
                            },
                            error: function(pic, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a AV.Error with an error code and description.
                                err_mesg = 'Failed to create/UPDATE Luan_photo, with error code: ' + error.message;
                                console.log(err_mesg);
                                res.render('upfail', { err: err_mesg });
                            }
                        });
                    },
                    error: function(object, error) {
                        // 失败了.
                        console.log('NO SUCH PIC ON CLOUD');



                    }
                });



            }
        });


    }
    if(!req.body.c){
        console.log(id);
        query.get(id, {
            success: function(pic) {

                pic.destroy({
                    success: function(myObject) {

                        console.log('deleted!!!');
                        res.render('upwork', { title: 'deleted',
                            picID: pic.id });

                    },
                    error: function(myObject, error) {
                        console.log('fail to be deleted!!!')
                    }
                });

            },
            error: function(object, error) {
                // 失败了.
                console.log('NO SUCH PIC ON product CLOUD');

                var pic = AV.Object.extend("Luan_group_test");
                var query = new AV.Query(pic);

                query.get(id, {
                    success: function(pic) {

                        pic.destroy({
                            success: function(myObject) {

                                console.log('deleted!!!');
                                res.render('upwork', { title: 'deleted',
                                    picID: pic.id });

                            },
                            error: function(myObject, error) {
                                console.log('fail to be deleted!!!')
                            }
                        });

                    },
                    error: function(object, error) {
                        // 失败了.
                        console.log('NO SUCH PIC ON product CLOUD')


                    }
                });

            }
        });

    }

    // console.log(req.body);
};

//获取所有组图
exports.allg = function(req, res, next) {


    var query = new AV.Query("Luan_group_sample");
    var pic_list = [];
    var flag = null;
    query.limit(1000);
   // query.descending("GroupID");
    query.descending("createdAt");
    query.find({
        success: function (results) {
            console.log("Successfully retrieved " + results.length + " group photos");
            // Do something with the returned AV.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log(object.get("pic").thumbnailURL(100, 100), object.get("GroupID"));

                if(flag == object.get("GroupID")){

                   // break;
                }else {

                    flag = object.get("GroupID");

                    pic_list[i] = {"url": object.get("pic").thumbnailURL(100, 100),
                        "bigurl": object.get("pic").url(),
                        "groupID": object.get("GroupID")
                    };
                }

            }

            res.render('allg', { title: 'ALL GROUP',
                    pic:pic_list}
            );
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });

};

//post function, 素材上传
exports.upload = function(req, res) {

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = '/tmp/';
    form.keepExtensions = true;
    var avFile;

    form.parse(req, function(err, fields, files) {
        console.log(fields);
        var picName = fields.picName;

        if (err) {
            res.locals.error = err;
            res.render('upfail', { title: picName });
            return;
        }

        var extName = '';
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = 'png or jpg only';
            res.render('error', { title: picName });
            return;
        }

        picName = picName + '.' + extName;
        var newPath = form.uploadDir + picName;

        console.log(newPath);
        console.log(files.fulAvatar.path);
        fs.renameSync(files.fulAvatar.path, newPath);
        fs.readFile(newPath, function(err, data){
            avFile = new AV.File(picName, new Buffer(data));
            avFile.save().then(function() {
                console.log('AVFile fully saved');
               // var Luan_photo_Info = AV.Object.extend("Luan_photo_Info");
                var Luan_group_test = AV.Object.extend("Luan_group_test");
                var pic = new Luan_group_test();
                pic.set("P1", parseFloat(fields.p1));
                pic.set("P2", parseFloat(fields.p2));
                pic.set("P3", parseFloat(fields.p3));
                pic.set("P4", parseFloat(fields.p4));
                pic.set("P5", parseFloat(fields.p5));
                pic.set("type", fields.picType);
                pic.set("GroupID", parseInt(fields.groupID));
                pic.set("PhotoID", parseInt(fields.picID));
                pic.set("File", avFile);

                pic.save(null, {
                    success: function(pic) {
                        // Execute any logic that should take place after the object is saved.
                        console.log('New object created with objectId: ' + pic.id);
                        res.locals.success = 'succeeded!!!';
                        res.render('upwork', { title: 'upload!!!',
                            picID: pic.id });
                    },
                    error: function(pic, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a AV.Error with an error code and description.
                        err_mesg = 'Failed to create Luan_photo, with error code: ' + error.message;
                        console.log(err_mesg);
                        res.render('upfail', { err: err_mesg });
                    }
                });


            }, function(error) {
                // The file either could not be read, or could not be saved to AV.
                err_mesg = 'Failed to save AVFile with error code: ' + error.message;
                console.log(err_mesg);

                res.render('upfail', { err: err_mesg });
            });
        });





    });
};

//post function, 示例图片上传 -- deprecated;
exports.gupload = function(req, res) {

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = '/tmp/';
    form.keepExtensions = true;
    var avFile;

    form.parse(req, function(err, fields, files) {
        console.log(fields);
        console.log(files);
        var picName = fields.picName;

        if (err) {
            res.locals.error = err;
            res.render('upfail', { title: picName });
            return;
        }

        var extName = '';
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = 'png or jpg only';
            res.render('error', { title: picName });
            return;
        }

        picName = picName + '.' + extName;
        var newPath = form.uploadDir + picName;

        console.log(newPath);
        console.log(files.fulAvatar.path)
        fs.renameSync(files.fulAvatar.path, newPath);
        fs.readFile(newPath, function(err, data){
            avFile = new AV.File(picName, new Buffer(data));
            avFile.save().then(function() {
                console.log('AVFile fully saved');
                var Luan_group_sample = AV.Object.extend("Luan_group_sample");
                var pic = new Luan_group_sample();
                pic.set("GroupID", parseInt(fields.groupID));
                pic.set("pic", avFile);

                pic.save(null, {
                    success: function(pic) {
                        // Execute any logic that should take place after the object is saved.
                        console.log('New object created with objectId: ' + pic.id);
                        res.locals.success = 'succeeded!!!';
                        res.render('upwork', { title: 'works!!!',
                            picID: pic.id });
                    },
                    error: function(pic, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a AV.Error with an error code and description.
                        err_mesg = 'Failed to create Luan_photo, with error code: ' + error.message;
                        console.log(err_mesg);
                        res.render('upfail', { err: err_mesg });
                    }
                });


            }, function(error) {
                // The file either could not be read, or could not be saved to AV.
                err_mesg = 'Failed to save AVFile with error code: ' + error.message;
                console.log(err_mesg);

                res.render('upfail', { err: err_mesg });
            });
        });





    });
};

//获取具体示例图片以及对应的素材
exports.oneg = function(req, res, next) {
    console.log('group = ' + req.query.group);
    console.log('url = ' + req.query.url);
    var pic_list = [];
    var query = new AV.Query("Luan_photo_Info");
    query.equalTo("GroupID", parseInt(req.query.group));
    query.find({
        success: function (results) {
            // console.log("Successfully retrieved " + results.length + " photo");
            // Do something with the returned AV.Object values

            if(results.length>0){

            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                //  console.log(object.get("File").thumbnailURL(100, 100), object.get("PhotoID"), object.get("GroupID"));
                pic_list[i] = {"url" : object.get("File").thumbnailURL(100, 100),
                    "groupID" : object.get("GroupID"),
                    "PhotoID": object.get("PhotoID"),
                    "shiftScale": object.get("P1"),
                    "shiftX": object.get("P2"),
                    "shiftY": object.get("P3"),
                    "width": object.get("P4"),
                    "height": object.get("P5"),
                    "picID": object.id


                };

            }

            res.render('onegallp', { title: 'ALL PICS',
                    pic:pic_list,
                    group: req.query.group,
                    groupurl: req.query.url}
            );}
            else{

                var query = new AV.Query("Luan_group_test");
                query.equalTo("GroupID", parseInt(req.query.group));

                query.find({
                    success: function (results) {
                        // console.log("Successfully retrieved " + results.length + " photo");
                        // Do something with the returned AV.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            //  console.log(object.get("File").thumbnailURL(100, 100), object.get("PhotoID"), object.get("GroupID"));
                            pic_list[i] = {"url" : object.get("File").thumbnailURL(100, 100),
                                "groupID" : object.get("GroupID"),
                                "PhotoID": object.get("PhotoID"),
                                "shiftScale": object.get("P1"),
                                "shiftX": object.get("P2"),
                                "shiftY": object.get("P3"),
                                "width": object.get("P4"),
                                "height": object.get("P5"),
                                "picID": object.id


                            };

                        }

                        res.render('onegallp', { title: 'ALL PICS',
                                pic:pic_list,
                                group: req.query.group,
                                groupurl: req.query.url}
                        );
                    },
                    error: function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });



            }
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });

};

exports.rawup = function(req, res) {

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = '/tmp/';
    form.keepExtensions = true;
    var avFile;

    form.parse(req, function(err, fields, files) {
        console.log(fields);
        console.log(files);
        var picName = fields.name;
        var position = fields.position;

        if (err) {
            res.locals.error = err;
            res.render('upfail', { title: picName });
            return;
        }

        var extName = '';
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = 'png or jpg only';
            res.render('error', { title: picName });
            return;
        }

        picName = picName + '.' + extName;
        var newPath = form.uploadDir + picName;

        console.log(newPath);
        console.log(files.fulAvatar.path)
        fs.renameSync(files.fulAvatar.path, newPath);
        fs.readFile(newPath, function(err, data){
            avFile = new AV.File(picName, new Buffer(data));
            avFile.save().then(function() {
                console.log('AVFile fully saved');
                var Luan_photo_raw = AV.Object.extend("Luan_photo_raw");
                var pic = new Luan_photo_raw();
                pic.set("position", position);
                pic.set("image", avFile);

                pic.save(null, {
                    success: function(pic) {
                        // Execute any logic that should take place after the object is saved.
                        console.log('New object created with objectId: ' + pic.id);
                        res.locals.success = 'succeeded!!!';
                        res.render('upwork', { title: 'works!!!',
                            picID: pic.id });
                    },
                    error: function(pic, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a AV.Error with an error code and description.
                        err_mesg = 'Failed to create Luan_photo, with error code: ' + error.message;
                        console.log(err_mesg);
                        res.render('upfail', { err: err_mesg });
                    }
                });


            }, function(error) {
                // The file either could not be read, or could not be saved to AV.
                err_mesg = 'Failed to save AVFile with error code: ' + error.message;
                console.log(err_mesg);

                res.render('upfail', { err: err_mesg });
            });
        });





    });
};

exports.pg = function(req, res, next) {
    //  res.render('pg', { title: 'on development' });
    var nose = new Array();
    var eyes = new Array();
    var mouth = new Array();
    var other = new Array();
    var query = new AV.Query("Luan_photo_raw");
    query.find({
        success: function (results) {

            for (var i = 0; i < results.length; i++) {

                var p = results[i].get("position");
                var url = results[i].get("image").thumbnailURL(100, 100);
                switch (p)
                {

                    case 'nose':
                        nose.push({
                            "url" : url,
                            "position" : p

                        });
                        break;

                    case 'eyes':
                        eyes.push({
                            "url" : url,
                            "position" : p

                        });
                        break;

                    case 'mouth':
                        mouth.push({
                            "url" : url,
                            "position" : p

                        });
                        break;

                    case 'other':
                        other.push({
                            "url" : url,
                            "position" : p

                        });
                        break;

                }
            }

            res.render('pg',{
                title: 'view by class',
                nose: nose,
                eyes: eyes,
                mouth: mouth,
                other: other});
        },
        error: function (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });


};

exports.t2p = function(req, res, next) {
	
	
   // console.log('t2p got '+req.query.testg);
    var query = new AV.Query('Luan_group_test');
      query.equalTo("GroupID", parseInt(req.query.testg));
    //query.equalTo("GroupID", 32423);
        query.find({
            success: function(results) {
                console.log("Successfully retrieved " + results.length + " photo");
               //move test to luan_photo_info                
                async.each(results, function(result, callback) {          

                      var pic = new Luan_photo_Info();
                      
                      pic.set("P1", parseFloat(result.get('P1')));
                      pic.set("P2", parseFloat(result.get('P2')));
                      pic.set("P3", parseFloat(result.get('P3')));
                      pic.set("P4", parseFloat(result.get('P4')));
                      pic.set("P5", parseFloat(result.get('P5')));

                      pic.set("type", result.get('type'));
                      pic.set("GroupID", parseInt(result.get('GroupID')));
                      pic.set("PhotoID", parseInt(result.get('PhotoID')));
                      pic.set("File", result.get('File'));

                   
                      pic.save(null, {
                          success: function(pic) {
                              // delete the pic since it was removed to luan_photo_info
                              console.log('pic moved to luan_photo_info');
                              callback(null, pic);

                          },
                          error: function(pic, error) {
                              // Execute any logic that should take place if the save fails.
                              // error is a AV.Error with an error code and description.
                              err_mesg = 'Failed to create Luan_photo, with error code: ' + error.message;
                              console.log(err_mesg);
                              res.render('upfail', { err: err_mesg });
                          }
                      });          	
                	
                }, function(err) {
                    	//delete related test pic
                    	async.each(results, function(result, callback) {
                    		
                    		result.destroy({
                    			  success: function(result) {
                    			    // 对象的实例已经被删除了.
                    				  callback(null, result);
                    				  
                    			  },
                    			  error: function(result, error) {
                    			    console.log(error);
                    			    callback(1,null);
                    			  }
                    			});
                    		
                    		
                    		
                    		
                    	}, function(err){
                    		//link group to hot if required
                            if(req.query.rrate){


                                var hotp = new Luan_hot_photo();
                                console.log('write data to hot photo');
                                console.log(req.query);
                                hotp.set("groupID", parseInt(req.query.testg));
                                hotp.set("randomRate", parseInt(req.query.rrate));
                                hotp.set("priority", parseInt(req.query.pri));
                                hotp.set("expirationTime", parseInt(req.query.expdate));
                                hotp.save(null, {
                                    success: function(pic) {
                                        // delete the pic since it was removed to luan_photo_info

                                        res.render('upwork', { title: 'upload from test to hot pic!!!',
                                            picID: req.query.testg });

                                    },
                                    error: function(pic, error) {
                                        // Execute any logic that should take place if the save fails.
                                        // error is a AV.Error with an error code and description.
                                        err_mesg = 'Failed to create Luan_photo, with error code: ' + error.message;
                                        console.log(err_mesg);
                                        res.render('upfail', { err: err_mesg });
                                    }
                                });

                            }else{

                    		//all test pic deleted, process done
                    		res.render('upwork', { title: 'upload from test to luan_photo_info!!!',
                                    picID: req.query.testg });
                            }
                    			 
                    			})
                    	
                    
                });
                
                   
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });


};
