let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
let cors = require('cors');
let jwt = require('jsonwebtoken');
let multer = require('multer');
let secretToken = 'yba(youbeetaask)';

let app = express();

// middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

//MongoDB setup


mongoose.connect('mongodb://127.0.0.1/typings');

const User = mongoose.model('users', { name: String , email: String, password: String});


const UserScore = mongoose.model('user_scores', {name: String, letterU: Array, letterR: Array, letterI: Array, letterE: Array })



//hash for the passwords brcypt 3.0.4

const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';




//get requests
app.get('/', function(req,res){
    res.send('This is form the server');

});

app.get('/dashboard', (req,res) => {
    if(req.headers.token){
        console.log(`this is the DASHBOARD TOKEN ${req.headers.token}`)
        //User.findOne({email: req.headers.token.})
        
        res.send({data: req.headers.token })
    }

    res.send({msg: 'You dont have access to this page'})
    
})

//post requests 



app.post('/register', (req,res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.

        /*const FULLUser = new User({
            name: String,
            email:String,
            password: String,
            profileURL: String,
            test: String,
            scores: Array,
            average: Number,
            level: String,
            RankId: Number

        })*/
            
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
    })

      });
    
    });


app.post('/login', (req,res) => {
    User.findOne({email: req.body.email}, (err, person) => {
        if(err){ res.send({msg: 'Are you sure you have an account ?'})}
        bcrypt.compare(req.body.password,person.password , function(err, data){
           if(err){ console.log(err)}
           if(data){
               
            var token = jwt.sign({user: person.email}, secretToken);
            res.send({data: person, token:token})
            console.log(`DATA TOKEN ${token}`)
           }


        })

    })
   
    

});

app.post('/eresults', (req,res) =>{
    var decoded = jwt.verify(req.body.token, secretToken);
    console.log(req.body.score);
     User.findOne({email: decoded.user}, function(err, data){
        if(err){
            console.log(err);

        }

         new UserScore({
            name: data.name,
            letterE: req.body.score
        })
        .save((err, ans) => {
            if(err){
                console.log(err);

            }
           console.log(`return from the save ${ans}`);
            res.send({data: ans})



        })

        //console.log(letter_e_obj.letterE.length);
        
       


    //
    //console.log(`return from the user var ${user.scores.length}`)

   
 


})//user var

})


//server running on port 4000

app.listen(4000, () => console.log('server is listening on port 4000'))


