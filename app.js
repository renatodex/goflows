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
    description : String,
    extra_flags : [Schema.Types.Mixed] 
});

var FlowScheme = new Schema({
    session_id : {
        type: String, 
        index: {
            unique: true, 
            dropDups: true
        }
    },
    nodes : [NodeScheme]
});  
    
function addNode(user_url, user_ip, description, extra_flags) {
    var param_extra = extra || {};
    var param_user_url = user_url || '';
    var param_user_ip = user_ip || '';
    var param_description = description || '';
        
    return {
        user_ip : param_user_ip,
        user_url : param_user_url,
        description : param_description,
        extra_flags : param_extra
    };
}    
    
var Flow = mongoose.model('Flow', FlowScheme);
var Node = mongoose.model('Node', NodeScheme);    
    

//var mynode = new Node({
//    user_ip : '200.244.21.45',
//    user_url : 'http://magictm.com.br/',
//    description : 'Usuario acessou a home do site'
//});
//
//var myflow = new Flow({
//    session_id : '123333'
//});
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//myflow.nodes.push(mynode);
//
//
//myflow.save(myflow, function() {
//    console.log('Salvando...');
////        Flow.find(function(err, rs) {
////            console.log(rs);
////        });        
//});


var ErrorCode = {
    REQUIRED_FIELDS :  '100',
    SESSION_ALREADY_EXISTS : '101',
    MONGO_DUPLICATED_ENTRY : '11000'
}

var ShellColors = {
    BG : {
        Green : '\033[42;1;37m',
        Red : '\033[41;1;37m',
        Gray : '\033[47;0;33m',
        Brown : '\033[43;1;37m',
        Purple : '\033[45;1;37m'
    },
    FONT: {
        Gray : '\033[1;30m',
        Black : '\033[0;30m'
    },
    
    CLEAR : '\033[0m'
}

console.colorful = function(color, message) {
    console.log([color,message,ShellColors.CLEAR].join(''));
}

console.green = function(message) {
    console.colorful(ShellColors.BG.Green,message);
}

console.error = function(message) {
    console.colorful(ShellColors.BG.Red,message);
}

console.gray = function(message) {
    console.colorful(ShellColors.FONT.Gray,message);
}

console.purple = function(message) {
    console.colorful(ShellColors.BG.Purple,message);
}


console.log(ShellColors.BG.Gray);
console.log('Iniciando...')
console.log('   ___  ____  ______                ');
console.log('  / _ \\/ __ \\/ __/ /  ___ _    _____');
console.log(' / , _/ /_/ / _// /__/ _ \\ |/|/ (_-<');
console.log('/_/|_|\\____/_/ /____/\\___/__,__/___/');
console.log(ShellColors.CLEAR);                                    



function isAnyEmpty(arr) {
    for(var i in arr) {
        if(arr[i] == '') {
            return true;
        }
    }
    return false;
}

var app = express();
app.set( "jsonp callback", true );


ConsoleResponse = {
    header : function(page, req) {
        console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
        console.green(['REQUEST : /', page].join(''));
        console.gray(['Params via GET: ',JSON.stringify(req.query)].join('')); 
        console.gray(['Params via POST: ',JSON.stringify(req.body)].join(''));         
        console.gray(JSON.stringify(req.headers, null, 4));    
    },
    
    success : function(message) {
        console.green(['SUCESSO: ', message].join(''));
    },
    
    error : function(message) {
        console.error(['ERROR: ', message].join(''));
    }
}


app.get('/newkey', function(req, res){  
    ConsoleResponse.header('newkey',req);
    
    res.set('Content-Type', 'text/plain');
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var key = crypto.createHash('sha1').update(current_date + random).digest('hex');
    res.send(key);
    
    ConsoleResponse.success(['New Key Generated -> ',ShellColors.BG.Brown, key, ShellColors.CLEAR].join(''));
});


app.get('/newsession', function(req, res) {
    ConsoleResponse.header('newsession',req);
    
    res.set('Content-Type', 'text/plain');
    var params = req.query;
    var session_id = params['session_id'];
    var user_ip = params['user_ip'];
    var user_url = params['user_url'];
    var description = params['description'];
    
    try {
        if(isAnyEmpty([session_id, user_ip, user_url, description])) {
            throw ErrorCode.REQUIRED_FIELDS;
        }
        
        var mynode = new Node({
            user_ip : user_ip,
            user_url : user_url,
            description : description
        });

        var myflow = new Flow({
            session_id : session_id
        });
        myflow.nodes.push(mynode);
        
   
        myflow.save(function(err) {
            if(err.code == ErrorCode.MONGO_DUPLICATED_ENTRY) {
                console.error(err);
                ConsoleResponse.error('Session already exists.');
                throw ErrorCode.SESSION_ALREADY_EXISTS;
            } else {
                ConsoleResponse.success(['Created flow session...'].join(''));
                console.purple(myflow);       
                res.send('OK');                
            }
        });        
    } catch (err) {
        ConsoleResponse.error(['RESPONSE=', err].join(''));
        res.send(err);
    }
});



app.listen(6001);

console.log("Server running...");

