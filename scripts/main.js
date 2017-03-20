// courses that are added to student's schedule
var selectedCourses = {};

// courses that match current filters
var filteredCourses = {};


// filter all courses by selected filters and store that
function filterCourses() {

}

// name parameter is in the form "ACCT 202 A"
function addCourse(name) {
    // TODO: add checks for errors
    name = name.toUpperCase();
    if (!selectedCourses[name] && allCourses[name]) {
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
	//var searchStr = query.split(" ");
	console.log(query);
}

// code to execute on document ready

$(function() {
    $("#add_course_button").click(function(event) {
        addCourse($("#searchfield").val());

    });


    $("#course_codes_button").click(function (event) {
        console.log(getSelectedCourseCodes());

    });
	
	$("#searchfield").keypress(function(e) {
		if(e.which == 13) {
			searchBar($("#searchfield").val());
		}
	});
});
