// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require the use of mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotes');
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
// setup bcrypt
const bcrypt = require('bcrypt-as-promised');
// Create MOngoose schemas
var UserSchema = new mongoose.Schema({
    email: String,
    fname: String,
    lname: String,
    hash: String,
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
    console.log("POST DATA", req.body);
    // first hash password
    bcrypt.hash(req.body.password, 10)
    .then(hashed_password => {
         
    })
    .catch(error => {
         
    });
    // Create a a new Quote with the name and age
    var user = new User({fname: req.body.fname,lname: req.body.lname, email: req.body.email, hash:req.body.password, bday: req.body.bday});
    // Try and save that user to the database(this method that actually insets intot the DB)
    user.save(function(err){
        if(err){
            console.log("Something went Wrong");
        } else{
            console.log("successfully Created User");
            res.redirect('/success');
        }
    });
});
app.post('/login', (req, res) => {
    console.log(" req.body: ", req.body);
    User.findOne({email:req.body.email, password: req.body.password}, (err, user) => {
        if (err) {
            // Code...
        }
        else {
            // Code...
    	req.session.id = User._id;
        req.session.email = User.email;
        res.redirect('/success');
        }
    })
})
app.get('/success',function(req,res){
    res.render('success');
} );
// Set server to listen on Port 8000
app.listen(8000, function(){
    console.log("listening on port 8000")
});