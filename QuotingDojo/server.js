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
// Create MOngoose schemas
var UserSchema = new mongoose.Schema({
    name: String,
    quote: String,
    created: Date
});
mongoose.model('Quote', UserSchema); // We are setting this Shema in our models as USER
var Quote = mongoose.model('Quote'); // We are retrieving this Schema from our Models, named Quote
mongoose.Promise = global.Promise;


// Routes
// Root Request
app.get('/', function(req, res){
    // this is where we'll retrieve users from the database
    res.render('index');
});
// Add Quote Request
app.post('/quotes', function(req,res){
    console.log("POST DATA", req.body);
    // Create a a new Quote with the name and age
    var user = new Quote({name: req.body.name, quote: req.body.quote, created: new Date()});
    // Try and save that user to the database(this method that actually insets intot the DB)
    user.save(function(err){
        if(err){
            console.log("Something went Wrong");
        } else{
            console.log("successfully Created Quote");
            res.redirect('/quotes');
        }
    });
});
app.get('/quotes', function(req, res){
    Quote.find({}, function(err, Quotes) {
        data = Quotes
        // Retrieve an array of users
        // This code will run when the DB is done attempting to retrieve all matching records to {}
        res.render('quotes',{msg:Quotes})
       })
    
});
// Set server to listen on Port 8000
app.listen(8000, function(){
    console.log("listening on port 8000")
});