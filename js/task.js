var entries= [];
var numItems = 0;


// ******************************************************** //
// 		JS Function to fix Name    							//
// 		 - Eliminates white space							//
//		 - Capiltalizes name								//
// ******************************************************** //
function toName(s) {
	// remove characters that aren't a-zA-Z
	s = s.replace( /[\s\n\r]+/g, ' ' );
	// separate all the words into an array
	var words = s.split(" ");

	var final = "";
	for (var i = 0; i < words.length; i++) {
		// set first letter of a word to uppercase
		final += words[i].charAt(0).toUpperCase() 
		if(words[i].length > 1)
			// set rest of the letters of each word to lowercase
			final += words[i].substring(1, words[i].length).toLowerCase();
		final += " ";
	}
	return final;
}

// ******************************************************** //
// 		JS Function to determine if HTML 					//
// 		 - Returns true if string contains html tags		//
// ******************************************************** //
function isHTML(str) {
	var a = document.createElement('div');
	a.innerHTML = str;
	for (var c = a.childNodes, i = c.length; i--; ) {
		if (c[i].nodeType == 1) 
			return true; 
	}
	return false;
}




// ******************************************************** //
//		JQuery Function to enable "enter" 					//
//		 - When enter hit, "add note" button clicked		//
// ******************************************************** //
$("#task_name").keyup(function(event){
	// when enter key pressed
 	if(event.keyCode == 13) {
 		// click the addItemButton
     	$("#addItemButton").click();
 	}
});
// ******************************************************** //
//		JQuery Function to enable "enter" 					//
//		 - When enter hit, "add note" button clicked		//
// ******************************************************** //
$("#task_length, #task_name").keyup(function(event){
	// when enter key pressed
 	if(event.keyCode == 13) {
 		// click the addItemButton
     	$("#addItemButton").click();
 	}
});

// ******************************************************** //
//		JQuery Function for Add Item Button 				//
//		 - When element with id="AddItemButton" clicked,	//
//			add note 										//
// ******************************************************** //
$('#addItemButton').click(function() {
	// make sure there is text in the item field
	if($('#task_name').val() == "") {
		alert("Please enter an item");
	} else if ($('#task_length').val() == "") {
		alert("Please enter an length of time");
	}
	else {
		// Remove any html or white space on input, capitalize the words
		var item = $('#task_name').val().trim();
		if(isHTML(item)) {
			item = $(item)[0].textContent;
		}
		item = toName(item).trim();

		var num_days = parseInt($('#task_length').val());

		// Append the new note to the element with id="myList"
		// $('#myList').append('<a href="#" class="list-group-item" id="note' + numItems + '" value="1" onClick="complete('+numItems+')">');
		var task_id = new Date().getTime();
		$('#myList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + task_id + '" data-comp="false"></li>');
		$('#note' + numItems).append(
			'<h4 class="list-group-item-heading">'
				// + '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>&nbsp;' 
				+ '<strong>' + item + '</strong>' 
			+ '</h4>'
			+ '<button class="btn-custom remove" type="button"><i class="fa fa-times fa-custom-x" aria-hidden="true"></i></button>' 
			+ '<input class="check" type="checkbox" aria-label="Checkbox for following text input">'
			+ '<div class="progress" data-toggle="tooltip" data-placement="bottom" title="0 out of ' + num_days + '">'
				+ '<div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>'
			+ '</div>'
		);

		// add item to list of entries
		entries.push({
			taskName: item, 
			created: task_id, 
			completed: false,
			days: num_days,
			status: 0,
			last_checked: 0,
			removed: false
		});
		// increment number of items
		numItems = numItems + 1;

		console.log("----\nAfter addition: " + numItems + " items");
		console.log(entries);
		localStorage["newTab_DailyTracker_tasks"] = JSON.stringify(entries);
		console.log(localStorage["newTab_DailyTracker_tasks"]);
		

		// Reset input boxes
		$('#task_name').val('');
		$('#task_length').val('');
		$('#task_name').focus();
	}
});

function isSameDay(d1, d2) {
	d1 = new Date(d1);
	d2 = new Date(d2);
	return d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate();
}

// ******************************************************** //
// 		jQuery Function to change stylings when li clicked	//
// 		 - Checked off and change color						//
// ******************************************************** //
$('ul').delegate('.check', 'click', function () {
	$listElem = $(this).parent();
	var i = -1;
	var entry = entries.filter((e, index) => {
		if (e.created == $listElem.attr('value')) {
			i = index;
			return e;
		}
	});
	// if it wasn't checked today, then check and track progress
	if ($(this).is(':checked') && !isSameDay(entries[i].last_checked, new Date().getTime()) && !entries[i].completed) {
		console.log('check activated')
		entries[i].last_checked = new Date().getTime();
		entries[i].status += 1;
		// deactivate checkbox, update progress bar
		// $(this).attr('disabled', true);
		console.log(entries[i])
		progress = parseFloat((entries[i].status/entries[i].days) * 100)
		$listElem.find('.progress').css('height', '2px')
		$listElem.find('.progress').attr('title', entries[i].status + ' out of ' + entries[i].days)
		$listElem.find('.progress-bar').attr('aria-valuenow', progress)
		$listElem.find('.progress-bar').css('width', progress + '%')
		// task completed
		if (entries[i].status == entries[i].days) {
			entries[i].completed = true;
			$listElem.data("comp", true);
			$listElem.appendTo('#otherList');
			$(this).remove()
			$('#completed_wrap').removeClass('d-none');
		}
	} else {
		console.log('check deactivated')
		console.log(entries[i])

		entries[i].last_checked = 0 // can't be today
		entries[i].status = (entries[i].status <= 0 ) ? 0 : entries[i].status-1;
		progress = parseFloat((entries[i].status/entries[i].days) * 100)
		$listElem.find('.progress').attr('title', entries[i].status + ' out of ' + entries[i].days)
		$listElem.find('.progress-bar').attr('aria-valuenow', progress)
		$listElem.find('.progress-bar').css('width', progress + '%')
	}

	localStorage["newTab_DailyTracker_tasks"] = JSON.stringify(entries);
	calculateCompletionRate()
});

// ******************************************************** //
// 		jQuery Function to remove an li element 			//
// 		 - x icon											//
// ******************************************************** //
$('ul').delegate('.remove', 'click', function () {
	for (var i = 0; i < entries.length; i++) {
		if (entries[i].created == $(this).parent().attr('value')) {
			entries[i].removed = true;
			entries.splice(i, 1);
			console.log("----\nAfter remove:");
			console.log(entries);
			break;
		}
	}
	localStorage["newTab_DailyTracker_tasks"] = JSON.stringify(entries);
	console.log(localStorage["newTab_DailyTracker_tasks"]);
	$(this).parent().remove();
	calculateCompletionRate()
});

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
function tick() {
	// console.log("!");
    var d = new Date();
    var amPm = (d.getHours() >= 12) ? 'PM' : 'AM';
    var hours = (d.getHours() > 12) ? d.getHours() - 12 : d.getHours();
    var time = hours + ':' + ((d.getMinutes()<10?'0':'') + d.getMinutes()) + ' ' + amPm;
    $('#time').html(time);
    var date = days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    $('#date').html(date);
    t = setTimeout(tick,5000);
}

function timeConvert(milli) {
    var seconds = (milli / 1000).toFixed(1);
    var minutes = (milli / (1000 * 60)).toFixed(1);
    var hours = (milli / (1000 * 60 * 60)).toFixed(1);
    var days = (milli / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return hours + " Hrs";
    } else {
        return days + " Days"
    }
}

function getShortDate(d) {
	d = new Date(d)
	return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function calculateCompletionRate() {
	var time_diff = 0
	var month_year = []
	var first_created = new Date().getTime(),
		last_created = 0
		// last_completed = 0;
	for (var i = 0; i < entries.length; i++) {
		// if (entries[i].completed > 0) {
		// 	time_diff += (entries[i].completed - entries[i].created); // completed - created
		// }
		if (entries[i].created < first_created) { first_created = entries[i].created; }
		if (entries[i].created >= last_created) { last_created = entries[i].created; }
		// if (entries[i].completed > last_completed) { last_completed = entries[i].created; }
	}
	time_diff /= entries.length; // average time to complete a task
	
	analysis_html = ''
	analysis_arr = [
		{name: 'Avg. Completion Time:', id: 'completion_time', data: (time_diff == 0) ? '' : timeConvert(time_diff)},
		// {name: 'Completion Rate:', id: 'completion_rate', data: time_rate},
		{name: 'First Task Created:', id: 'first_created', data: (first_created == 0) ? '' : getShortDate(first_created)},
		{name: 'Last Task Created:', id: 'last_created', data: (last_created == 0) ? '' : getShortDate(last_created)},
		// {name: 'Last Task Completed:', id: 'last_completed', data: (last_completed == 0) ? '' : getShortDate(last_completed)},
	]
	for (i = 0; i < analysis_arr.length; i++) {
		if (analysis_arr[i].data != '') {
			analysis_html += 
				'<div class="col-sm-3 col-xs-6">'
					+ '<h5 class="product">' + analysis_arr[i].name + '</h5>'
					+ '<p class="product" id="' + analysis_arr[i].id + '">' + analysis_arr[i].data + '</p>'
				+ '</div>'
		}
	}
	$('#analysis').html(analysis_html)	
}

$('.btn-checkmark').click(function() {
	$(this).data('checked', !$(this).data('checked'))
	if ($(this).data('checked')) {
		// if now checked
		$(this).removeClass('checkmark-empty')
		$(this).addClass('checkmark-checke'd)

	} else {
		// if now un-checked
	}
})

$(document).ready(function () {
	tick();

	if (localStorage["newTab_DailyTracker_tasks"] != null && localStorage["newTab_DailyTracker_tasks"] != "") {
		entries = JSON.parse(localStorage["newTab_DailyTracker_tasks"]);
	}
	// entries = [["help", "idk", 1], ["vir", "thakor", 2]];
	for (var i = 0; i < entries.length; i++) {
		if (!entries[i].removed && entries[i].completed == false) {
			progress = parseFloat((entries[i].status/entries[i].days) * 100)
			isChecked = isSameDay(new Date().getTime(), entries[i].last_checked)

			$('#myList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + entries[i].created + '" data-comp="false"></li>');
			$('#note' + numItems).append(
				'<h4 class="list-group-item-heading">'
					// + '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>&nbsp;' 
					+ '<strong>' + entries[i].taskName + '</strong>' 
				+ '</h4>'
				+ '<button class="btn-custom remove" type="button"><i class="fa fa-times fa-custom-x" aria-hidden="true"></i></button>' 
				+ '<input class="check" type="checkbox" aria-label="Checkbox for following text input" ' + (isChecked ? 'checked' : '') + '>'
				+ '<div class="progress" data-toggle="tooltip" data-placement="bottom" title="' + entries[i].status + ' out of ' + entries[i].days + '">'
					+ '<div class="progress-bar" role="progressbar" style="width: ' + progress + '%;" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100"></div>'
				+ '</div>'
			);
		} else if (!entries[i].removed && entries[i].completed == true) {
			progress = parseFloat((entries[i].status/entries[i].days) * 100);
			isChecked = isSameDay(new Date().getTime(), entries[i].last_checked);
			$('#completed_wrap').removeClass('d-none');

			$('#otherList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + entries[i].created + '" data-comp="true"></li>');
			$('#note' + numItems).append(
				'<h4><strong>' + entries[i].taskName + '</strong></h4>'
				+ '<button class="btn-custom remove" type="button"><i class="fa fa-times fa-custom-x" aria-hidden="true"></i></button>' 
				+ '<p>' + entries[i].status + ' / ' + entries[i].days + ' on ' + getShortDate(entries[i].last_checked) + '</p>'

				// + '<input class="check" type="checkbox" aria-label="Checkbox for following text input" ' + (isChecked ? 'checked disabled' : '') + '>'
				+ '<div class="progress" style="height: 2px;">'
					+ '<div class="progress-bar" role="progressbar" style="width: ' + progress + '%;" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100"></div>'
				+ '</div>'
			);
		}
		numItems++;
	}
	console.log("----\nAfter load: " + numItems + " items");
	console.log(entries);

	calculateCompletionRate()
});
