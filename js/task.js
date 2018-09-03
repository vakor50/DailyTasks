var entries= [];
var numItems = 0;


// ******************************************************** //
// 		Edit string to capitalize every word 				//
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
//		Add Item Button triggered by "enter" key			//
// ******************************************************** //
$("#task_length, #task_name").keyup(function(event){
	// when enter key pressed
 	if(event.keyCode == 13) {
 		// click the addItemButton
     	$("#addItemButton").click();
 	}
});

// ******************************************************** //
//		Add Item Button 					 				//
//		 - When element with id="AddItemButton" clicked,	//
//			add note 										//
// ******************************************************** //
$('#addItemButton').click(function() {
	// make sure there is text in the item field
	$('#task_name').removeClass('is-invalid');
	$('#task_length').removeClass('is-invalid');
	if ($('#task_name').val() == "") {
		$('.invalid-feedback').text('Please enter a task name.');
		$('#task_name').addClass('is-invalid');
		$('#task_name').focus();
		return;
	} else if ($('#task_length').val() == "") {
		$('.invalid-feedback').text('Please enter a length of time.');
		$('#task_length').addClass('is-invalid');
		$('#task_length').focus();
		return;
	} else if ($('#task_length').val() > 100 || $('#task_length').val() < 1) {
		$('.invalid-feedback').text('Please enter a length of time between 1 and 100 days.');
		$('#task_length').val('');
		$('#task_length').addClass('is-invalid');
		$('#task_length').focus();
		return;
	} else {
		$('#task_name').removeClass('is-invalid');
		$('#task_length').removeClass('is-invalid');

		// Remove any html or white space on input, capitalize the words
		var item = $('#task_name').val().trim();
		if(isHTML(item)) {
			item = $(item)[0].textContent;
		}
		item = toName(item).trim();

		var num_days = parseInt($('#task_length').val());

		var progress_ticks_html = ''
		for (var j = 0; j < num_days-1; j++) {
			progress_ticks_html += '<div class="progress-bar progress-tick" role="progressbar" '
			+ 'style="width: ' + parseFloat((1/num_days) * 100) + '%;" '
			+ 'aria-valuenow="' + parseFloat((1/num_days) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div>'
		}

		// Append the new note to the element with id="myList"
		// $('#myList').append('<a href="#" class="list-group-item" id="note' + numItems + '" value="1" onClick="complete('+numItems+')">');
		var task_id = new Date().getTime();
		$('#myList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + task_id + '" data-comp="false"></li>');
		$('#note' + numItems).append(
			'<h4 class="list-group-item-heading">'
				// + '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>&nbsp;' 
				+ '<strong>' + item + '</strong>' 
			+ '</h4>'
			+ '<button class="btn btn-remove remove" type="button" '
				+ 'data-toggle="popover" data-placement="top" data-trigger="focus" title >'
				+ '<i class="fa fa-times fa-custom-x" aria-hidden="true"></i></button>' 
			+ '<button type="button" class="btn btn-checkmark empty" data-checked="0"><i class="fa fa-check fa-custom-x" aria-hidden="true"></i></button>'
			+ '<p class="description">Created ' + getShortDate(task_id) + '</p>'
			+ '<div class="progress" data-toggle="tooltip" data-placement="bottom" title="0 out of ' + num_days + ' days">'
				+ '<div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>'
				+ progress_ticks_html
			+ '</div>'
		);

		$('.remove').popover({
			animation: true,
			content: popupElement,
			html: true
		});
        $('.popover-dismiss').popover({trigger: 'focus'}); 

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

// ******************************************************** //
// 		 Toggle the arrow icon on 'Add Task' button			//
// ******************************************************** //
$('#addTaskContainer').click(function () {
	if ($(this).attr('aria-expanded') == "true") {
		$(this).find('i').removeClass('fa-sort-up')
		$(this).find('i').addClass('fa-sort-down')
	} else {
		$(this).find('i').removeClass('fa-sort-down')
		$(this).find('i').addClass('fa-sort-up')
	}
})

// ******************************************************** //
// 		Delete task 										//
// ******************************************************** //
var popupElement = '<div class="btn-group btn-toggle">'
						+ 'Are you sure you want to delete the task?'
						+ '<button class="btn btn-sm btn-primary active verify-remove">Delete</button>'
					+ '</div>';
$('body').delegate('.verify-remove', 'click', function () {
	console.log('verified remove')

	pop_id = $('.popover').attr('id')
	$rmvBtn = $('.remove[aria-describedby="'+ pop_id +'"]')

	for (var i = 0; i < entries.length; i++) {
		if (entries[i].created == $rmvBtn.parent().attr('value')) {
			entries[i].removed = true;
			entries.splice(i, 1);
			console.log("----\nAfter remove:");
			console.log(entries);
			break;
		}
	}

	localStorage["newTab_DailyTracker_tasks"] = JSON.stringify(entries);
	console.log(localStorage["newTab_DailyTracker_tasks"]);
	$rmvBtn.parent().remove();

	if ($('#otherList > li').length == 0) {
		$('#completed_wrap').addClass('d-none')
	}
})

// $('ul').delegate('.remove', 'click', function () {
// });

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
// ******************************************************** //
// 		Update the date every minute 	 		 			//
// ******************************************************** //
function tick() {
	// console.log("!");
    var d = new Date();
    var amPm = (d.getHours() >= 12) ? 'PM' : 'AM';
    var hours = (d.getHours() > 12) ? d.getHours() - 12 : d.getHours();
    var time = hours + ':' + ((d.getMinutes()<10?'0':'') + d.getMinutes()) + ' ' + amPm;
    $('#time').html(time);
    var date = days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    $('#date').html(date);
    t = setTimeout(tick,1000);
}

// ******************************************************** //
// 		Convert integer datetime to days, hrs, mins, sec	//
// ******************************************************** //
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

// ******************************************************** //
// 		Print date as just month day, year 					//
// ******************************************************** //
function getShortDate(d) {
	d = new Date(d)
	return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

// ******************************************************** //
// 		Print date as just month day, year 					//
// ******************************************************** //
$('#myList').delegate('li>.btn-checkmark', 'click', function() {
	$(this).data('checked', !$(this).data('checked'));

	$listElem = $(this).parent();
	var i = -1;
	var entry = entries.filter((e, index) => {
		if (e.created == $listElem.attr('value')) {
			i = index;
			return e;
		}
	});
	
	// Handle check mark activation / deactivation
	if ($(this).data('checked') && !isSameDay(entries[i].last_checked, new Date().getTime()) && !entries[i].completed) {
		console.log('check activated')
		// change check mark appearance
		$(this).removeClass('empty')

		// change entry data
		entries[i].last_checked = new Date().getTime();
		entries[i].status += 1;

		// update progress bar
		progress = parseFloat((entries[i].status/entries[i].days) * 100)
		$listElem.find('.progress').attr('title', entries[i].status + ' out of ' + entries[i].days + ' days')
		$listElem.find('.progress-bar').attr('aria-valuenow', progress)
		$listElem.find('.progress-bar').css('width', progress + '%')
		// if task completed
		if (entries[i].status == entries[i].days) {
			entries[i].completed = true;
			$listElem.data("comp", true);
			$listElem.appendTo('#otherList');
			$(this).remove()
			$listElem.find('.description').text(
				entries[i].status + ' / ' + entries[i].days + ' on ' + getShortDate(entries[i].last_checked)
			)
			$('#completed_wrap').removeClass('d-none');
		}
	} else {
		// if now un-checked
		$(this).addClass('empty')

		// change entry data
		entries[i].last_checked = 0 // can't be today
		entries[i].status = (entries[i].status <= 0 ) ? 0 : entries[i].status-1;
		
		// update progress bar
		progress = parseFloat((entries[i].status/entries[i].days) * 100)
		$listElem.find('.progress').attr('title', entries[i].status + ' out of ' + entries[i].days + ' days')
		$listElem.find('.progress-bar').attr('aria-valuenow', progress)
		$listElem.find('.progress-bar:not(.progress-tick)').css('width', progress + '%')
	}

	console.log(entries)
	// Update local storage
	localStorage["newTab_DailyTracker_tasks"] = JSON.stringify(entries);
})

// ******************************************************** //
// 		Are two dates on the same day?  					//
// 		Optionally add N days to the first date 			//
// ******************************************************** //
function isSameDay(one, two, increment = 0) {
	var temp1 = new Date(one),
		d1 = new Date(temp1.setDate(temp1.getDate() + increment)),
		d2 = new Date(two);

	return d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate();
}


$(document).ready(function () {
	$(function () {
		$('[data-toggle="popover"]').popover()
	})
	$('.popover-dismiss').popover({
		trigger: 'focus'
	})
	tick();

	var num_completed_tasks = 0;
	var num_active_tasks = 0;
	var day_missed = false;
	var today = new Date();
	var max_ten_streak = -1;

	if (localStorage["newTab_DailyTracker_tasks"] != null && localStorage["newTab_DailyTracker_tasks"] != "") {
		entries = JSON.parse(localStorage["newTab_DailyTracker_tasks"]);
	}

	for (var i = 0; i < entries.length; i++) {
		// check if one day missed
		// if ( not completed && NOT (created today OR checked yesterday OR checked today)
		if (!entries[i].completed && !(isSameDay(entries[i].created, today.getTime()) || isSameDay(entries[i].last_checked, today.getTime(), 1) || isSameDay(entries[i].last_checked, today.getTime()))) {
			day_missed = true;
			entries[i].status = 0;
			entries[i].last_checked = 0;
			localStorage["newTab_DailyTracker_tasks"] = JSON.stringify(entries);			
		} else if (entries[i].status % 10 == 0 && entries[i].status > 0) {
			if (max_ten_streak == -1 || entries[max_ten_streak] % 10 < entries[i].status % 10) {
				max_ten_streak = i;
			}
		}

		if (!entries[i].removed && !entries[i].completed) {
			num_active_tasks++;
			progress = parseFloat((entries[i].status/entries[i].days) * 100)
			isChecked = isSameDay(new Date().getTime(), entries[i].last_checked)
	
			var progress_ticks_html = ''
			for (var j = 0; j < (entries[i].days - entries[i].status); j++) {
				progress_ticks_html += '<div class="progress-bar progress-tick" role="progressbar" '
				+ 'style="width: ' + parseFloat((1/entries[i].days) * 100) + '%;" '
				+ 'aria-valuenow="' + parseFloat((1/entries[i].days) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div>'
			}

			$('#myList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + entries[i].created + '" data-comp="false"></li>');
			$('#note' + numItems).append(
				'<h4 class="list-group-item-heading">'
					+ '<strong>' + entries[i].taskName + '</strong>' 
				+ '</h4>'
				+ '<button class="btn btn-remove remove" type="button" '
					+ 'data-toggle="popover" data-placement="top" data-trigger="focus" title >'
					+ '<i class="fa fa-times fa-custom-x" aria-hidden="true"></i></button>' 
				+ '<button type="button" class="btn btn-checkmark '+ (isChecked ? '' : 'empty') +'" data-checked="'+ (isChecked ? true : false) +'"><i class="fa fa-check fa-custom-x" aria-hidden="true"></i></button>'
				+ '<p class="description">Created ' + getShortDate(entries[i].created) + '</p>'
				+ '<div class="progress" data-toggle="tooltip" data-placement="bottom" title="' + entries[i].status + ' out of ' + entries[i].days + ' days">'
					+ '<div class="progress-bar" role="progressbar" style="width: ' + progress + '%;" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100"></div>'
					+ progress_ticks_html
				+ '</div>'
			);


		} else if (!entries[i].removed && entries[i].completed == true) {
			num_completed_tasks++;
			progress = parseFloat((entries[i].status/entries[i].days) * 100);
			isChecked = isSameDay(new Date().getTime(), entries[i].last_checked);
			$('#completed_wrap').removeClass('d-none');

			$('#otherList').append('<li class="list-group-item task" id="note' +numItems+ '" value="' + entries[i].created + '" data-comp="true"></li>');
			$('#note' + numItems).append(
				'<h4><strong>' + entries[i].taskName + '</strong></h4>'
				+ '<button class="btn btn-remove remove" type="button" '
					+ 'data-toggle="popover" data-placement="top" data-trigger="focus" title >'
					+ '<i class="fa fa-times fa-custom-x" aria-hidden="true"></i></button>' 
				+ '<p>' + entries[i].status + ' / ' + entries[i].days + ' on ' + getShortDate(entries[i].last_checked) + '</p>'
				+ '<div class="progress">'
					+ '<div class="progress-bar" role="progressbar" style="width: ' + progress + '%;" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100"></div>'
				+ '</div>'
			);
		}

        $('.remove').popover({
			animation: true,
			content: popupElement,
			html: true
		});
        $('.popover-dismiss').popover({trigger: 'focus'}); 

		numItems++;
	}
	console.log("----\nAfter load: " + numItems + " items");
	console.log(entries);


	if (num_active_tasks == 0) {
		$('#title-message').text('Add a task to get started!')
	} else if (day_missed) {
		$('#title-message').text('Looks like you missed a day towards one of your goals, but that\'s okay, today is the day to start again!')
	} else if (max_ten_streak >= 0) {
		$('#title-message').text(entries[max_ten_streak].status + ' days completed from your goal of ' + entries[max_ten_streak].taskName + '! Keep it up!')
	}
});
