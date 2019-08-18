'use strict';

//Start server using: http://localhost:3000/

//Require = using
var express = require("express");
var fs = require("fs"); //Used for saving files
var server = express(); //enables us to use express for server creation.
var mongoose = require('mongoose'); //For database 

//var uuid = require("uuid"); //The node name for generating a GUID.
//what is a GUID? -> a string which is guarnteed to be unique (Takes time, processor id + random string).

server.use(express.urlencoded()); //Express can be used for anything, need to specify for unity. Can used JSONENCODED

var uristring =
    process.env.MONGODB_URI || 
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/MeltDown';

mongoose.connect(uristring, { useNewUrlParser: true });

var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Connected to Mongoose!!!!! Mabroooook");
    });

console.log("Hello Tookey! Welcome to your server.")

//------- "Variables" 
// var x = []; -> An array.
// var x = {}; -> An object (Objects can more properties inside, aka x.health or x.speed.value).
var playerProfile = []

var pendingMatches = [];

//------- Creating "Functions"
//Post: For uploading any information to the server
//Get: Accessing any information from the server

server.get(/*Takes the name of the request*/ "/example", /*either pass in a function or create one*/ function (req, res) {

    //Req -> Request
    //Res -> Response
    res.end(); //You must end the response or unity will keep waiting and will not proceed.
});


//---------------------------------------------------- M o n g o o s e -- S c h e m a ------------------------------------------------------------

// Everything in mongoose derives from schemas, so we create a schema for the player profile.
var playerProfileMongo = new mongoose.Schema({
    player_ID: Number,
    player_Hat_ID: Number,
    player_Score: Number,
    //Add player colour
});

var player = mongoose.model('player', playerProfileMongo);

//---------------------------------------------------- F U N C T I O N S ------------------------------------------------------------

function SaveToFile() { //Saves the player information into a array & into a text file.

    var data = JSON.stringify(playerProfile); //cannot read object therefore STRINGIFY!

    fs.writeFile("playerProfile.txt", data, (err) => {
        if (err) console.log(err);
        console.log('\x1b[32m%s\x1b[0m', 'Successfully Written To File');
    });
}

function LoadFromFile() {
    fs.readFile("playerProfile.txt", (err) => {
        if (err) console.log(err);
        console.log('\x1b[32m%s\x1b[0m', 'Successfully loaded file');
    });
}

    //---------------------------------------------------- G E T ------------------------------------------------------------

server.get("/saveMongo/:playerID/:playerHatID/:playerScore", function (req, res, next){

    var player_ID = req.params.playerID;
    var player_Hat_ID = req.params.playerHatID;
    var player_Score = req.params.playerScore;

    player.findOne({ "player_ID": player_ID }, (err, Player) => { //Finds one user
        if (!Player) { //If we dont find the player within the database

            console.log("Couldnt find the player.");

            var newPlayer = new player({ //Creates a new player
                "player_ID": player_ID,
                "player_Hat_ID": player_Hat_ID,
                "player_Score": player_Score
            });

            res.send({ newPlayer }); //Sends the new player as an object

            newPlayer.save(function (err) { if (err) console.log('Error on save!') }); //Saves the new player to the database.
        }
        else {
            console.log("Found player: " + Player); 
            res.send({ Player }); //The player already exists in the database & will be sent to us.
        }
    }); 
});

    server.get("/load", function (req, res) {
        fs.readFile("playerProfile.txt", function (err, buf) {

            var string = buf.toString();
            res.send(JSON.parse(string));
            console.log(string + "zis iz the load from ze file");
        });
     });

    server.get("/print", function (req, res) {
        console.log("Printed all PlayerProfiles");
        res.send({ playerProfile }); //Again, sending it as an object so unity can read it.

        res.end();
    });

    server.get("/addPlayerProfile/:playerID/:playerScore/:hatId", function (req, res) //:xyz is the parameter which is required
    {
        var playerObj = {}; //Creates an object for the player so that we can add the variables we need

        playerObj.id = req.params.playerID; //Must be the same name as the :parameter
        playerObj.score = req.params.playerScore;
        playerObj.hatId = req.params.hatId;

        playerProfile.push(playerObj); //Pushes the object we created with the user information to the array
        res.send({ playerProfile }); //sends the array to the server. Creates it an object so the server can understand

        res.end();
    });

    server.get("/match", function (req, res) {
        if (pendingMatches.length == 0) {
            var match = {};
            match.id = uuid();
        }
    });

    //--------------------------------------------------- P O S T ------------------------------------------------------------

    /*server.post("/leaderboard", function (req, res) {
     
    });*/

setInterval(SaveToFile, 3000);

server.listen(process.env.PORT || 3000, function () { //process.env.PORT heruko port that works

    //console.log(process.env.PORT);

});
