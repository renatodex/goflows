var express = require('express');
var crypto = require('crypto');


// getting-started.js
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/goflows');

var Schema = mongoose.Schema;

var NodeScheme = new Schema({
    user_url : String,
    user_ip : String,
    created_at : {
        type : Date, 
        'default' : Date.now
    },
    extra : [Schema.Types.Mixed] 
});

var FlowScheme = new Schema({
    session_id : String,
    nodes : [NodeScheme]
});
    
    
function addNode(user_url, user_ip, extra) {
    var param_extra = extra || {};
    var param_user_url = user_url || '';
    var param_user_ip = user_ip || '';
        
    return {
        user_ip : param_user_ip,
        user_url : param_user_url,
        extra : param_extra
    };
}    
    
var Flow = mongoose.model('Flow', FlowScheme);
var Node = mongoose.model('Node', NodeScheme);    
    

var mynode = new Node({
   user_ip : '200.244.21.45',
   user_url : 'http://magictm.com.br/'
});

var myflow = new Flow({
    session_id : '123333'
});
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);
myflow.nodes.push(mynode);


myflow.save(myflow, function() {
    console.log('Salvando...');
//        Flow.find(function(err, rs) {
//            console.log(rs);
//        });        
});
    
    
    


var app = express();
app.set( "jsonp callback", true );


app.get('/newkey', function(req, res){    
    res.set('Content-Type', 'text/plain');
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var key = crypto.createHash('sha1').update(current_date + random).digest('hex');
    res.send(key);
});



app.get('/save', function(req, res) {
    
    });



app.listen(6001);

console.log("Server running...");

