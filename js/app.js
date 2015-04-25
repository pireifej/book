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

$(document).ready(function() {
	var ajax_data = {
		command_name : "test"
	};
	send_ajax_wrapper(ajax_data, "init_node_groups");
});