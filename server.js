const express = require('express');
const app = express();
const path =require('path');
// const multer  = require('multer')
// const upload = multer()

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)     //overwrite dot method
//var cookieParser = require('cookie-parser')



// app.use(bodyParser.json());
//For protecting sensitive information
const dotenv = require('dotenv');
dotenv.config({path: './.env'}); 

//Connecting to mysql (make a database named Travewire)
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE,
    database: 'TutorWebApp'
});
db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log('Connected to mysql...');
    }
});

//connection of session with database
var sessionStore = new MySQLStore({
    expiration:10800000,
    createDatabaseTable: false,
    schema:{
        tableName: 'sessiontbl',
        columnNames:{
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
},db);

//for keeping the files of css 
app.use(express.static("public"));
// app.use(cors())


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));  //get data from forms and make it available in post method ko request ma
app.use(express.json())   //form bata ako data lai json ma parse garxa
app.use(
    session({
        key: 'keyin',
        secret: "this is key that sign cookie",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    })
);

// middleware to pass variable to all templates
app.use(function(req, res, next){
    // console.log(req.session.userinfo);
    res.locals.isLoggedIn = req.session.userinfo;
    next()
})

//define all routes

app.use('/', require('./routes/pages'))     
app.use('/auth', require('./routes/auth'))  //'/auth' paxi aako url yeta janxa



const port = process.env.PORT || 8000;
app.listen(port, ()=>{console.log(`listening on port ${port}`)});


/*
home
about
detail id:
user profile
login
register
apply as guide
search
accomodationDetail
*/

/*
NAVBAR
home
about
sites
contact us 
*/