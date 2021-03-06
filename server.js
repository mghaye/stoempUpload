var express = require('express');
var bodyparser = require('body-parser');

var mysql = require('mysql');
var fs = require('fs');
var app = express();
app.use(bodyparser());
/*
 app.use(express.json());       // to support JSON-encoded bodies
 app.use(express.urlencoded()); // to support URL-encoded bodies
 */


var connection = mysql.createConnection({
    host: 'mysqlhost.jouwdomein.be',
    user: 'A000736',
    password: 'torralba69',
    database: 'A000736'

});
connection.connect();


//app maakt gebruik van submap /public(en submappen)
//altijd naar surfen via localhost:3000/....
app.use(express.static(__dirname + '/public'));

//Post functie die zorgt voor het toevoegen soepen in de database
app.post('/', function (req, res) {
    console.log('in de app.post-functie');
    //de soepnaam die in het formulier gepost werd, wordt hier binnengehaald
    //zodat we die kunnen opslaan
    var ontvangenSoep = req.body.soep;
    console.log(ontvangenSoep);

    //Controle om te kijken of de soep niet reeds is opgeslagen
    var soepnaam = '("' + ontvangenSoep + '")'
    var sql = 'SELECT naam FROM stoemp WHERE naam= '
    sql += soepnaam;
    console.log(sql);
    connection.query(sql, function (err, data) {
        if (err) {
            throw err;

        } else {
            if (data == '') {
                console.log('soep wordt opgeslagen');
                sql = 'INSERT INTO stoemp(naam) VALUES ';
                sql += soepnaam;
                console.log(sql);
                connection.query(sql, function (err) {
                    if (err)
                        throw err;
                });
            } else {
                console.log('soep bestaat al');

            }
        }
    });

});

app.get('/list', function (req, res) {
    console.log('in the GET');

    //de soepen uit de database worden hier 'in the get' gestoken
    //zodat we ze in het formulier met een getjson(/list,... ) kunnen ophalen
    var sql = 'select naam from stoemp';
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err;

        } else {
            console.log(rows);
        }
        res.send(rows);
    });
});

app.get('/listDays', function (req, res) {
    console.log('in the GET');

    //de dagen uit de database worden hier 'in the get' gestoken
    //zodat we ze in het formulier met een getjson(/listDays,... ) kunnen ophalen
    var sql = 'SELECT * FROM stoempDag';
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err;

        } else {
            console.log(rows);
        }
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
    var soepnaam = '("' + ontvangenSoep + '")'
    var sql = 'DELETE FROM stoemp WHERE naam= '
    sql += soepnaam;

    connection.query(sql, function (err) {
        if (err)
            throw err;
        console.log(ontvangenSoep + ' is verwijderd');
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('soep verwijderd');
    res.end();

});
/*app.post('/verwijderDagen',function(req,res){
 console.log('in de app.post/verwijderDagen-functie');
 var sql='DELETE FROM dag';
 connection.query(sql, function (err) {
 if (err)
 throw err;
 console.log('dagen zijn verwijderd');
 })

 });*/
app.post('/verwijderOudsteDag', function (req, res) {


    console.log('in de app.post/verwijderDagen-functie');
    //op deze manier wordt de oudste dag dag[0]
    var zoeksql = 'SElECT datum FROM stoempDag ORDER BY realDate ASC LIMIT 0,1';
    connection.query(zoeksql, function (err, dag) {
        if (err) {
            throw err;
        } else {
            console.log(dag);
        }

        console.log("dag is= " + dag[0]);
        var kleinsteDag = dag[0].datum;
        kleinsteDag = '"' + kleinsteDag + '"';
        console.log(dag[0].datum);
        var sql = 'DELETE FROM stoempDag WHERE datum= ' + kleinsteDag;
        console.log(sql);
        connection.query(sql, function (err) {
            if (err)
                throw err;
            console.log('dag met datum' + kleinsteDag + ' is verwijderd');
        })
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('dag verwijderd');
    res.end();
});


//post-functie die dagsoepen opslaat in database
app.post('/soepen', function (req, res) {

    console.log('in de app.post/soepen functie');

    var datumInvoer = req.body.datum;
    var soep1 = req.body.soep1;
    var soep2 = req.body.soep2;
    var soep3 = req.body.soep3;
    var soep4 = req.body.soep4;
    var soep5 = req.body.soep5;
    var soep6 = req.body.soep6;
    var soep7 = req.body.soep7;
    soep1 = '"' + soep1 + '"';
    soep2 = '"' + soep2 + '"';
    soep3 = '"' + soep3 + '"';
    soep4 = '"' + soep4 + '"';
    soep5 = '"' + soep5 + '"';
    soep6 = '"' + soep6 + '"';
    soep7 = '"' + soep7 + '"';

    //functie die de weekdag teruggeeft van een bepaalde datum
    //bvb : var weekdag=wichDayWasThat(18-04-2014)-> stelt weekdag gelijk aan vrijdag
    function whichDayWasThat(date) {
        this.date = date.split('-');
        days = new Array('Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag');
        myDate = new Date();
        myDate.setMonth(parseInt(this.date[1] - 1), this.date[0]); //
        myDate.setFullYear(this.date[2]);

        return (days[myDate.getDay()]);
    }

    //functie die de maandnaam teruggeeft van de meegegeven maand
    function whichMonthWasThat(month) {
        month = parseInt(month);
        months = new Array('januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober',
            'november', 'december');
        return months[month - 1];
    }

    //functie die de nul weghaalt voor dagen 01 tot 09
    function convertDay(day) {
        if ((day.substr(0, 1)) == 0) {
            day = day.substr(1, 1);
            return day;
        }
        else {
            return day;
        }
    }

    //dag, maand en jaar uit dat de datum halen en
    //terug aan elkaar plakken in het formaat dd-mm-yyyy
    var datum = datumInvoer;
    var dag = datum.substr(8, 2);
    var maand = datum.substr(5, 2);
    var jaar = datum.substr(0, 4);
    datum = dag + '-' + maand + '-' + jaar;

    //bepalen welke weekdag het is
    var weekdag = whichDayWasThat(datum);
    console.log(weekdag);
    //bepalen welke maand het is
    var maandnaam = whichMonthWasThat(maand);
    console.log(maandnaam);
    //dag converteren indien er een 0 voor staat
    var dag = convertDay(dag);
    console.log(dag);
    datum = weekdag + ' ' + dag + ' ' + maandnaam;
    datum = '"' + datum + '"';
    //Controle of de dag niet reeds is opgeslagen
    var sql = 'SELECT datum FROM stoempDag WHERE datum= '
    sql += datum;
    console.log(sql);
    connection.query(sql, function (err, data) {
        if (err) {
            throw err;
        } else {
            if (data == '') {
                console.log('dag wordt opgeslagen');
                sql = 'INSERT INTO stoempDag(datum,soep1,soep2,soep3,soep4,soep5,soep6,soep7,realDate) VALUES ';
                sql += '(' + datum + ',' + soep1 + ',' + soep2 + ',' + soep3 + ',' + soep4 +','+ soep5 +','
                + soep6 +','+ soep7 +','+'"'+datumInvoer+'"'+')';
                console.log(sql);
                connection.query(sql, function (err) {
                    if (err)
                        throw err;
                });


            } else {
                console.log('dag bestaat al');
            }

        }
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('dag toegevoegd');
    res.end();


});


var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});

