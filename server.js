let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
let cors = require('cors');
let jwt = require('jsonwebtoken');

let app = express();

// middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

//MongoDB setup


mongoose.connect('mongodb://127.0.0.1/typings');

const User = mongoose.model('users', { name: String , email: String, password: String});






//hash for the passwords brcypt 3.0.4

const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';




//get requests
app.get('/', function(req,res){
    res.send('This is form the server');

});

//post requests 



app.post('/register', (req,res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.

        let user = new User({
            name: name,
            email:email,
            password: hash
    }).save((err,data) => {
        if(err){
            console.log(err)

        }

        console.log(data)
        res.send({data:data})
    })//.then(() => console.log(`This is the suer model ${user.name}`));

      });
    
    
    
  
    
        
    
   
});







//server running on port 4000

app.listen(4000, () => console.log('server is listening on port 4000'))



