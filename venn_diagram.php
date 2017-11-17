<!DOCTYPE html>
<html>
<head>
	<title>BCLN - <?=$_GET['title']?></title>
	<meta charset="utf-8"/>
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Lato"><!-- google web font -->
	<link rel="stylesheet" type="text/css" href="style/style.css"/>
	<link rel="shortcut icon" href="images/favicon.ico"/>
	<script src="https://bclearningnetwork.com/lib/jquery/jquery-3.1.0.min.js"></script>
	<script src="https://bclearningnetwork.com/lib/createjs/createjs-2015.11.26.min.js"></script><!-- CreateJS library hosted on BCLN server -->
	<script src="lib/ndgmr.Collision.js"></script>

	<script>
		var questions = [];
		var questionsPerLevel;
		var customStartText;

		$.getJSON("versions/<?=$_GET['title']?>/questions.json", function(questions_json) {
				questions = questions_json;
		});
		$.getJSON("versions/<?=$_GET['title']?>/data.json", function(data_json) {
				customStartText = data_json[0].startText;
				questionsPerLevel = data_json[0].questionsPerLevel;
		});

	</script>



	<script type="text/javascript" src="helper.js"></script><!-- contains helper functions which do not call functions in balloon.js -->
	<script type="text/javascript" src="venn_diagram.js"></script><!-- the main game JS file -->
</head>
<body onload="init();"><!-- body onload calls function to initialize game -->

	<canvas id="gameCanvas" width="650" height="480">
		<!-- game will be rendered here -->
	</canvas>

</body>
</html>
