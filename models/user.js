//var mongodb = require('./db');
var crypto = require('crypto');
var mongodb = require('mongodb').MongoClient;

var url = 'mongodb://brotec:350602@101.200.174.136:27017/aluan';


function User(user) {
	this.name = user.name;
	this.password = user.password;
}

User.prototype.save = function(db, callback) {
// 存入 Mongodb 的文档
var user = {
		name: this.name,
		password: this.password
};


db.collection('userinfo').insertOne(user, function(err, user) {

	callback(err, user);

	});
};

User.get = function(username, db, callback) {
//set flag since the result following null document
    var flag=0;
    var cursor = db.collection('userinfo').find({"name":username});

    cursor.each(function(err, doc) {

        if(err){


            callback(err, null);
        }

        else if (doc!= null) {
            // 封装文档为 User 对象

            var user = new User(doc);
            flag = 1;
            callback(null, user);

        } else {

            callback(null, null, flag);
            flag = 0;

        }
    });
};



//后台用户登录
User.login = function(req, res) {
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password);
    var password = password.digest('base64');

    mongodb.connect(url, function(err, db) {

    User.get(req.body.username, db, function(err, user, flag) {

        if(flag == 1){
            db.close();
            return;
        }
        if (!user) {
            db.close();
            console.log('user not exist');
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }
        if (user.password != password) {
            db.close();
            req.flash('error', '用户口令错误');
            console.log('用户口令错误');
           return res.redirect('/login');
        }
        db.close();
        req.session.user = user;
        req.flash('success', '登入成功');
        return res.redirect('/');
    });
    });
};

//后台用户注册 restricted func
User.reg = function(req, res, next) {
    //检验用户两次输入的口令是否一致

    if (req.body['password-repeat'] != req.body['password']) {

        console.log('not the same');
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/reg');
    }

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body['password']);
    var password = password.digest('base64');

    var newUser = new User({
        name: req.body.username,
        password: password
    });


    //检查用户名是否已经存在

    mongodb.connect(url, function(err, db) {

        User.get(newUser.name, db, function (err, user) {

            //console.log(user);

            if (user) {
                err = 'Username already exists.';
                console.log(err);
                req.flash('error', err);
                res.redirect('/reg');
            }
            if (err) {
                console.log(err);
                req.flash('error', err);
                res.redirect('/reg');
            }
            else{
            //如果不存在则新增用户
                console.log('create the new user');

                newUser.save(db, function (err) {
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/reg');
                    }
                    req.session.user = newUser;
                    console.log('zhucechengg');
                    req.flash('success', '注册成功');
                    res.redirect('/');
                });

            }//else
        })
    })

};

module.exports = User;
//s = new User(
//    { name : 'fufufufuttt',
//    password :'password'
//}
//
//);

//mongodb.connect(url, function(err, db) {
//    s.save(db, function (err) {
//        if (err) {
//            console.log('fail to save');
//            console.log(err);
//        }
//        else {
//            console.log('succeeded!');
//            db.close();
//
//        }
//    });
//}



//mongodb.connect(url, function(err, db) {
//
//    User.get('brotec',db, function(){
//
//        db.close();
//
//    });
//
//
//});



