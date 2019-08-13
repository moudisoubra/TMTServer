'use strict';

//Start server using: http://localhost:3000/

//Require = using
var express = require("express");
var fs = require("fs"); //Used for saving files
var server = express(); //enables us to use express for server creation.
//var uuid = require("uuid"); //The node name for generating a GUID.
//what is a GUID? -> a string which is guarnteed to be unique (Takes time, processor id + random string).

server.use(express.urlencoded()); //Express can be used for anything, need to specify for unity. Can used JSONENCODED

console.log("Hello Tookey! Welcome to your server.")

//------- "Variables" 
// var x = []; -> An array.
// var x = {}; -> An object (Objects can more properties inside, aka x.health or x.speed.value).
var players = [];
var playerPos = { x: 0, y: 0, z: 0 };
var playerProfile = []


var leaderboard = [];
var matches = [];
var pendingMatches = [];

//------- Creating "Functions"
//Post: For uploading any information to the server
//Get: Accessing any information from the server

server.get(/*Takes the name of the request*/ "/example", /*either pass in a function or create one*/ function (req, res) {

    //Req -> Request
    //Res -> Response
    res.end(); //You must end the response or unity will keep waiting and will not proceed.
});

//---------------------------------------------------- F U N C T I O N S ------------------------------------------------------------

function SaveToFile() {
    var data = { playerProfile };
    fs.writeFile("playerProfile.txt", data, (err) => {
        if (err) console.log(err);
        console.log('\x1b[32m%s\x1b[0m', 'Successfully Written To File');
    });

   /* function LoadFromFile() {
        fs.readFile("playerProfile.txt", (err) => {
            if(err) console.log(err);
            console.log('\x1b[32m%s\x1b[0m', 'Successfully loaded file');
        });
}*/

//---------------------------------------------------- G E T ------------------------------------------------------------

   /* server.get("/load", function (req, res) {

    });*/

server.get("/print", function (req, res)
{
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


server.get("/match", function (req, res)
{
    if (pendingMatches.length == 0)
    {
        var match = {};
        match.id = uuid();
    }
});

/*server.get("/readFile", function (req, res) {

    fs.readFile("playerProfile.txt", function (err, buf) {
        res.send(buf.toString());
        console.log('\x1b[32m%s\x1b[0m', 'Successfully Read File'); 
    });

});*/

//--------------------------------------------------- P O S T ------------------------------------------------------------

/*server.post("/leaderboard", function (req, res) {
 
});*/

setInterval(SaveToFile, 3000);
server.listen(3000); 