// courses that are added to student's schedule
var selectedCourses = {};

// courses that match current filters
var filteredCourses = {};

// courses that match current search values
var searchedCourses = {};

// filter all courses by selected filters and store the resulting courses in filteredCourses
function filterCourses() {
	filteredCourses = {};

	var department = $("#department").val();
	var time = $("#time").val();
	var course = $("#course").val();
	var week = $("#week").val();

	for (var code in allCourses) {
		var selector = 0; // usually the first item is the class, other ones might be labs
		var cur = allCourses[code][selector];

		// check if section doesn't match a filter, and if so, continue to next

		if (department && department !== code.substr(0, code.indexOf(" "))) {
			continue; // go to next section
		}

		if (time) {
			if (!cur["BeginTime"]) continue;
			var sectionHour = parseInt(cur["BeginTime"].substr(0, cur["BeginTime"].indexOf(":")));

			if (time === "Morning" && sectionHour >= 12)
				continue;
			else if (time === "Afternoon" && (sectionHour < 12 || sectionHour >= 18))
				continue;
			else if (time === "Evening" && sectionHour < 18)
				continue;
		}

		if (course) {
			var courseNumber = code.substr(code.indexOf(" ") + 1, 1);
			var courseFilter = course.substr(0, 1);

			if (courseFilter !== courseNumber) continue;
		}

		if (week) {
            if (!cur["Meets"]) continue;
            var meets = cur["Meets"];
            // get extra letters from other meeting times in this section
            if (allCourses[code][1]) meets = meets + allCourses[code][1]["Meets"];
			// check if every MTWTF letter is in the Meets string

			var failed = false;
			for (var i in week) {
				if (meets.indexOf(week[i]) === -1) {
					failed = true;
					continue;
				}
			}
			if (failed) continue;
		}

        filteredCourses[code] = allCourses[code];
	}

	console.log(filteredCourses);
}

// name parameter is in the form "ACCT 202 A"
function addCourse(name) {
    // TODO: add checks for errors
    name = name.toUpperCase();
    if(selectedCourses[name]){
        console.log("Course already in list")
    }else if (!selectedCourses[name] && allCourses[name]) {
        selectedCourses[name] = allCourses[name];
    }
    else {
        // error
        console.log("Error adding '" + name + "' to selected courses");
    }
}


// name parameter is in the form "ACCT 202 A"
function removeCourse(name) {
    // This shouldn't cause errors if course doesn't exist
    delete selectedCourses[name];
}


// clear all selected courses
function clearCourses() {
    selectedCourses = {};
}


// returns an array of strings containing the course codes of currently selected courses
function getSelectedCourseCodes() {
    // TODO: actually test this
    courseCodes = [];
    for (var course in selectedCourses) {
        if (selectedCourses.hasOwnProperty(course)) {
            courseCodes.push(course);
        }
    }
    return courseCodes;
}

//search funciton
function searchBar(query) {
	var searchStr = query.split(" "), i;
	searchedCourses = {};

	// Go through all the search words
	for (i = 0; i < searchStr.length; i++) {
		for (var courseCode in filteredCourses) {
			var selector = 0; // usually the first item is the class, other ones might be labs

			for(var currentString in filteredCourses[courseCode][selector]){
				var wordSearched = searchStr[i];
				wordSearched = wordSearched.toUpperCase();

				if (filteredCourses[courseCode][selector][currentString] !== null) {
					var courseSubString = filteredCourses[courseCode][selector][currentString].split(" "), j;

					// Look through each section of the course information
					for (j = 0; j < courseSubString.length; j++) {
						if (filteredCourses[courseCode][selector][currentString] != null && courseSubString[j].indexOf(wordSearched) !== -1 && wordSearched.trim().length > 0) {
							// This is where we will add all of the HTML for the courses on the left menu
							if(!searchedCourses[courseCode]){
								searchedCourses[courseCode] = allCourses[courseCode];
							}
						}
					}
				}
			}
		}
	}
	addToTable();
}

function addToTable(){
	var courseTable = document.getElementById("courseListDisplay");
	// Clear the table
	$("#courseListDisplay tr").remove();
	var tableRow = 0;

	for(var code in searchedCourses){
		var row = courseTable.insertRow(tableRow);
		var codeCell = row.insertCell(0);
		var buttonCell = row.insertCell(1);
		codeCell.innerHTML = "<center>"+code+"</center>";
		buttonCell.innerHTML = '<center><!-- Currently attempts to add a course that exactly matches a course code from search cell --> <button type="button" id="add_course_button">Add course</button></center>';
		tableRow++;
	}
}

$(window).load(function(){
  $('div.myTableDiv').css('height', $(window).height()*'0.60');
})

$(window).resize(function() {
  //resize just happened, pixels changed
  $('div.myTableDiv').css('height', $(window).height()*'0.60');
});

// code to execute on document ready

$(function () {
	filteredCourses = allCourses;

    $("#add_course_button").click(function(event) {
        addCourse($("#searchfield").val());

    });

    $("#course_codes_button").click(function (event) {
        console.log(getSelectedCourseCodes());

    });

	$("#search_button").click(function (event) {
        searchBar($("#searchfield").val());

    });

	$("#searchfield").keypress(function(e) {
		if(e.which == 13) {
			searchBar($("#searchfield").val());
		}
	});

	$(".dropDown").change(filterCourses);
});
