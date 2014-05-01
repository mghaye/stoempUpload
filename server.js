var express = require('express');
var bodyparser=require('body-parser');

var mysql=require('mysql');
var fs=require('fs');
var app = express();
app.use(bodyparser());
/*
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
*/


var connection=mysql.createConnection({
    host : 'mysqlhost.jouwdomein.be',
    user : 'A000736',
    password : 'torralba69',
    database : 'A000736'

});
connection.connect();



//app maakt gebruik van submap /public(en submappen)
//altijd naar surfen via localhost:3000/....
app.use(express.static(__dirname + '/public'));

app.get('/list', function (req, res) {
    console.log('in the GET');

    //de soepen uit de database worden hier 'in the get' gestoken
    //zodat we ze in het formulier met een getjson(/list,... ) kunnen ophalen
    var sql='select naam from soep';
    connection.query(sql,function(err,rows){
        if (err){
            throw err;

        }else{
            console.log(rows);}
            res.send(rows);
    });
});


//Post functie die zorgt voor het verwijderen uit de database
app.post('/verwijder', function (req, res) {
    console.log('in de app.post/verwijder-functie');
    //de soepnaam die in het formulier gepost werd, wordt hier binnengehaald
    //zodat we die kunnen verwijderen
    var ontvangenSoep = req.body.soep;
    console.log(ontvangenSoep);
    var soepnaam='("'+ontvangenSoep+'")'
    var sql='DELETE FROM soep WHERE naam= '
    sql+=soepnaam;

    connection.query(sql,function(err){
        if (err)
            throw err;
        console.log(ontvangenSoep+ ' is verwijderd');
    })

});


//Post functie die zorgt voor het toevoegen in de database

app.post('/', function (req, res) {
    console.log('in de app.post-functie');
    //de soepnaam die in het formulier gepost werd, wordt hier binnengehaald
    //zodat we die kunnen opslaan
    var ontvangenSoep = req.body.soep;
    console.log(ontvangenSoep);
    //Controle om te kijken of de soep niet reeds is opgeslagen

    var soepnaam='("'+ontvangenSoep+'")'
    var sql='SELECT naam FROM soep WHERE naam= '
    sql+=soepnaam;
    console.log(sql);
    connection.query(sql,function(err,data){
        if (err){
            throw err;

        }else{
            if(data==''){
                console.log('soep wordt opgeslagen');
                sql='INSERT INTO soep(naam) VALUES ';
                 sql+=soepnaam;
                 console.log(sql);
                 connection.query(sql,function(err){
                     if (err)
                         throw err;
                 });



            }else{
                console.log('soep bestaat al');

            }
        }
    });

});

//post-functie die dagsoepen opslaat in een file
app.post('/soepen', function (req, res) {

    console.log('in de app.post/soepen functie');

    var datumInvoer = req.body.datum;
    var soep1 = req.body.soep1;
    var soep2 = req.body.soep2;
    var soep3 = req.body.soep3;
    var soep4 = req.body.soep4;

    //functie die de weekdag teruggeeft van een bepaalde datum
    //bvb : var weekdag=wichDayWasThat(18-04-2014)-> stelt weekdag gelijk aan vrijdag
    function whichDayWasThat(date) {
        this.date = date.split('-');
        days = new Array('Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag');
        myDate = new Date();
        myDate.setMonth(parseInt(this.date[1]-1),this.date[0]); //
        myDate.setFullYear(this.date[2]);

        return (days[myDate.getDay()]);
    }

    //functie die de maandnaam teruggeeft van de meegegeven maand
    function whichMonthWasThat(month){
        month=parseInt(month);
        months=new Array('januari','februari','maart','april','mei','juni','juli','augustus','september','oktober',
            'november','december');
        return months[month-1];
    }

    //functie die de nul weghaalt voor dagen 01 tot 09
    function convertDay(day){
        if ((day.substr(0,1))==0){
            day=day.substr(1,1);
            return day;
        }
        else{
            return day;
        }
    }

    //dag, maand en jaar uit dat de datum halen en
    //terug aan elkaar plakken in het formaat dd-mm-yyyy
    var datum=datumInvoer;
    var dag=datum.substr(8,2);
    var maand=datum.substr(5,2);
    var jaar=datum.substr(0,4);
    datum=dag+'-'+maand+'-'+jaar;

    //bepalen welke weekdag het is
    var weekdag=whichDayWasThat(datum);
    console.log(weekdag);
    //bepalen welke maand het is
    var maandnaam=whichMonthWasThat(maand);
    console.log(maandnaam);
    //dag converteren indien er een 0 voor staat
    var dag=convertDay(dag);
    console.log(dag);
    datum = weekdag+' '+dag+' '+maandnaam;
    datum ='<strong>'+datum+'</strong>';
    var dagsoepen='<br>'+datum+'<br>'+soep1+'<br>'+soep2+'<br>'+soep3+'<br>'+soep4+'<br>'+'\n';


    fs.appendFile('c:/soepUpload/public/inhoud.html',dagsoepen, function (err) {
        if (err) return console.log(err);
        console.log('gegevens weggeschreven naar file');
    });


});

app.post('/opslaan',function(req,res){
    console.log('in de opslaan-functie');
    fs.rename('c:/soepUpload/public/inhoud.html','c:/centerfruit/inhoud.html', function (err) {
        if (err) throw err;
        console.log('renamed complete');
    });
});




var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});

