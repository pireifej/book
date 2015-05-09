var key;
var private_key;
var pages = {}

var Page = (function() {
	var curr = 1;
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
			curr++;
			load_chapter(curr + 1);
			config.$bookBlock.bookblock( 'next' );
			return false;
		});

		config.$navPrev.on( 'click touchstart', function() {
			curr--;
			config.$bookBlock.bookblock( 'prev' );
			return false;
		});

		config.$navFirst.on( 'click touchstart', function() {
			curr = 1;
			config.$bookBlock.bookblock( 'first' );
			return false;
		});

		config.$navLast.on( 'click touchstart', function() {
			curr = $(".bb-item").length;
			config.$bookBlock.bookblock( 'last' );
			return false;
		});
						
		// add swipe events
		$slides.on( {
			'swipeleft' : function( event ) {
				curr++;
				load_chapter(curr + 1);
				config.$bookBlock.bookblock( 'next' );
				return false;
			},
			'swiperight' : function( event ) {
				curr--;
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
					curr--;
					config.$bookBlock.bookblock( 'prev' );
					break;
				case arrow.right:
					curr++;
					load_chapter(curr + 1);
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

$("#chapter1").click(function() {
	load_chapter(1);
	$("#bb-bookblock").bookblock("jump", 1);
});

$("#chapter2").click(function() {
	load_chapter(8);
	$("#bb-bookblock").bookblock("jump", 8);
});

$("#chapter3").click(function() {
	load_chapter(13);
	$("#bb-bookblock").bookblock("jump", 13);
});

$("#chapter4").click(function() {
	load_chapter(21);
	$("#bb-bookblock").bookblock("jump", 21);
});

$("#chapter5").click(function() {
	load_chapter(28);
	$("#bb-bookblock").bookblock("jump", 28);
});

$("#chapter6").click(function() {
	load_chapter(33);
	$("#bb-bookblock").bookblock("jump", 33);
});

$("#chapter7").click(function() {
	load_chapter(55);
	$("#bb-bookblock").bookblock("jump", 55);
});

function load_chapter(page_nbr) {
	if (pages[page_nbr] === undefined) return;
	var page = pages[page_nbr];
	if (page.loaded) return;
	for (var id = 0; id < page.id.length; id++) {
		load_image(key, private_key, "", page.id[id]);
     }
	page.loaded = true;
}

function load_image(key, private_key, dir, id) {
	var gpg_msg = $.ajax({
			type: "GET",
			url: "images/" + id + ".gpg",
			async: false
		}).responseText;

	gpg_msg = openpgp.message.readArmored(gpg_msg);
	openpgp.decryptMessage(private_key, gpg_msg).then(function(plain_text) {
		$("#" + id).attr("src", plain_text);
	}).catch(function(error) {
		alert("Decryption failed!");
		console.log("failure");
	})
}

function process_images() {
    dialog.dialog("close");

	key = $.ajax({
			type: "GET",
			url: "keys/private.gpg",
			async: false
	}).responseText;

	private_key = openpgp.key.readArmored(key).keys[0];
	private_key.decrypt($("#password").val());

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
	audio.attr("autoplay", true);
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

	load_image(key, private_key, "intro", pages[1].id);
	load_image(key, private_key, "intro", pages[2].id);
}

$(document).ready(function() {
	Page.init();

	var page = 1;
	$(".bb-item", this).each(function(index, element) {
		var children = $(element).children("img");
		if (children.length > 1) {
			var ids = [];
			for (var i = 0; i < children.length; i++) {
				ids.push($(children[i]).attr("id"));
			}
			pages[page] = {"id": ids, "loaded": false};
		} else {
			var id = $(element).children("img").attr("id");
			pages[page] = {"id": [id], "loaded": false};
		}
		page++;
	});

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