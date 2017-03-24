// courses that are added to student's schedule
var selectedCourses = {};

// courses that match current filters
var filteredCourses = {};

// courses that match current search values
var searchedCourses = {};

var calendar;

function pad(num, size) { return ('000000000' + num).substr(-size); }

var colors = ["Blue", "BlueViolet", "CornflowerBlue", "DarkBlue", "DarkCyan", "DarkMagenta", "DodgerBlue", "Indigo"]

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

    searchBar($("#searchfield").val());

}

// name parameter is in the form "ACCT 202 A"
function addCourse(name) {
    console.log(name);
    // TODO: add checks for errors
    name = name.toUpperCase();
    if (selectedCourses[name]) {
        console.log("Course already in list")
    } else if (!selectedCourses[name] && allCourses[name]) {
        selectedCourses[name] = allCourses[name];
        updateCalendar();
    }
    else {
        // error
        console.log("Error adding '" + name + "' to selected courses");
    }
}

// refreshs all calendar courses
function updateCalendar() {
    calendar.fullCalendar('removeEvents');

    var events = [];

    var colorSelector = 0;

    for (var code in selectedCourses) {
        for (var part in selectedCourses[code]) {
            var meets = selectedCourses[code][part]["Meets"];
            // new event for each day
            for (var i = 0; i < meets.length; i++) {
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
                var beginTime, endTime

                var event = {
                    id: code,
                    title: code,
                    color: colors[colorSelector],
                    start: '2016-08-0' + day.toString() + 'T' + pad(selectedCourses[code][part]["BeginTime"], 8),
                    end: '2016-08-0' + day.toString() + 'T' + pad(selectedCourses[code][part]["EndTime"], 8)
                }
                //calendar.fullCalendar('renderEvent', event, true);

                events.push(event);
            }
        }

        colorSelector++;
        if (colorSelector >= colors.length) colorSelector = 0;
    }

    calendar.fullCalendar('renderEvents', events, true);
}


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
    addToTable();
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

//search function
function searchBar(query) {
    searchedCourses = {};
    var selector = 0;
    query = query.toUpperCase().trim();

    if (!query) {
        searchedCourses = filteredCourses;
        addToTable();
        return;
    }

    for (var courseCode in filteredCourses) {
        if (courseCode.indexOf(query) !== -1 || filteredCourses[courseCode][selector]["ShortTitle"].indexOf(query) !== -1 || filteredCourses[courseCode][selector]["LongTitle"].indexOf(query) !== -1) {
            if (!searchedCourses[courseCode]) {
                searchedCourses[courseCode] = allCourses[courseCode];
            }
        }
    }

    addToTable();
}

function addToTable() {
    var courseTable = $(".results-table");
    // Clear the table
    $("#results-table a").remove();

    for (var code in searchedCourses) {
        var link = $("<a>")
            .addClass('list-group-item course_link')
            .attr({ 'href': 'javascript:void(0);', 'data-code': code })
            .appendTo(courseTable);

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
    }

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
// code to execute on document ready

$(function () {
    filteredCourses = allCourses;
    searchedCourses = filteredCourses;

    addToTable();

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

    $("#course_codes_button").click(function (event) {
        console.log(getSelectedCourseCodes());

    });

    $("#reset_button").click(function () {
        clearCourses();
    });

    $("#searchfield").on("input", function (event) {
        searchBar($("#searchfield").val());
    });

    //$("#searchfield").keypress(function (e) {
    //    if (e.which == 13) {
    //        searchBar($("#searchfield").val());
    //    }
    //});

    $(".filter-item").change(filterCourses);
});
