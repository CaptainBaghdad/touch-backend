let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');
let app = express();

// middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//get requests
app.get('/', function(req,res){
    res.send('This is form the server');

})



//server running on port 4000

app.listen(4000, () => console.log('server is listening on port 4000'))

