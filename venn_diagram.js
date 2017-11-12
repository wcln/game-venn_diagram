/*
 * BC Learning Network (bclearningnetwork.com)
 * Venn Diagram Game
 * @authors Colin Bernard and Brittany Miller
 */


var mute = false;
var FPS = 24;

var STAGE_WIDTH, STAGE_HEIGHT;

// question data
var questions = [
					{question:6, options:[4,3], answer:"right"},
					{question:5, options:[2,1], answer:"right"},
					{question:16, options:[6,4], answer:"right"},
					{question:35, options:[7,5], answer:"both"},
					{question:15, options:[3,5], answer:"both"},
					{question:22, options:[11,4], answer:"left"},
					{question:23, options:[7,3], answer:"neither"},
					{question:10, options:[1,2], answer:"both"},
					{question:25, options:[5,4], answer:"left"},
					{question:13, options:[3,10], answer:"neither"},
					{question:20, options:[4,2], answer:"both"},
					{question:30, options:[5,8], answer:"left"},
					{question:22, options:[2,8], answer:"left"},
					{question:44, options:[11,6], answer:"left"},
					{question:60, options:[20,4], answer:"both"},
					{question:18, options:[9,6], answer:"both"},
					{question:45, options:[15,17], answer:"left"},
					{question:51, options:[4,7], answer:"neither"},
					{question:71, options:[7,10], answer:"neither"},
					{question:32, options:[4,6], answer:"left"},
					{question:54, options:[9,4], answer:"left"},
					{question:42, options:[6,3], answer:"both"},
					{question:60, options:[12,8], answer:"left"},
					{question:28, options:[7,6], answer:"left"},
					{question:62, options:[4,12], answer:"neither"},
					{question:121, options:[11,12], answer:"left"},
					{question:1000, options:[4,205], answer:"left"},
					{question:52, options:[4,13], answer:"both"},
					{question:144, options:[12,4], answer:"both"},
					{question:89, options:[9,13], answer:"neither"}
				];

var questionCounter;
var levelCounter;
var score;
var timeToAnswer = 10; // seconds
var lastTime = 0;
var questionTimer;
var timerCounter;

var gameStarted;

var selected = "none";
var enabled = false; // keep track of whether square is being dragged

var hearts;
var lifeIndex = 2;

// text
var questionText;
var scoreText;
var leftVennText;
var rightVennText;
var levelText;
var timerText;




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
	levelCounter = 1;
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

function timer() {
	timerCounter--;
	timerText.text = timerCounter;
	timerText.x = 467 - timerText.getMeasuredWidth()/2;
	timerText.y = 450 - timerText.getMeasuredHeight()/2;
	playSound("tick");

	if (timerCounter == 0) {
		showWrongSplash();
		updateScore(-5);
		removeLife();
		playSound("wrongSound");
		clearInterval(questionTimer);
	}
}

/*
 * Ends the game
 */
function endGame() {
	gameStarted = false;


	playSound("timeout");
	clearInterval(questionTimer);

	stage.addChild(faded);

	playAgainButton.x = playAgainButtonHover.x = STAGE_WIDTH/2 - 20;
	playAgainButton.y = playAgainButtonHover.y = STAGE_HEIGHT/2 - 60;
	gameOverSplash.x = 20;
	gameOverSplash.y = 10;
	playAgainButtonHover.cursor = "pointer";
	stage.addChild(gameOverSplash);
	stage.addChild(playAgainButton);


	playAgainButton.on("mouseover", function() {
		stage.addChild(playAgainButtonHover);
		stage.removeChild(playAgainButton);
	});
	playAgainButtonHover.on("mouseout", function() {
		stage.addChild(playAgainButton);
		stage.removeChild(playAgainButtonHover);
	})
	stage.on("stagemousedown", function() {
		playSound("click");
		location.reload();
	});
}

/*
 * Starts the game. Called by preloadJS loadComplete
 */
function startGame() {

	startButton.x = startButtonHover.x  = STAGE_WIDTH/2 - startButton.image.width/2;
	startButton.y = startButtonHover.y = 350;
	startButton.cursor = "pointer";
	startButtonHover.cursor = "pointer";

	stage.addChild(startButton);
	startButton.on("mouseover", function() {
		if (!gameStarted) {
			stage.addChild(startButtonHover);
			stage.removeChild(startButton);
		}
	});
	startButtonHover.on("mouseout", function() {
		if (!gameStarted) {
			stage.addChild(startButton);
			stage.removeChild(startButtonHover);
		}
	});
	startButtonHover.on("mousedown", function() {
		playSound("click");
		stage.removeChild(startButtonHover);
		initGraphics();
		gameStarted = true;
		timerCounter = timeToAnswer;
		questionTimer = setInterval(timer, 1000);
	});

}

/*
 * Updates and renders question and option text
 */
function nextQuestion() {

	if (gameStarted) {
		selected = "none";
		questionCounter++;

		if (questionCounter == questions.length) {
			endGame();
		} else {
			square.x = 45;
			square.y = 100;

			questionText.text = questions[questionCounter].question;
			leftVennText.text = questions[questionCounter].options[0];
			rightVennText.text = questions[questionCounter].options[1];

			questionText.x = square.x + square.image.width/2 - questionText.getMeasuredWidth()/2;
			questionText.y = square.y + square.image.height/2 - questionText.getMeasuredHeight()/2;

			timerCounter = timeToAnswer + 1;
			questionTimer = setInterval(timer, 1000);

		}
	}
}

/*
 * Loads and positions graphics
 */
function initGraphics() {
	stage.addChild(background);
	stage.removeChild(startBackground);
	initMuteUnMuteButtons();

	// draw the venn diagram
	leftVenn.x = rightVenn.x = centerVenn.x = STAGE_WIDTH/2 - leftVenn.image.width/2;
	leftVenn.y = rightVenn.y = centerVenn.y = STAGE_HEIGHT/2 - leftVenn.image.height/2 + 20;
	stage.addChild(leftVenn); stage.addChild(rightVenn); stage.addChild(centerVenn);
	initVennListeners();

	// init text
	questionText = new createjs.Text(questions[questionCounter].question, '36px Arial', "black");
	square.x = 45;
	square.y = 100;
	square.cursor = "pointer";
	questionText.x = square.x + square.image.width/2 - questionText.getMeasuredWidth()/2;
	questionText.y = square.y + square.image.height/2 - questionText.getMeasuredHeight()/2;
	stage.addChild(square);
	stage.addChild(questionText);
	initQuestionListener();

	recycle.x = 20;
	recycle.y = 365;
	stage.addChild(recycle);
	initRecycleListener();


	scoreText = new createjs.Text(score, '30px Arial', 'black');
	scoreText.x = 395 - scoreText.getMeasuredWidth()/2;
	scoreText.y = 450 - scoreText.getMeasuredHeight()/2;
	stage.addChild(scoreText);

	leftVennText = new createjs.Text(questions[questionCounter].options[0], '32px Arial', 'black');
	leftVennText.x = STAGE_WIDTH/2 - 80 - leftVennText.getMeasuredWidth();
	leftVennText.y = STAGE_HEIGHT/2;
	stage.addChild(leftVennText);

	rightVennText = new createjs.Text(questions[questionCounter].options[1], '32px Arial', 'black');
	rightVennText.x = STAGE_WIDTH/2 + 80;
	rightVennText.y = STAGE_HEIGHT/2;
	stage.addChild(rightVennText);

	hearts = [];
	for (var i = 0; i < 3; i++) {
		hearts[i] = Object.create(life);
		hearts[i].x = 530 + 40 * i - life.image.width/2;
		hearts[i].y = 450 - life.image.height/2;
		stage.addChild(hearts[i]);
	}

	levelText = new createjs.Text(levelCounter, '30px Arial', 'black');
	levelText.x = 320 - levelText.getMeasuredWidth()/2;
	levelText.y = 450 - levelText.getMeasuredHeight()/2;
	stage.addChild(levelText);

	timerText = new createjs.Text(timeToAnswer, '30px Arial', 'black');
	timerText.x = 467 - timerText.getMeasuredWidth()/2;
	timerText.y = 450 - timerText.getMeasuredHeight()/2;
	stage.addChild(timerText);
}

function initRecycleListener() {
	recycle.on("rollover", function(event) {
		if (enabled) {
			recycle.alpha = 0.8;
			recycle.scaleX = recycle.scaleY = 1.05;
			selected = "neither";
		}
	});
	recycle.on("rollout", function(event) {
		recycle.alpha = 1;
		recycle.scaleX = recycle.scaleY = 1;
		selected = "none";

	});
}

/*
 * Set up the listener for the question text and square
 */
function initQuestionListener() {

	square.on("pressmove", function(event) {
		enabled = true;
		moveHandler(event);
	});

	stage.on("stagemouseup", function(event) {
		if (enabled) {
			dropHandler(event);
		}
	});

	square.on("rollover", function(event) {
		this.scaleX = this.scaleX * 1.1;
		this.scaleY = this.scaleY * 1.1;
		questionText.scaleX = 1.1;
		questionText.scaleY = 1.1;
	});

	square.on("rollout", function(event) {
		this.scaleX = 1;
		this.scaleY = 1;
		questionText.scaleX = questionText.scaleY = 1;
	});
}

function initVennListeners() {
	leftVenn.on("rollover", function() {
		if (enabled) {
			leftVenn.alpha = 0.8;
			selected = "left";
		}
	});
	leftVenn.on("rollout", function() {

		leftVenn.alpha = 1;
		selected = "none";

	});
	centerVenn.on("rollover", function() {
		if (enabled) {
			centerVenn.alpha = 0.8;
			selected = "both";
		}
	});
	centerVenn.on("rollout", function() {

		centerVenn.alpha = 1;
		selected = "none";

	});
	rightVenn.on("rollover", function() {
		if (enabled) {
			rightVenn.alpha = 0.8;
			selected = "right";
		}
	});
	rightVenn.on("rollout", function() {

		rightVenn.alpha = 1;
		selected = "none";

	});
}


/*
 * Allows the user to move the question text with mouse
 */
function moveHandler(event) {

	stage.setChildIndex(square, 1);

	event.target.x = event.stageX - square.image.width/2;
	event.target.y = event.stageY - square.image.height/2;

	questionText.x = square.x + square.image.width/2 - questionText.getMeasuredWidth()/2;
	questionText.y = square.y + square.image.height/2 - questionText.getMeasuredHeight()/2;

}

/*
 * The question text is dropped.
 */
function dropHandler(event) {
	enabled = false;

	if (selected != "none") {
		clearInterval(questionTimer);

		if (selected === questions[questionCounter].answer) {

			if (questionCounter == 10  || questionCounter == 20) {
				nextLevel();
			}

			showCorrectSplash();
			updateScore(10);
			playSound("correctSound");
		} else {
			showWrongSplash();
			updateScore(-5);
			removeLife();
			playSound("wrongSound");
		}
	}
}

function removeLife() {

	createjs.Tween.get(hearts[lifeIndex]).to({alpha:0}, 200).call(function() {
		stage.removeChild(hearts[lifeIndex]);
		lifeIndex--;

		if (lifeIndex == -1) {
			setTimeout(endGame, 800);
		}
	});
}

function nextLevel() {
	levelCounter++;
	levelText.text = levelCounter;
	levelText.x = 320 - levelText.getMeasuredWidth()/2;
	levelText.y = 450 - levelText.getMeasuredHeight()/2;

	timeToAnswer -= 2;
}

function updateScore(value) {
	scoreText.text = parseInt(scoreText.text) + value;
	scoreText.x = 395 - scoreText.getMeasuredWidth()/2;
	scoreText.y = 450 - scoreText.getMeasuredHeight()/2;
}

function showCorrectSplash() {
	correctSplash.alpha = 1;
	stage.addChild(correctSplash);

	createjs.Tween.get(correctSplash).to({alpha:0}, 1000).call(function() {
		stage.removeChild(correctSplash);
		nextQuestion();
	})
}

function showWrongSplash() {
	wrongSplash.alpha = 1;
	stage.addChild(wrongSplash);

	createjs.Tween.get(wrongSplash).to({alpha:0}, 1000).call(function() {
		stage.removeChild(wrongSplash);
		nextQuestion();
	})
}

/*
 * Adds the mute and unmute buttons to the stage and defines listeners
 */
function initMuteUnMuteButtons() {
	var hitArea = new createjs.Shape();
	hitArea.graphics.beginFill("#000").drawRect(0, 0, muteButton.image.width, muteButton.image.height);
	muteButton.hitArea = unmuteButton.hitArea = hitArea;

	muteButton.x = unmuteButton.x = 5;
	muteButton.y = unmuteButton.y = 5;

	muteButton.cursor = "pointer";
	unmuteButton.cursor = "pointer";

	muteButton.on("click", toggleMute);
	unmuteButton.on("click", toggleMute);

	stage.addChild(muteButton);
}


////////////////////////////////////////////////// PRE LOAD JS FUNCTIONS

// bitmap variables
var leftVenn, centerVenn, rightVenn;
var life;
var square;
var background, startBackground;
var recycle;
var correctSplash, wrongSplash, gameOverSplash;
var faded;

var startButton, startButtonHover, playAgainButton, playAgainButtonHover;

var muteButton, unmuteButton;

function setupManifest() {
	manifest = [
		{
			src: "sounds/click.mp3",
			id: "click"
		},
		{
			src: "sounds/tick.mp3",
			id: "tick"
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
			src: "images/life.png",
			id: "life"
		},
		{
			src: "images/square.png",
			id: "square"
		},
		{
			src: "images/background.png",
			id: "background"
		},
		{
			src: "images/recycle.png",
			id: "recycle"
		},
		{
			src: "images/right.png",
			id: "correct"
		},
		{
			src: "images/wrong.png",
			id: "wrong"
		},
		{
			src: "images/gameOver.png",
			id: "gameOver"
		},
		{
			src: "sounds/correct.wav",
			id: "correctSound"
		},
		{
			src: "sounds/wrong.wav",
			id: "wrongSound"
		},
		{
			src: "sounds/timeout.wav",
			id: "timeout"
		},
		{
			src: "images/playAgainButton.png",
			id: "playAgainButton"
		},
		{
			src: "images/playAgainButtonHover.png",
			id: "playAgainButtonHover"
		},
		{
			src: "images/start.png",
			id: "startButton"
		},
		{
			src: "images/startHover.png",
			id: "startButtonHover"
		},
		{
			src: "images/startBackground.png",
			id: "startBackground"
		},
		{
			src: "images/faded.png",
			id: "faded"
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
   	} else if (event.item.id == "life") {
   		life = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "square") {
   		square = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "background") {
   		background = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "recycle") {
   		recycle = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "correct") {
   		correctSplash = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "wrong") {
   		wrongSplash = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "gameOver") {
   		gameOverSplash = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "startButton") {
   		startButton = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "startButtonHover") {
   		startButtonHover = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "playAgainButton") {
   		playAgainButton = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "playAgainButtonHover") {
   		playAgainButtonHover = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "startBackground") {
   		startBackground = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "faded") {
   		faded = new createjs.Bitmap(event.result);
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

	stage.addChild(startBackground);
    stage.update();
    startGame();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS
