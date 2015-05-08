var img_count = $("img").length;
var percentage = 0;
var progress = 0;
var dialog;

var Page = (function() {
	var config = {
		$bookBlock: $("#bb-bookblock"),
		$navNext: $("#bb-nav-next"),
		$navPrev: $("#bb-nav-prev"),
		$navFirst: $("#bb-nav-first"),
		$navLast: $("#bb-nav-last")
	},
	init = function() {
		config.$bookBlock.bookblock( {
			speed : 800,
			shadowSides : 0.8,
			shadowFlip : 0.7
		});
		initEvents();
	},
	initEvents = function() {
		var $slides = config.$bookBlock.children();

		// add navigation events
		config.$navNext.on( 'click touchstart', function() {
			config.$bookBlock.bookblock( 'next' );
			return false;
		});

		config.$navPrev.on( 'click touchstart', function() {
			config.$bookBlock.bookblock( 'prev' );
			return false;
		});

		config.$navFirst.on( 'click touchstart', function() {
			config.$bookBlock.bookblock( 'first' );
			return false;
		});

		config.$navLast.on( 'click touchstart', function() {
			config.$bookBlock.bookblock( 'last' );
			return false;
		});
						
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
		});

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
		});
	};
	return { init : init };
})();

function exists(assoc_array, key) {
	return (typeof assoc_array[key] != "undefined" && assoc_array[key] != "");
}

function send_ajax_wrapper(ajax_data, function_ptr) {
	var my_data = send_ajax(ajax_data);
	my_data
		.done(function(data) {
			//console.log(ajax_data.command_name + " success");
			//console.log(data);
			if (function_ptr != "") {
				window[function_ptr](data);
			}
		})
		.fail(function(data) {
			console.log(ajax_data.command_name + " failure");
			console.log(data);
			alert("Error - " + data.responseText);
		});
}

function send_ajax(ajax_data) {
    if (!exists(ajax_data, "command_name")) {
		console.log("Error - send_ajax requires command_name!");
		return;
	}
	return $.ajax({
			type: "GET",
				url: "cgi-bin/ajax.cgi",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: ajax_data,
				statusCode: {
				404: function() {
					console.log("404 error code - page not found!\n");
				},
				500: function() {
					console.log("500 error code - time out!\n");
				},
				200: function() {
					console.log("200 error code - response OK!\n");
				}
			}
		});
}

function init_node_groups(data) {
	console.log("All done!");
	console.log(data);
}

$("#chapter1").click(function() {
	$("#bb-bookblock").bookblock("jump", 1);
});

$("#chapter2").click(function() {
	$("#bb-bookblock").bookblock("jump", 8);
});

$("#chapter3").click(function() {
	$("#bb-bookblock").bookblock("jump", 13);
});

$("#chapter4").click(function() {
	$("#bb-bookblock").bookblock("jump", 21);
});

$("#chapter5").click(function() {
	$("#bb-bookblock").bookblock("jump", 28);
});

$("#chapter6").click(function() {
	$("#bb-bookblock").bookblock("jump", 33);
});

$("#chapter7").click(function() {
	$("#bb-bookblock").bookblock("jump", 55);
});

function update_progress() {
	progress++;
	percentage = (progress / img_count) * 100;
	console.log(percentage);
	$("#progress").text(percentage + "%");
}

function load_image(key) {
	var private_key = openpgp.key.readArmored(key).keys[0];
	private_key.decrypt($("#password").val());
	var my_dir = "images/data";
	var ireifej = "";
	ireifej += $.ajax({
			type: "GET",
               url: "images/xaa",
			async: false
		}).responseText;
	ireifej += $.ajax({
			type: "GET",
               url: "images/xab",
			async: false
		}).responseText;
	ireifej += $.ajax({
			type: "GET",
               url: "images/xac",
			async: false
		}).responseText;
	ireifej += $.ajax({
			type: "GET",
               url: "images/xad",
			async: false
		}).responseText;
	ireifej += $.ajax({
			type: "GET",
               url: "images/xae",
			async: false
		}).responseText;
 
	//$.getJSON(my_dir, function(data) {
	var data = JSON.parse(ireifej);
		for (var key in data) {
			var gpg_msg = data[key];
			gpg_msg = gpg_msg.join("\n");
			gpg_msg = openpgp.message.readArmored(gpg_msg);
			openpgp.decryptMessage(private_key, gpg_msg).then(function(key, plain_text) {
				$("#" + key).attr("src", plain_text);
			}.bind(null, key)).catch(function(error) {
				alert("Decryption failed!");
				console.log("failure");
			});
		}
          //});
}

function process_images() {
    dialog.dialog("close");

	var songs = ["songs/01.mp3",
                  "songs/02.mp3",
                  "songs/03.mp3",
                  "songs/04.mp3",
                  "songs/05.mp3",
                  "songs/06.mp3",
                  "songs/07.mp3",
                  "songs/08.mp3",
                  "songs/09.mp3",
                  "songs/10.mp3",
                  "songs/11.mp3",
                  "songs/12.mp3",
                  "songs/13.mp3",
                  "songs/14.mp3",
	];
	var i = 1;
	var audio = $("#music");
	audio.attr("src", "songs/01.mp3");
	audio.on("ended", function() {
		// reset play list
		if (i >= songs.length) {
			i = 0;
		}
		console.log("Playing next track " + songs[i] + "...");
		audio.attr("src", songs[i]);
		i++;
	});

	var key = $.ajax({
				type: "GET",
				url: "keys/private.gpg",
				async: false
			}).responseText;

	load_image(key);
	//$("#progress").text("Done");
}

$(document).ready(function() {
	Page.init();

    dialog = $( "#dialog-form" ).dialog({
		autoOpen: true,
		height: 250,
		width: 300,
		modal: true,
		buttons: {
			"Start": process_images,
		}
	});
});