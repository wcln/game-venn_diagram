/*
 * BC Learning Network (bclearningnetwork.com)
 * Divisibility Game
 * @authors Colin Bernard and Brittany Miller
 */


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
	initMuteUnMuteButtons();

	// draw the venn diagram
	leftVenn.x = rightVenn.x = centerVenn.x = STAGE_WIDTH/2 - leftVenn.image.width/2;
	leftVenn.y = rightVenn.y = centerVenn.y = STAGE_HEIGHT/2 - leftVenn.image.height/2 + 20;

	stage.addChild(leftVenn); stage.addChild(rightVenn); stage.addChild(centerVenn);
}

/*
 * Adds the mute and unmute buttons to the stage and defines listeners
 */
function initMuteUnMuteButtons() {
	var hitArea = new createjs.Shape();
	hitArea.graphics.beginFill("#000").drawRect(0, 0, muteButton.image.width, muteButton.image.height);
	muteButton.hitArea = unmuteButton.hitArea = hitArea;

	muteButton.x = unmuteButton.x = 45;
	muteButton.y = unmuteButton.y = 45;

	muteButton.on("click", toggleMute);
	unmuteButton.on("click", toggleMute);

	stage.addChild(muteButton);
}


////////////////////////////////////////////////// PRE LOAD JS FUNCTIONS

// bitmap variables
var startScreen;
var leftVenn, centerVenn, rightVenn;
var lifeHeart;

var muteButton, unmuteButton;

function setupManifest() {
	manifest = [
		{
			src: "sounds/click.mp3",
			id: "click"
		},
		{
			src: "images/mute.png",
			id: "mute"
		},
		{
			src: "images/unmute.png",
			id: "unmute"
		},
		{
			src: "images/rightVenn.png",
			id: "rightVenn"
		},
		{
			src: "images/leftVenn.png",
			id: "leftVenn"
		},
		{
			src: "images/centerVenn.png",
			id: "centerVenn"
		},
		{
			src: "images/lifeHeart.png",
			id: "lifeHeart"
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
   	if (event.item.id == "mute") {
   		muteButton = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "unmute") {
   		unmuteButton = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "leftVenn") {
   		leftVenn = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "centerVenn") {
   		centerVenn = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "rightVenn") {
   		rightVenn = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "lifeHeart") {
   		lifeHeart = new createjs.Bitmap(event.result);
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


    stage.update();
    startGame();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS