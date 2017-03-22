// courses that are added to student's schedule
var selectedCourses = {};

// courses that match current filters
var filteredCourses = {};

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
			// check if every MTWHF letter is in the Meets string of course
			var meets = cur["Meets"];
			var failed = false;
			for (var i in week) {
				if (meets.indexOf(week[i]) === -1) {
					failed = true;
					continue;
				}
			}
			if (failed) continue;
		}

		// create array if none exists
		filteredCourses[code] = filteredCourses[code] || [];
		filteredCourses[code][selector] = cur;
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
  var courseTable = document.getElementById("courseListDisplay");
  // Clear the table
  $("#courseListDisplay tr").remove();
  var tableRow = 0;

	var searchStr = query.split(" "), i;

	for(i = 0; i < searchStr.length; i++){
		console.log(searchStr[i]);
	}

  // Gets the total number of classes in the Object
  var size = Object.keys(allCourses).length;
  // Go through all the search words
  for(i=0;i<searchStr.length;i++){
    // Go through all of the classes
    Object.keys(allCourses).forEach(function(currentClass) {
      Object.keys(currentClass).forEach(function(currentClassSection) {
        // Only check the first list because the second would just be repetitive information
        if(currentClassSection === "0"){
          // Go through the indevidual class object
          Object.keys(allCourses[currentClass][currentClassSection]).forEach(function(currentClassElement) {
            var currentString = allCourses[currentClass][currentClassSection][currentClassElement];
            //currentString = toString(currentString);
            var search = searchStr[i];
            search = search.toUpperCase();
            //console.log("doing domething");
            if(currentString !== null){
              var strArray = currentString.split(" "),j;

              for(j=0;j<strArray.length;j++){
                // strArray[j].indexOf(search) !== -1 checks if the search string is contained in the current strings
                // search.trim().length > 0 ignores whitespace
                if(currentString != null && strArray[j].indexOf(search) !== -1 && search.trim().length > 0){
                  var row = courseTable.insertRow(tableRow);
                  var cell = row.insertCell(0);
                  cell.innerHTML = currentClass;
                  tableRow++;
                  addCourse(currentClass);
                  //console.log(currentClass);
                }
              }
            }
          });
        }
      });
    });
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

$(function() {
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
});
