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

function load_image(dir, id, key) {
	var private_key = openpgp.key.readArmored(key).keys[0];
	private_key.decrypt($("#password").val());

	var my_dir = "images/" + dir + "/" + id + ".gpg";
	$.get(my_dir, function(data) {
		var gpg_msg = data;
		gpg_msg = openpgp.message.readArmored(gpg_msg);
		openpgp.decryptMessage(private_key, gpg_msg).then(function(plain_text) {
			$("#" + id).attr("src", plain_text);
			//update_progress();
		}).catch(function(error) {
			alert("Decryption failed!");
			console.log("failure");
		});
	});
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

	load_image("intro", "116", key);
	load_image("intro", "2", key);
	load_image("intro", "3", key);
	load_image("intro", "4", key);
	load_image("intro", "5", key);
	load_image("intro", "6", key);
	load_image("intro", "83", key);
	load_image("multitasking", "9", key);
	load_image("multitasking", "11", key);
	load_image("multitasking", "51", key);
	load_image("multitasking", "56", key);
	load_image("multitasking", "57", key);
	load_image("multitasking", "115", key);
	load_image("multitasking", "115", key);
	load_image("eating", "28", key);
	load_image("eating", "34", key);
	load_image("eating", "68", key);
	load_image("eating", "106", key);
	load_image("eating", "50", key);
	load_image("eating", "118", key);
	load_image("eating", "124", key);
	load_image("eating", "128", key);
	load_image("eating", "33", key);
	load_image("eating", "75", key);
	load_image("eating", "76", key);
	load_image("sleeping", "131", key);
	load_image("sleeping", "15", key);
	load_image("sleeping", "12", key);
	load_image("sleeping", "139", key);
	load_image("sleeping", "120", key);
	load_image("sleeping", "84", key);
	load_image("sleeping", "14", key);
	load_image("sleeping", "140", key);
	load_image("birthdays", "111", key);
	load_image("birthdays", "22", key);
	load_image("birthdays", "25", key);
	load_image("birthdays", "27", key);
	load_image("birthdays", "110", key);
	load_image("birthdays", "135", key);
	load_image("birthdays", "136", key);
	load_image("fun", "114", key);
	load_image("fun", "133", key);
	load_image("fun", "24", key);
	load_image("fun", "82", key);
	load_image("fun", "40", key);
	load_image("fun", "48", key);
	load_image("fun", "55", key);
	load_image("fun", "35", key);
	load_image("fun", "38", key);
	load_image("fun", "63", key);
	load_image("fun", "92", key);
	load_image("fun", "94", key);
	load_image("fun", "95", key);
	load_image("fun", "93", key);
	load_image("fun", "104", key);
	load_image("fun", "100", key);
	load_image("fun", "129", key);
	load_image("fun", "123", key);
	load_image("fun", "127", key);
	load_image("fun", "101", key);
	load_image("fun", "90", key);
	load_image("fun", "77", key);
	load_image("fun", "67", key);
	load_image("fun", "32", key);
	load_image("fun", "65", key);
	load_image("end", "113", key);
	load_image("end", "72", key);
	load_image("end", "37", key);
	load_image("end", "130", key);
	load_image("end", "112", key);
	load_image("end", "89", key);
	load_image("end", "125", key);
	load_image("end", "10", key);
	load_image("end", "71", key);
	load_image("end", "119", key);
	load_image("end", "108", key);
	load_image("end", "7", key);
	load_image("end", "73", key);
	load_image("end", "98", key);
	load_image("end", "poem1", key);
	load_image("end", "poem2", key);
	load_image("end", "47", key);
	load_image("end", "17", key);
	load_image("end", "102", key);
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