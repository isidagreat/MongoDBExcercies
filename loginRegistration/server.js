// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require the use of mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');
// Require body-parser(to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our app
app.use(bodyParser.urlencoded({extended:true}));
// require path
var path = require('path');
// Setting static Folder Directory
app.use(express.static(path.join(__dirname, '.static')));
// Setting our Views folder directory
app.set('views', path.join(__dirname, './views'));
// Setting up View Engine to EJS
app.set('view engine', 'ejs');
// set up Express session to track user login
const session = require('express-session');
app.set('trust proxy', 1) //trust first proxy
app.use(session({
    secret:'ultimatesmash',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:60000}
}));
const flash = require('express-flash');
app.use(flash());
// setup bcrypt
const bcrypt = require('bcrypt-as-promised');
// Create MOngoose schemas
var UserSchema = new mongoose.Schema({
    email: {type:String, min:7, required:true},
    fname: {type: String,min:3, required: true},
    lname: {type: String,min:3, required: true},
    hash: {type: String,min:8, required: true},
    bday: Date
});
mongoose.model('User', UserSchema); // We are setting this Shema in our models as USER
var User = mongoose.model('User'); // We are retrieving this Schema from our Models, named User
mongoose.Promise = global.Promise;


// Routes
// Root Request
app.get('/', function(req, res){
    // this is where we'll retrieve users from the database
    res.render('index');
});
// Add Quote Request
app.post('/register', function(req,res){
    var count = 0;
    User.count({email:req.body.email}, (err, user) => {
        if (err || user === 0) {
           
            bcrypt.hash(req.body.password, 10)
            .then(hashed_password => {
            // Create a a new Quote with the name and age
            var user = new User({fname: req.body.fname,lname: req.body.lname, email: req.body.email, hash:hashed_password, bday: req.body.bday});
            // Try and save that user to the database(this method that actually insets intot the DB)
            user.save(function(err){
                if(err){
                    console.log("Something went Wrong",err);
                    for(var key in err.errors){
                        req.flash('registration', err.errors[key].message);
                    }
                    // redirect the user to an appropriate route
                    res.redirect('/');
                } else{
                    console.log("successfully Created User");
                    res.redirect('/success');
                }
            }); 
            })
            .catch(error => {
                pass(error)
        
            });



        }else{
            console.log("TOOO MANY")
            res.redirect('/')
        }
        

}) 

    



});
app.post('/login', (req, res) => {
    User.findOne({email:req.body.email}, (err, user) => {
        if (err) {
            // Code...
            console.log("Something Went Wrong locattin user")
            res.redirect('/')
        }else{
        bcrypt.compare(req.body.password, user.hash)
        .then( result => {
            console.log(result)
            req.session.id = user._id;
            req.session.email = user.email;
            res.redirect('/success');
        })
        .catch( error => {
            console.log("OHHHHHH OHHHH BAD STUFF HAPPEND"+error);
            res.redirect('/')

})
}
        // else {
        //     // Code...
    	// req.session.id = user._id;
        // req.session.email = user.email;
        // res.redirect('/success');
        // }
    })
})
app.get('/success',function(req,res){
    if (!req.session.id){
        res.redirect('/');
    }
    else{
        console.log(req.session.id)
    res.render('success');
    }
} );
// Set server to listen on Port 8000
app.listen(8001, function(){
    console.log("listening on port 8000")
});