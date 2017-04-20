// courses that are added to student's schedule
var selectedCourses = {};

// courses that match current filters
var filteredCourses = {};

// courses that match current search values
var searchedCourses = {};

// points to full calendar DOM element
var calendar;

// quick utility function to pad numbers with 0's on the left
function pad(num, size) { return ('000000000' + num).substr(-size); }

// preset colors that courses can have
var colors = ["Blue", "BlueViolet", "CornflowerBlue", "DarkBlue", "DarkCyan", "DarkMagenta", "DodgerBlue", "Indigo", "LightSeaGreen", "RoyalBlue", "Teal"]


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

        // department filtering
        if (department && department !== code.substr(0, code.indexOf(" "))) {
            continue; // go to next section
        }

        // time of day filtering
        if (time) {
            // if course does not have a time (e.g. internship) don't show it
            if (!cur["BeginTime"]) continue;

            // get only the hour from the time string, and parse to int
            var sectionHour = parseInt(cur["BeginTime"].substr(0, cur["BeginTime"].indexOf(":")));

            // check if hour time matches filter and skip adding this course if so
            if (time === "Morning" && sectionHour >= 12)
                continue;
            else if (time === "Afternoon" && (sectionHour < 12 || sectionHour >= 18))
                continue;
            else if (time === "Evening" && sectionHour < 18)
                continue;
        }

        // Filter by course number
        if (course) {
            var courseNumber = code.substr(code.indexOf(" ") + 1, 1);
            var courseFilter = course.substr(0, 1);

            if (courseFilter !== courseNumber) continue;
        }

        // filter by which days the class meets
        if (week) {
            // don't add this course if it doesn't meet
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

    // now update the search results
    searchCourses($("#searchfield").val());
}


// add course by course code to selected courses and calendar display
// name parameter is in the form "ACCT 202 A"
function addCourse(name) {
    name = name.toUpperCase();
    if (selectedCourses[name]) {
        console.log("Course already in list")
    } else if (!selectedCourses[name] && allCourses[name]) {
        // course seems good, so add it
        selectedCourses[name] = allCourses[name];
        // update all calendar objects
        updateCalendar();
    }
    else {
        // error
        console.log("Error adding '" + name + "' to selected courses");
    }
}


// refreshs all calendar events so they match selectedCourses
function updateCalendar() {
    // clear everything from calendar
    calendar.fullCalendar('removeEvents');

    var events = [];

    var colorSelector = 0;

    // go through every course and every meeting time within it
    for (var code in selectedCourses) {
        for (var part in selectedCourses[code]) {
            var meets = selectedCourses[code][part]["Meets"];
            // new event for each day
            for (var i = 0; i < meets.length; i++) {
                // Monday is 1, Tuesday is 2, etc. Figure out which day of the week this event will be
                var day = 1;
                var letter = meets[i];
                switch (letter) {
                    case 'M':
                        break;
                    case 'T':
                        day += 1; break;
                    case 'W':
                        day += 2; break;
                    case 'R':
                        day += 3; break;
                    case 'F':
                        day += 4; break;
                }

                var event = {
                    id: code,
                    title: code,
                    color: colors[colorSelector],
                    start: '2016-08-0' + day.toString() + 'T' + pad(selectedCourses[code][part]["BeginTime"], 8),
                    end: '2016-08-0' + day.toString() + 'T' + pad(selectedCourses[code][part]["EndTime"], 8)
                }
                // add Event Source Object to containing object
                events.push(event);
            }
        }

        // Now increment the color for the next course
        colorSelector++;
        if (colorSelector >= colors.length) colorSelector = 0;
    }

    // push the list of events to the calendar module
    calendar.fullCalendar('renderEvents', events, true);
}


// remove course from selectedCourses and from calendar display
// name parameter is in the form "ACCT 202 A"
function removeCourse(name) {
    // This shouldn't cause errors if course doesn't exist
    delete selectedCourses[name];
    calendar.fullCalendar('removeEvents', name);
}


// clear all selected courses
function clearCourses() {
    selectedCourses = {};
    calendar.fullCalendar('removeEvents');
    displaySearchResults();
}


// print out course codes and copy buttons to the copy course codes modal
function printCourseCodes() {
    var coursePopup = $("#coursePopup");
    var popupScript = $("#copyScriptDiv");

    coursePopup.empty();
    popupScript.empty();

    var count = 0;

    // Add the HTML code for each course that is in the selected courses
    for (var code in selectedCourses) {
        var divtarget = "div-target" + count.toString();
        var btn = "btn" + count.toString();

        // The button itself
        var inside = $("<div>")
            .addClass('row top-buffer')
            .html('<div class="col-xs-6 col-xs-offset-3 container-center"><div class="copy-boxes col-xs-6" id=' + divtarget + '>' + code + '</div><button class="' + btn + ' btn btn-info col-xs-6" data-clipboard-action="copy" data-clipboard-target="#' + divtarget + '"> Copy </button></div>')
            .appendTo(coursePopup);

        // The code to copy the buttons
        var btnInside = $("<div>")
            .addClass('copyScript')
            .html('<script class="copyScript">var clipboard = new Clipboard(".' + btn + '");</script>')
            .appendTo(popupScript);

        count++;
    }

    //if no selected courses
    if (Object.keys(selectedCourses).length === 0) {
        var inside = $("<div>")
            .text('Select some courses first!')
            .appendTo(coursePopup);
    }
}


// search list of filtered courses for query and add to searchedCourses
function searchCourses(query) {
    searchedCourses = {};
    var selector = 0;
    query = query.toUpperCase().trim();

    // return everything if there is no query
    if (!query) {
        searchedCourses = filteredCourses;
        displaySearchResults();
        return;
    }

    // Go through the list of courses that match the filters and check for matches with the search query
    for (var courseCode in filteredCourses) {
        if (courseCode.indexOf(query) !== -1 || filteredCourses[courseCode][selector]["ShortTitle"].indexOf(query) !== -1 || filteredCourses[courseCode][selector]["LongTitle"].indexOf(query) !== -1) {
            if (!searchedCourses[courseCode]) {
                searchedCourses[courseCode] = allCourses[courseCode];
            }
        }
    }

    // update results section
    displaySearchResults();
}


function displaySearchResults() {
    var courseTable = $(".results-table");
    // Clear the table
    $("#results-table").empty();

    // use document fragment to avoid reflowing the page constantly
    var fragment = $(document.createDocumentFragment());

    for (var code in searchedCourses) {
        var link = $("<a>")
            .addClass('list-group-item course_link')
            .attr({ 'href': 'javascript:void(0);', 'data-code': code });

        var inside = $("<div>")
            .addClass('row course-list-row')
            .appendTo(link);

        $("<div>")
            .addClass("col-xs-6 course-list-text")
            .text(code)
            .appendTo(inside);

        $("<div>")
            .addClass("col-xs-6 course-list-text")
            .text(searchedCourses[code][0]["ShortTitle"])
            .appendTo(inside);

        if (selectedCourses[code])
            link.addClass("active");

        fragment.append(link);
    }

    courseTable.append(fragment);

    // click handler

    $(".course_link").click(function (event) {
        var link = $(event.delegateTarget);
        var code = link.attr("data-code");
        if (selectedCourses[code]) {
            // remove course
            removeCourse(code);
            link.removeClass("active");
        } else {
            // add course
            addCourse(code);
            link.addClass("active");
        }

    });

    courseTable.scrollTop(0);
}

function updateSelectedCourses(){
  var selectedTable = $(".selected-table");
  // Clear the table
  $("#selected-table").empty();

  // use document fragment to avoid reflowing the page constantly
  var fragment = $(document.createDocumentFragment());

  for (var code in selectedCourses) {
      var link = $("<a>")
          .addClass('list-group-item course_link')
          .attr({ 'href': 'javascript:void(0);', 'data-code': code });

      var inside = $("<div>")
          .addClass('row course-list-row')
          .appendTo(link);

      $("<div>")
          .addClass("col-xs-6 course-list-text")
          .text(code)
          .appendTo(inside);

      $("<div>")
          .addClass("col-xs-6 course-list-text")
          .text(selectedCourses[code][0]["ShortTitle"])
          .appendTo(inside);

      if (selectedCourses[code])
          link.addClass("active");

      fragment.append(link);
  }

  selectedTable.append(fragment);

  // click handler

  $(".course_link").click(function (event) {
      var link = $(event.delegateTarget);
      var code = link.attr("data-code");
      if (selectedCourses[code]) {
          // remove course
          removeCourse(code);
          link.removeClass("active");
      } else {
          // add course
          addCourse(code);
          link.addClass("active");
      }
  });

  selectedTable.scrollTop(0);
}

// code to execute on document ready
// event listeners created here
$(function () {
    filteredCourses = allCourses;
    searchedCourses = filteredCourses;

    displaySearchResults();

    calendar = $('#calendar');

    calendar.fullCalendar({
        header: false,
        contentHeight: "auto",
        allDaySlot: false,
        minTime: "08:00:00",
        maxTime: "21:00:00",
        defaultDate: '2016-08-01',
        defaultView: 'agendaWeek',
        columnFormat: 'dddd',
        navLinks: false, // can click day/week names to navigate views
        editable: false,
        eventLimit: true, // allow "more" link when too many events
        weekends: false,
        weekNumbers: false,
    });

    $("#reset_button").click(function () {
        clearCourses();
        updateSelectedCourses();
    });

    $("#searchfield").on("input", function (event) {
        searchCourses($("#searchfield").val());
    });

    $("#course_codes_button").click(function () {
        printCourseCodes();
    });

    $(".filter-item").change(filterCourses);

    $(".searchResultsTab").click(function(){
      displaySearchResults();
    });

    $(".selectedCoursesTab").click(function(){
      updateSelectedCourses();
    });

});
