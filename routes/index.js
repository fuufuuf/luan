var express = require('express');
var router = express.Router();

var request = require('request');
var io = require('socket.io-client');
var User = require('../models/user');
var pic = require('../models/pic');
var ios_push = require('../models/push');

var AV = require('avoscloud-sdk').AV;
AV.initialize("la83xay208v19srmcjmah9pk6e30ygyhcv2qj9yhhgee454b", "vx993snij5vl4k4lc70kaxoxhuaabtw19trx4ckwzuuolgt0");

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });


});
router.post('/reg', User.reg);

router.get('/reg', function(req, res, next) {
	res.render('reg');


});

router.get('/login', checkNotLogin);
router.get('/login', function(req, res) {
	res.render('login', {
	title: '用户登入'
	});
});

router.post('/login', checkNotLogin);
router.post('/login', User.login);

router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {
	req.session.user = null;
	req.flash('success', '登出成功');
	res.redirect('/');

});


router.get('/oneg', checkLogin);
router.get('/oneg', pic.oneg);
router.get('/allp', checkLogin);
router.get('/allp', pic.allp);

router.get('/ios', function(req, res, next){

    var socket_test = io.connect('http://localhost:3000');
    socket_test.emit('showtest','ttt');


});

router.get('/testview', checkLogin);
router.get('/testview', function(req, res, next) {
    console.log('testview got '+req.query.testg);
    var testg = req.query.testg;
    var socket = io.connect('http://localhost:3000');
    socket.emit('message',testg);
    socket.on('showtest', function(msg){

        console.log('ios upload is done');
        var query = new AV.Query('Luan_group_sample');
        query.equalTo("GroupID", parseInt(testg));
        query.find({
            success: function(results) {
                console.log("Successfully retrieved " + results.length + " photo");
                // 处理返回的结果数据
                for (var i = 0; i < results.length; i++) {

                    var url = (results[i].get('pic')).url();
                }

                var url = '/oneg?group='+testg+'&url='+url;
                console.log(url)
                res.redirect(url);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });


    })

});



router.get('/allg', checkLogin);
router.get('/allg', pic.allg);




router.get('/list', pic.list);

router.post('/modify', checkLogin);
router.post('/modify', pic.modify);

router.get('/upload', checkLogin);
router.get('/upload', function(req, res) {
    res.render('upload', {
        title: 'List'});
});

router.get('/gupload', checkLogin);
router.get('/gupload', function(req, res) {
    res.render('sample_upload', {
        title: 'sample upload'});
});
router.post('/gupload', pic.gupload);

router.get('/preview', function(req, res) {
    res.render('preview', {
        title: 'List'});
});


router.post('/upload', checkLogin);
router.post('/upload', pic.upload);

router.get('/rawupload',function(req, res) {
    res.render('rawupload', {
        title: '原图上传'});
});

router.post('/rawupload', pic.rawup);

router.get('/pg', checkLogin);
router.get('/pg', pic.pg);

router.get('/push', checkLogin);
router.get('/push', function(req, res) {
    res.render('push', {
        title: 'push a message'});
});

router.post('/push', ios_push.push);

router.get('/push_status', checkLogin);
router.get('/push_status', ios_push.push_status);

router.get('/t2p', function(req, res, next){
	
	if(req.query.testg){
		
		next();
	}else{
				
		res.render('grpp', {val:Math.round(Math.random()*100)});
		
	}
	
	
});

router.get('/t2p', pic.t2p);

function checkLogin(req, res, next) {
	if (!req.session.user) {
	req.flash('error', '未登入');
	return res.redirect('/login');
	}
	next();
	}
	function checkNotLogin(req, res, next) {
	if (req.session.user) {
	req.flash('error', '已登入');
	return res.redirect('/');
	}
	next();
	}

module.exports = router;
