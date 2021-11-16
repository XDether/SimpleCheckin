/**
 * Express wird initializiert 
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



/**
 * express-session wird initializirt
 * secret = SessionID
 * saveUninitialized = erlaubts session unbekannte datentypen abzuspeichern
 */
const session = require('express-session');
app.use(session({
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true
})) 

/**
 * ejs wird initializieren
 */
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');


/**
 * Liste für die bereits eingechekten Leute
 */
liste = [ 
    {vorname: "Alice", nachname: "Schulz" , datum: new Date()}, 
    {vorname: "Bob", nachname: "Harvey", datum: new Date()}, 
    {vorname: "Carla", nachname: "Carter", datum: new Date()} 
];

/**
 * Startseite
 * Ein vorname wird übergeben falls man bereits eingcheket ist
 */
app.get('/',(req,res)=>{


    res.render('index',{vorname: req.session['vorname']});
});

/**
 * Startseite
 * Ein vorname wird übergeben falls man bereits eingcheket ist
 */
app.get('/index',(req,res)=>{
    res.render('index',{vorname: req.session['vorname']});
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

        res.render('index',{vorname: req.session['vorname']});
    }else{
        res.render('alreadycheckedin');
    }
});



app.get('/checkinlist',(req,res)=>{
    res.render('checkinlist', {liste: liste})
});

/**
 * Hier wird die Checkoutseite angezeigt
 * Wenn bereits eingechekt wird man drauf hingewiesen das man nicht eingecheckt ist.
 */

 app.get('/checkout',(req,res)=>{
    if(req.session['vorname'] != null){
        res.render('checkout');
    }else{
        res.render('notcheckedin');
    }
});

/**
 * Beim auschecken wird nach dem nutzer gesucht und der jeweilige eintrag wird aus der liste entfernt
 * Session variablen werden auch gelöscht
 */
app.post('/checkout',(req,res) =>{
    if(req.session['vorname'] != null){
        for(var i = 0; i < liste.length; i++){
            console.log("it worked");
            if(liste[i].vorname === req.session['vorname']){
                console.log("it worked")
            
                liste.splice(i,1);
                delete req.session['vorname'];
                delete req.session['nachname'];
                delete req.session['datum'];
                //res.render('checkin')
                break;
            }
        }
        res.render('index',{vorname: req.session['vorname']});
    }
    else
    {
        res.render('notcheckedin');
    }
});

app.use(express.static(__dirname + '/public'))

//server wird gestartet
server.listen(port,() =>{
    console.log('running on port %d', port);
});