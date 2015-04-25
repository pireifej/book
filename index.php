<?php

<!DOCTYPE html>
<html lang="en" class="no-js demo-1">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
		<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
		<title>Mother's Day 2015</title>
		<meta name="description" content="Mother's Day 2015 for mother of Gabriel Ireifej" />
		<meta name="keywords" content="ireifej, love, mother, mother's, day, dongyu, lin, gabriel, baby" />
		<meta name="author" content="Paul Ireifej" />
		<link rel="stylesheet" type="text/css" href="css/default.css" />
		<link rel="stylesheet" type="text/css" href="css/bookblock.css" />
		<!-- custom demo style -->
		<link rel="stylesheet" type="text/css" href="css/demo1.css" />
		<script src="js/modernizr.custom.js"></script>
	</head>
	<body>
		<div class="container">
			<header>
				<h1>Mother's Day 2015 <span>A Story About Love</span></h1>	
			</header>
			<div class="main clearfix">
				<div class="bb-custom-wrapper">
					<h3>Mother & Baby Unite</h3>
					<audio controls autoplay>
						<source src="images/demo1/song.mp3" type="audio/mpeg">
						Your browser does not support the audio element.
					</audio>
					<div id="bb-bookblock" class="bb-bookblock">
						<div class="bb-item">
							<a><img src="images/demo1/title.jpg"/></a>
							<br><div class="caption">Once upon a time...</div>
						</div>
						<div class="bb-item">
							<a><img src="images/demo1/mother.jpg"/></a>
							<br><div class="caption">There was a baby</div>
							<a><img src="images/demo1/mother.jpg"/></a>
						</div>
					</div>
					<nav>
						<a id="bb-nav-first" href="#" class="bb-custom-icon bb-custom-icon-first">First page</a>
						<a id="bb-nav-prev" href="#" class="bb-custom-icon bb-custom-icon-arrow-left">Previous</a>
						<a id="bb-nav-next" href="#" class="bb-custom-icon bb-custom-icon-arrow-right">Next</a>
						<a id="bb-nav-last" href="#" class="bb-custom-icon bb-custom-icon-last">Last page</a>
					</nav>
				</div>
			</div>
		</div><!-- /container -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<script src="js/jquerypp.custom.js"></script>
		<script src="js/jquery.bookblock.js"></script>
		<script src="js/app.js"></script>
		<script>
			var Page = (function() {
				
				var config = {
						$bookBlock : $( '#bb-bookblock' ),
						$navNext : $( '#bb-nav-next' ),
						$navPrev : $( '#bb-nav-prev' ),
						$navFirst : $( '#bb-nav-first' ),
						$navLast : $( '#bb-nav-last' )
					},
					init = function() {
						config.$bookBlock.bookblock( {
							speed : 800,
							shadowSides : 0.8,
							shadowFlip : 0.7
						} );
						initEvents();
					},
					initEvents = function() {
						
						var $slides = config.$bookBlock.children();

						// add navigation events
						config.$navNext.on( 'click touchstart', function() {
							config.$bookBlock.bookblock( 'next' );
							return false;
						} );

						config.$navPrev.on( 'click touchstart', function() {
							config.$bookBlock.bookblock( 'prev' );
							return false;
						} );

						config.$navFirst.on( 'click touchstart', function() {
							config.$bookBlock.bookblock( 'first' );
							return false;
						} );

						config.$navLast.on( 'click touchstart', function() {
							config.$bookBlock.bookblock( 'last' );
							return false;
						} );
						
						// add swipe events
						$slides.on( {
							'swipeleft' : function( event ) {
								config.$bookBlock.bookblock( 'next' );
								return false;
							},
							'swiperight' : function( event ) {
								config.$bookBlock.bookblock( 'prev' );
								return false;
							}
						} );

						// add keyboard events
						$( document ).keydown( function(e) {
							var keyCode = e.keyCode || e.which,
								arrow = {
									left : 37,
									up : 38,
									right : 39,
									down : 40
								};

							switch (keyCode) {
								case arrow.left:
									config.$bookBlock.bookblock( 'prev' );
									break;
								case arrow.right:
									config.$bookBlock.bookblock( 'next' );
									break;
							}
						} );
					};

					return { init : init };

			})();
		</script>
		<script>
				Page.init();
		</script>
	</body>
</html>

?>