/**
 * Express Initializiert 
 * Web Framework für node.js
 */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 3000;

/**
 * Body Parser wird initializieren
 */
const bodyParser = require('body-parser');
//const { Console } = require('console');
app.use(bodyParser.urlencoded({extended:true}));

const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
})) 

/**
 * ejs wird initializieren
 */
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

liste = [ 
    {vorname: "Alice", nachname: "Schulz" , datum: new Date()}, 
    {vorname: "Bob", nachname: "Harvey", datum: new Date()}, 
    {vorname: "Carla", nachname: "Carter", datum: new Date()} 
];

/**
 * Start Website
 */
app.get('/',(req,res)=>{
    res.render('index');
});

/**
 * Start Website
 */
app.get('index',(req,res)=>{
    res.render('index');
});


/**
 * Hier wird die Checkinseite angezeigt
 * Wenn man bereits eingecheckt ist wird das dem nutzer mitgeteilt
 */
app.get('/checkin',(req,res)=>{
    if(req.session['vorname'] == null){
        res.render(__dirname+ '/views/checkin.ejs');
    }else{
        res.render(__dirname+ '/views/alreadycheckedin.ejs');
    }
});

/**
 * Beim einchecken wird geprüft ob man bereit eingecheckt ist
 * Wenn nein werden neue session variablen gesetzt, in eine Liste geschrieben und weiter an die checkinlist übergeben
 * Wenn ja wird der Nutzer drauf hingewiesen das er bereits eingecheckt ist
 */
app.post('/checkin',(req,res)=>{
    if(req.session['vorname'] == null){
        req.session['vorname'] = req.body["vorname"];
        req.session['nachname'] = req.body["nachname"];
        req.session['datum'] = new Date();

        liste = liste.concat({vorname: req.session['vorname'], nachname: req.session['nachname'], datum: req.session['datum']});

        res.render('checkinlist',{liste: liste});
    }else{
        res.render('alreadycheckedin');
    }
});

/**
 * Hier wird die Checkoutseite angezeigt
 * Wenn bereits eingechekt wird man drauf hingewiesen das man nicht eingecheckt ist.
 */

app.get('/checkout',(req,res)=>{
    if(req.session['vorname'] != null){
        res.render('checkout');
    }else{
        res.render('index');
    }
});

/**
 * Beim auschecken wird nach dem nutzer gesucht und der jeweilige eintrag wird aus der liste entfernt
 * Session variablen werden auch gelöscht
 */
app.post('/checkout',(req,res) =>{
    for(var i = 0; i < liste.length; i++){
        if(liste[i] === {vorname: req.session['vorname'], nachname: req.session['nachname'], datum: req.session['datum']}){
            console.log("it worked")
            
            liste.splice(i,1);
            delete req.session['vorname'];
            delete req.session['nachname'];
            delete req.session['datum'];
            //res.render('checkin')
            break;
        }
    }
    res.render('checkin')
})

app.use(express.static(__dirname + '/public'))

//server wird gestartet
server.listen(port,() =>{
    console.log('running on port %d', port);
});