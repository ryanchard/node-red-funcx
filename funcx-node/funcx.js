var http = require('http');
var https = require('https');
var querystring = require('querystring');

module.exports = function(RED) {
    function FuncXFunction(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            try {
                msg.payload = JSON.parse(msg.payload)
            } catch(err) {
                msg.payload = 'Invalid Input';
                return msg;
            }
            var payload = msg.payload['data']
            var post_data = JSON.stringify({'data': msg.payload['data'], 'func': config.function, 'endpoint': config.endpoint});
            console.log(config.function)
            console.log(config.endpoint)
            console.log(post_data)

            var post_options = {
              host: 'funcx.org',
              path: '/api/v1/execute',
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(post_data),
                'Authorization': 'Bearer ' + msg.payload['globus_token']
     //           'Content-Length': Buffer.byteLength(post_data)
              }
            };
            console.log(post_options)

            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                  msg.payload['task_id'] = chunk;
                  msg.payload = JSON.stringify(msg.payload)
                  console.log(chunk);
                  node.send(msg)
                });
            });

            console.log('sending data')
            post_req.write(post_data);
            post_req.end();
            console.log('done')

        });
    }
    RED.nodes.registerType("funcx",FuncXFunction);
}
