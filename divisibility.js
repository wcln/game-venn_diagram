


var mute = false;
var FPS = 24;

var STAGE_WIDTH, STAGE_HEIGHT;

var questionCounter;
var score;

var gameStarted;


/*
 * Called by body onload
 */
function init() {
	STAGE_WIDTH = parseInt(document.getElementById("gameCanvas").getAttribute("width"));
	STAGE_HEIGHT = parseInt(document.getElementById("gameCanvas").getAttribute("height"));

	// init state object
	stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas
	stage.mouseEventsEnabled = true;
	stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

	setupManifest(); // preloadJS
	startPreload();

	score = 0; // reset game score
	questionCounter = 0;
	stage.update();
}

/*
 * Main game loop
 */
function update(event) {

	if (gameStarted) {

	}

	stage.update(event);
}

/*
 * Ends the game
 */
function endGame() {
	gameStarted = false;
}

/*
 * Starts the game. Called by preloadJS loadComplete
 */
function startGame() {

	initGraphics();

	gameStarted = true;
}

/*
 * Loads and positions graphics
 */
function initGraphics() {

}


////////////////////////////////////////////////// PRE LOAD JS FUNCTIONS

// bitmap variables


function setupManifest() {
	manifest = [
		{
			src: "sounds/click.mp3",
			id: "click"
		}
	];
}

function startPreload() {
	preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);          
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

function handleFileLoad(event) {
	console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
   	if (event.item.id.includes("category")) {
   		categories.push(new createjs.Bitmap(event.result));
   	}
}

function loadError(evt) {
    console.log("Error!",evt.text);
}

// not currently used as load time is short
function handleFileProgress(event) {

}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    // ticker calls update function, set the FPS
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", update); // call update function




	stage.addChild(background);
    stage.update();
    startGame();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS