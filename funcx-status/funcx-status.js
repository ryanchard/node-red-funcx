var http = require('http');
var https = require('https');
var querystring = require('querystring');

module.exports = function(RED) {
    function FuncXStatusFunction(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            try {
                msg.payload = JSON.parse(msg.payload)
            } catch(err) { // TODO make this more robust
                msg.payload = 'Invalid Input';
                return msg;
            }
            console.log('starting status!')
            var payload = msg.payload['data']
            var post_data = querystring.stringify(msg.payload['data']);
            console.log(msg.payload)
            console.log(payload)
            var task_id = '9ad29ce6-17ab-430a-9c21-c6e8a4d4ca9c'
            task_id = JSON.parse(msg.payload['task_id'])
            console.log(task_id)
            task_id = task_id['task_id']
            var post_options = {
              host: 'funcx.org',
              path: '/api/v1/' + task_id + '/status',
              method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + msg.payload['globus_token'],
     //           'Content-Length': Buffer.byteLength(post_data)
              }
            };
            console.log(post_options)

            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                  msg.payload =chunk;
                  console.log('got chunk response')
                  console.log(chunk);
                  node.send(msg)
                });
            });
            // post the data
            console.log('sending data')
            post_req.write(post_data);
            post_req.end();
            console.log('done')
        });
    }
    RED.nodes.registerType("funcx-status",FuncXStatusFunction);
}
