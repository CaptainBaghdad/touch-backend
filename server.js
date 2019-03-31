let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
let cors = require('cors');
//let mon = require('nodemon');
let jwt = require('jsonwebtoken');
let multer = require('multer');
let secretToken = 'yba(youbeetaask)';
let upload = multer({dest: '/public'});

let app = express();

// middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

//MongoDB setup


mongoose.connect('mongodb://127.0.0.1/typings');

const User = mongoose.model('users', { name: String , email: String, password: String});


const UserScore = mongoose.model('user_scores', {name: String, letterU: Number, letterR:Number, letterI: Number, letterE: Number })


//const ProfilePicture = mongoose.model('');




//hash for the passwords brcypt 3.0.4

const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';




//get requests
app.get('/', function(req,res){
    res.send('This is form the server');

});

app.get('/letteru', function(req,res){
 if(!req.headers.token){
     res.send({data: false})
 }    

});

app.get('/dashboard', (req,res) => {
    let avg = 0;
    let arr = [];
    let bool = true;
    if(req.headers.token){
        
        var decoded = jwt.verify(req.headers.token, secretToken);
        console.log(`this is the Name localStorage ${req.headers.name} and this is the decoded jwt ${decoded.name}`)
        UserScore.findOne({name: decoded.name}, function(err, found){
            
            //console.log(`the FOUND OBJ : ${Object.values(found.toObject())}`);
            
            
            if(err){
                console.log(err);

            }


            if(!found){
               bool = false;
               console.log(`This is why you're not getting a response`)

            }
            
            

           
           
           
           //arr.push(found.letterE,found.letterI,found.letterR,found.letterU);
           //let numOfLetters = arr.toString().replace(/\D/g,"").split().length;
           //arr = arr.toString().replace(/,/g, "").split(",");
           //console.log(`numofLetters var : ${numOfLetters} and the type of ${typeof(numOfLetters)}`);
           else{
           let obj = found.toObject();
           
            for(let i in obj){
                if(typeof(obj[i]) == 'number' && obj[i] > 0 ){
                    console.log(`this is the I value ${typeof(obj[i])}`);
                    arr.push(obj[i]);

                }
               
            }

        }
           
           
           console.log(`this is the array value ${arr}`);
           if(arr.length == 1){
               //numOfLetters = arr.
               avg = arr[0];
              // res.send({data:found, avg: avg})
               
               

           }

          
           else{
           // console.log(`this is the array : ${arr}`);
            let ans = arr.reduce((prev,curr) => prev + curr, 0);
            //console.log(`this is the ans value ${ans}`);
           // console.log(`numofLetters var : ${numOfLetters}`);
            avg  = ans / arr.length;

            //console.log(`this is the average ${avg}`);
           // console.log(`This is the found name : ${found.toObject().name}`);
            res.send({data: found, avg: avg, bool:bool})

           }
           
            

        });
        //User.findOne({email: req.headers.token.})
        
        //res.send({data:  })
    }

    
    
})

//post requests 


app.post('/profile', upload.single('file'), function(req,res){
console.log(`this is the file upload keys ${req.body.data}`)


});



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

        console.log(`Success from the server ${data}`)
        res.send({data:data})
    })

      });
    
    });


app.post('/login', (req,res) => {
    User.findOne({email: req.body.email}, (err, person) => {
        if(err){ console.log(err)}
        bcrypt.compare(req.body.password, person.password , function(err, data){
           if(err){ console.log(err)}
           
               
            var token = jwt.sign({user: person.email, name: person.name}, secretToken);
            res.send({data: person, token:token})
            console.log(`DATA  ${person.name}`)
           


        })

    })
   
    

});

app.post('/uresults', (req,res) =>{
    console.log(`this is the req body score : ${req.body.score}`);
    var decoded = jwt.verify(req.body.token, secretToken);
    console.log(`this is the decoded ${decoded.name}`);

    UserScore.findOneAndUpdate({name: decoded.name}, {$set:{letterU: req.body.score}}, function(err, found){
        if(err){
            console.log(`This is the error form the uresults UserScore findOne ${err}`);

        }

        if(!found){
            new UserScore({
                name: decoded.name,
                letterU: req.body.score

            }).save((err, newUserScore) => {
                if(err){
                    console.log(`this is the error from the new UserScore Model for the letterU ${err}`);

                }
                console.log(`this is the response from the letterU  SAVE ${newUserScore}`);
            })

        }
        //console.log(`Found UserScore Model : ${found.name}`)
        

    })



})

app.post('/rresults', (req,res) => {
    console.log(`this is the req body score : ${req.body.score}`);
    var decoded = jwt.verify(req.body.token, secretToken);
    console.log(`this is the decoded ${decoded.name}`);

    UserScore.findOneAndUpdate({name: decoded.name}, {$set:{letterR: req.body.score}}, function(err, found){
        if(err){
            console.log(`This is the error form the rresults UserScore findOne ${err}`);

        }

        if(!found){
            new UserScore({
                name: decoded.name,
                letterR: req.body.score

            })
            .save((err, newUserScore)=>{
                if(err){
                    console.log(`This is the err from the letterR ${err}`);
                }

                console.log(`This is the save from the findOneAndUpdate ${newUserScore} `);

            })
        }
        console.log(`Found UserScore Model : ${found.name}`)
        

    })
    /*new UserScore({
        name: decoded.name,
        letterR: req.body.score

    }).save((err,newUserScoreModel) => {
        if(err) {console.log(err)}
        console.log(`This is the user score model ${newUserScoreModel}`);
        res.send()
    })*/
    
   // console.log(`this is the response from the server for the letter R ${req.body.score}`);
   
})



app.post('/eresults', (req,res) => {
    console.log(`this is the req body score : ${req.body.score}`);
    var decoded = jwt.verify(req.body.token, secretToken);
    console.log(`this is the decoded ${decoded.name}`);

    UserScore.findOneAndUpdate({name: decoded.name}, {$set:{letterE: req.body.score}}, function(err, found){
        if(err){
            console.log(`This is the error form the rresults UserScore findOne ${err}`);

        }

        if(!found){
            new UserScore({
                name: decoded.name,
                letterE: req.body.score

            })
            .save((err, newUserScore)=>{
                if(err){
                    console.log(`This is the err from the letterE ${err}`);
                }

                console.log(`This is the save from the findOneAndUpdate ${newUserScore} `);

            })
        }
        console.log(`Found UserScore Model : ${found.name}`)
        

    })
    
   
})



app.post('/iresults', (req,res) => {
    console.log(`this is the req body score : ${req.body.score}`);
    var decoded = jwt.verify(req.body.token, secretToken);
    console.log(`this is the decoded ${decoded.name}`);

    UserScore.findOneAndUpdate({name: decoded.name}, {$set:{letterI: req.body.score}}, function(err, found){
        if(err){
            console.log(`This is the error form the iresults UserScore findOne ${err}`);

        }

        if(!found){
            new UserScore({
                name: decoded.name,
                letterI: req.body.score

            })
            .save((err, newUserScore)=>{
                if(err){
                    console.log(`This is the err from the letterE ${err}`);
                }

                console.log(`This is the save from the findOneAndUpdate ${newUserScore} `);

            })
        }
        console.log(`Found UserScore Model : ${found.name}`)
        

    })
    
   
})


//server running on port 4000

app.listen(4000, () => console.log('server is listening on port 4000'))



