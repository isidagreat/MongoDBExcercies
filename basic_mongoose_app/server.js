// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require the use of mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
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
// Create MOngoose schemas
var UserSchema = new mongoose.Schema({
    name: String,
    age: Number
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
// Add User Request
app.post('/users', function(req,res){
    console.log("POST DATA", req.body);
    // Create a a new User with the name and age
    var user = new User({name: req.body.name, age: req.body.age});
    // Try and save that user to the database(this method that actually insets intot the DB)
    user.save(function(err){
        if(err){
            console.log("Something went Wrong");
        } else{
            console.log("successfully added user!");
            res.redirect('/');
        }
    });
});
// Set server to listen on Port 8000
app.listen(8000, function(){
    console.log("listening on port 8000")
});