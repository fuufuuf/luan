var request = require('request');
var AV = require('avoscloud-sdk').AV;
AV.initialize("la83xay208v19srmcjmah9pk6e30ygyhcv2qj9yhhgee454b", "vx993snij5vl4k4lc70kaxoxhuaabtw19trx4ckwzuuolgt0");

function push_opt(push_data){
   // this.push_data = push_data;

    this.headers={
        'X-AVOSCloud-Application-Id': 'la83xay208v19srmcjmah9pk6e30ygyhcv2qj9yhhgee454b',
        'X-AVOSCloud-Application-Key': 'vx993snij5vl4k4lc70kaxoxhuaabtw19trx4ckwzuuolgt0',
        'Content-Type': 'application/json'};
    this.url='https://leancloud.cn/1.1/push';
    this.body={

        data:{
        'alert': push_data,
        "badge": "Increment"

    },
       // where: {deviceToken: '2d32ed273fdc5bbaf80bd1ee82a4b9b502152ae810b736de0c256483ecb4b970'},

        prod: 'dev'
    };

    this.json=true

}


exports.push = function(req, res) {
    var push_body = req.body.push_content;
    var p = new push_opt(push_body);


    callback = function(error, response, body) {

        var objID = body.objectId;
        var query = new AV.Query('_Notification');
        query.equalTo("objectId", objID);
        query.find({
            success: function(results) {

                console.log(results[0].createdAt);
                res.render('pushwork',  { objID: results[0].get('status'),
                    push_date:results[0].createdAt});
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });



        //console.log('body ', body);

    };

    push_req = request.post(p, callback);




};

exports.push_status =function(req, res) {
    var query = new AV.Query('_Notification');

    var all_push = new Array();
    query.limit(100);
    query.descending("createdAt");
    query.find({
        success: function(results) {
            console.log("Successfully retrieved " + results.length + " pushes");
            // 处理返回的结果数据
            for (var i = 0; i < results.length; i++) {
                var p ={};

                p.c1 = results[i].id;

                p.c2 = results[i].get('status');
                p.c3 = results[i].createdAt;
                p.c4 = results[i].get('data')['alert'];

                all_push.push(p);

            }

            res.render('push_status', {pp: all_push});
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
};

//var n = new push_opt('99999');

//callback = function(error, response, body) {
//
//    // console.log(body);
//    console.log(response.body);
//};
//
//exports.push_req = request.post(push_opt, callback);

