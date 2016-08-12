var fs = require('fs');
var AV = require('avoscloud-sdk').AV;
AV.initialize("la83xay208v19srmcjmah9pk6e30ygyhcv2qj9yhhgee454b", "vx993snij5vl4k4lc70kaxoxhuaabtw19trx4ckwzuuolgt0");

function get_pic_url() {


    var query = new AV.Query("Luan_photo_Info");
    var url_list = [];
    query.ascending("GroupID");
    query.find({
        success: function (results) {
            console.log("Successfully retrieved " + results.length + "photo");
            // Do something with the returned AV.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log(object.get("File").thumbnailURL(100, 100));
                url_list[i] = object.get("File").thumbnailURL(100, 100);

            }

            return url_list;
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}