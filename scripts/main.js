// courses that are added to student's schedule
var selectedCourses = {};

// courses that match current filters
var filteredCourses = {};

// courses that match current search values
var searchedCourses = {};

// courses that overlap times
var timeConflicts = {};

// courses that have multiple sections added
var sectionConflicts = {};

// points to full calendar DOM element
var calendar;

var currentMealTime = "none";


// quick utility function to pad numbers with 0's on the left
function pad(num, size) {
    return ('000000000' + num).substr(-size);
}

// preset colors that courses can have
var colors = {
    "ABRD": "#7A8AF5",
    "ACCT": "#5DBCBC",
    "ART": "#61E8C4",
    "ASTR": "#171A8D",
    "BIOL": "#0A20C3",
    "BUSA": "#4C9AF3",
    "CHEM": "#3942DF",
    "CHIN": "#3DADBF",
    "COMM": "#7C41FE",
    "COMP": "#3B34AD",
    "ECON": "#7CDEFC",
    "EDUC": "#3CD7A8",
    "ELEE": "#8F61C1",
    "ENGL": "#3250A9",
    "ENGR": "#2E4B94",
    "ENTR": "#60477B",
    "EXER": "#364EA9",
    "FREN": "#13C5CA",
    "GEOL": "#200787",
    "GERM": "#350C94",
    "GOBL": "#9FA0ED",
    "GREK": "#045FC5",
    "HIST": "#4A34D9",
    "HUMA": "#4DAB9E",
    "LATN": "#06A0A0",
    "LEGL": "#5108D4",
    "MATH": "#2F7293",
    "MECE": "#1261A8",
    "MUSI": "#6DBEF5",
    "PHIL": "#00A5D1",
    "PHYE": "#57AB94",
    "PHYS": "#15939C",
    "POLS": "#73AAF4",
    "PSYC": "#745BDC",
    "RELI": "#093C98",
    "SCIC": "#39B3A5",
    "SEDU": "#45E2DF",
    "SOCI": "#8C8F82",
    "SOCW": "#68C9BF",
    "SPAN": "#1A5790",
    "SSFT": "#05B1E4",
    "THEA": "#677ACE",
    "WRIT": "#8868F6"
};

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
                meets = meets.replace(week[i], '');
            }
            if (failed || meets.length != 0) continue;
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

        detectConflicts();

        // update all calendar objects
        updateCalendar();
    } else {
        // error
        console.log("Error adding '" + name + "' to selected courses");
    }
}

// refreshs all calendar events so they match selectedCourses
function updateCalendar() {
    // clear everything from calendar
    calendar.fullCalendar('removeEvents');

    var events = [];

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
                        day += 1;
                        break;
                    case 'W':
                        day += 2;
                        break;
                    case 'R':
                        day += 3;
                        break;
                    case 'F':
                        day += 4;
                        break;
                }

                var event = {
                    id: code,
                    title: code,
                    start: '2016-08-0' + day.toString() + 'T' + pad(selectedCourses[code][part]["BeginTime"], 8),
                    end: '2016-08-0' + day.toString() + 'T' + pad(selectedCourses[code][part]["EndTime"], 8)
                }

                if (timeConflicts[code] || sectionConflicts[code]) {
                    event["backgroundColor"] = "white";
                    event["borderColor"] = "#da211e";
                    event["textColor"] = "black";
                } else {
                    event["color"] = colors[code.substring(0, 4)];
                }
                // add Event Source Object to containing object
                events.push(event);
            }
        }
    }

    // push the list of events to the calendar module
    calendar.fullCalendar('renderEvents', events, true);
    displayMealTime();
}

// remove course from selectedCourses and from calendar display
// name parameter is in the form "ACCT 202 A"
function removeCourse(name) {
    // This shouldn't cause errors if course doesn't exist
    delete selectedCourses[name];
    detectConflicts();
    updateCalendar();
}

// clear all selected courses
function clearCourses() {
    selectedCourses = {};
    detectConflicts();
    calendar.fullCalendar('removeEvents');
    displaySearchResults();
    displayMealTime();
}

// print out course codes and copy buttons to the copy course codes modal
function printCourseCodes() {
    var coursePopup = $("#coursePopup");
    var popupScript = $("#copyScriptDiv");

    coursePopup.empty();
    popupScript.empty();

    var count = 0;

    var errors = false;

    if (Object.keys(sectionConflicts).length > 0) {
        errors = true;
        $("<div>")
            .addClass('alert alert-danger')
            .html('<span class="glyphicon glyphicon-warning-sign"></span><strong> Warning!</strong> You have two sections of the same class in your schedule. Please review your schedule and pick only one section of each course.')
            .appendTo(coursePopup);
    }

    if (Object.keys(timeConflicts).length > 0) {
        errors = true;
        $("<div>")
            .addClass('alert alert-danger')
            .html('<span class="glyphicon glyphicon-warning-sign"></span><strong> Warning!</strong> You have a timing conflict in your schedule. Please review your schedule and make sure no courses overlap.')
            .appendTo(coursePopup);
    }

    if (errors) return;

    //if no selected courses
    if (Object.keys(selectedCourses).length === 0) {
        var inside = $("<div>")
            .text('Select some courses first!')
            .appendTo(coursePopup);
    } else {
        // Add the HTML code for each course that is in the selected courses
        for (var code in selectedCourses) {
            var divtarget = "div-target" + count.toString();
            var btn = "btn" + count.toString();

            var prer = PrereqCourseCode[code.substring(0, 8)];
            if (!prer) {
                prer = "";
            } else {
                prer = "Prereq: " + prer;
            }

            // The button itself
            $("<div>")
                .addClass('row top-buffer')
                .html('<div class="col-xs-12 container-center">' +
                '<div class="copy-boxes col-xs-4" id=' + divtarget + '>' + code + '</div>' +
                '<button data-code="' + code + '" class="' + btn + ' copyButton btn btn-info col-xs-3" data-clipboard-action="copy" data-clipboard-target="#' + divtarget + '"> Copy </button>' +
                '<div class="Prereq-boxes col-xs-5">' + prer + '</div></div>')
                .appendTo(coursePopup);

            // The code to copy the buttons
            $("<div>")
                .addClass('copyScript')
                .html('<script class="copyScript">var clipboard = new Clipboard(".' + btn + '");</script>')
                .appendTo(popupScript);

            count++;
        }
    }
}

function displayMealTime(cafeteria = currentMealTime) {

    calendar.fullCalendar('removeEvents', "hicks");
    calendar.fullCalendar('removeEvents', "map");
    calendar.fullCalendar('removeEvents', "sac");

    currentMealTime = cafeteria;

    switch (cafeteria) {
        case "hicks":
            calendar.fullCalendar('renderEvents', hicksTimes, true);
            break;
        case "map":
            calendar.fullCalendar('renderEvents', mapTimes, true);
            break;
        case "sac":
            calendar.fullCalendar('renderEvents', sacTimes, true);
            break;
    }

}

function copyMessage(code = "") {
    var message;

    if (code !== "") {
        message = 'Course Code "'+code+'" Copied Successfully!';
    }
    else {
        message = 'Course Code Copied Successfully!';
    }

    $.notify({
        // options
        message: message
    }, {
        // settings
        type: 'success',
        element: 'body',
        allow_dismiss: false,
        newest_on_top: true,
        placement: {
            from: "bottom",
            align: "left"
        },
        delay: 750,
        z_index: 10031,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        template: '<div data-notify="container" class="col-xs-11 col-sm-2 alert alert-{0}" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message"><center>{2}</center></span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
    });
}

// search list of filtered courses for query and add to searchedCourses
function searchCourses(query) {
    searchedCourses = {};
    var selector = 0;
    var dept = "ChristianWuzHere";
    query = query.toUpperCase().trim();

    // return everything if there is no query
    if (!query) {
        searchedCourses = filteredCourses;
        displaySearchResults();
        return;
    }

    // Add the proper department abbreviation to the query
    for (var queryDepartment in departmentNames) {
        //if (queryDepartment.indexOf(query) !== -1) {
        if (queryDepartment.includes(query)) {
            dept = departmentNames[queryDepartment];
            //query = query + " " + departmentNames[queryDepartment];
            break;
        }
    }


    if (departmentNames[query]) {
        query = departmentNames[query];

        // Go through the list of courses that match the filters and check for matches in the department
        for (var courseCode in filteredCourses) {
            if (courseCode.indexOf(query) !== -1) {
                if (!searchedCourses[courseCode]) {
                    searchedCourses[courseCode] = allCourses[courseCode];
                }
            }
        }
    } else {
        // Go through the list of courses that match the filters and check for matches with the search query
        for (var courseCode in filteredCourses) {
            if (courseCode.indexOf(query) !== -1 || filteredCourses[courseCode][selector]["ShortTitle"].indexOf(query) !== -1 || filteredCourses[courseCode][selector]["LongTitle"].indexOf(query) !== -1 || courseCode.includes(dept)) {
                if (!searchedCourses[courseCode]) {
                    searchedCourses[courseCode] = allCourses[courseCode];
                }
            }
        }
    }

    // update results section
    displaySearchResults();
}

// display the courses that match the search string
// setting rebuilt to false is much faster, but only works if course links are already populated
function displaySearchResults(rebuild = false) {
    var courseTable = $(".results-table");
    $(".noneMatching").remove();

    if (rebuild) {
        // Clear the table
        $("#results-table").empty();

        // use document fragment to avoid reflowing the page constantly
        var fragment = $(document.createDocumentFragment());
        for (var code in allCourses) {
            var link = getResultLink(code);

            fragment.append(link);
        }

        courseTable.append(fragment);
        courseTable.scrollTop(0);
    }

    //  go thru results and hide/toggle active
    $("#results-table .course_link").each(function(index) {
        var $this = $(this);
        var code = $this.attr("data-code");

        if (searchedCourses[code]) {
            $this.show();
        } else {
            $this.hide();
        }

        if (selectedCourses[code]) {
            $this.addClass("active");
        } else {
            $this.removeClass("active");
        }
    });

    if (Object.keys(searchedCourses).length != 0) {
        $(".noneMatching").remove();
    } else { // Does not match string
        $("<div>").text("No Matching Courses...").addClass("noneMatching").appendTo(courseTable);
    }
}

// Convert the time from military time to standard time
function getTime(code) {
    var BeginTime = allCourses[code][0]["BeginTime"];
    var EndTime = allCourses[code][0]["EndTime"];

    if (BeginTime != null && EndTime != null) {
        BeginHour = BeginTime.split(':')[0];
        BeginMin = BeginTime.split(':')[1];
        EndHour = EndTime.split(':')[0];
        EndMin = EndTime.split(':')[1];

        if (BeginHour > 12) {
            BeginHour = BeginHour - 12;
        }
        if (EndHour > 12) {
            EndHour = EndHour - 12;
        }

        var time = BeginHour + ":" + BeginMin + "-" + EndHour + ":" + EndMin;
        return time;
    } else {
        return "N/A";
    }
}

// get the days of the week that the class meets on
function getMeeting(code) {
    if (Object.keys(allCourses[code]).length > 1) {
        var days = allCourses[code][0]["Meets"] + allCourses[code][1]["Meets"];
        if (days == "MWFR" || days == "RMWF") {
            return "MWRF";
        } else if (days == "MWFT" || days == "TMWF") {
            return "MTWF";
        } else if (days == "MFTR" || days == "TRMF") {
            return "MTRF";
        } else if (days == "RT" || days == "TR") {
            return "TR";
        } else if (days == "WF" || days == "FW") {
            return "WF";
        }else {
            return allCourses[code][0]["Meets"];
        }
    } else {
        if (allCourses[code][0]["Meets"] == "") {
            return "N/A";
        } else {
            return allCourses[code][0]["Meets"];
        }
    }
}

// formats the html for the course item in the left menu
function getResultLink(code) {
    var link = $("<a>")
        .addClass('list-group-item course_link')
        .attr({
            'href': 'javascript:void(0);',
            'data-code': code
        });

    var inside = $("<div>")
        .addClass('row course-list-row')
        .appendTo(link);

    $("<div>")
        .addClass("col-xs-3 course-list-text")
        .text(code)
        .appendTo(inside);

    $("<div>")
        .addClass("col-xs-5 course-list-text-name")
        .text(allCourses[code][0]["ShortTitle"])
        .appendTo(inside);

    $("<div>")
        .addClass("col-xs-1 course-list-text")
        .text(getMeeting(code))
        .appendTo(inside);

    $("<div>")
        .addClass("col-xs-3 course-list-text-time")
        .text(getTime(code))
        .appendTo(inside);

    if (selectedCourses[code])
        link.addClass("active");

    return link;
}

// update the list of currently selected courses
function updateSelectedCourses() {
    var selectedTable = $(".selected-table");
    // Clear the table
    $("#selected-table").empty();
    $(".noneMatching").remove();

    // use document fragment to avoid reflowing the page constantly
    var fragment = $(document.createDocumentFragment());

    if (Object.keys(selectedCourses).length != 0) {
        for (var code in selectedCourses) {
            var link = getResultLink(code);

            fragment.append(link);
        }

        selectedTable.append(fragment);
        selectedTable.scrollTop(0);
    } else {
        $("<div>").text("No Courses Selected...").addClass("noneMatching").appendTo(selectedTable);
    }
}

function detectConflicts() {
    sectionConflicts = {};
    timeConflicts = {};

    for (var code_current in selectedCourses) {
        for (var part_current = 0; part_current <= 1; part_current++) {
            if (!selectedCourses[code_current][part_current] || !selectedCourses[code_current][part_current]["BeginTime"]) continue;
            var start = parseInt(selectedCourses[code_current][part_current]["BeginTime"].replace(":", ""));
            var end = parseInt(selectedCourses[code_current][part_current]["EndTime"].replace(":", ""));
            for (var code_other in selectedCourses) {
                if (timeConflicts[code_other] && sectionConflicts[code_other]) continue; //already covered this
                if (code_current != code_other) {
                    var code_current_trim = code_current.substring(0, 8);
                    var code_other_trim = code_other.substring(0, 8);
                    if (code_current_trim == code_other_trim) {
                        sectionConflicts[code_current] = selectedCourses[code_current];
                        sectionConflicts[code_other] = selectedCourses[code_other];
                    }

                    for (var part_other = 0; part_other <= 1; part_other++) {
                        if (!selectedCourses[code_other][part_other] || !selectedCourses[code_other][part_other]["BeginTime"]) continue;
                        var tstart = parseInt(selectedCourses[code_other][part_other]["BeginTime"].replace(":", ""));
                        var tend = parseInt(selectedCourses[code_other][part_other]["EndTime"].replace(":", ""));

                        if (tstart < end && tend > start) {
                            var meets = selectedCourses[code_current][part_current]["Meets"];
                            for (var c = 0; c < meets.length; c++) {
                                if (selectedCourses[code_other][part_other]["Meets"].indexOf(meets[c]) !== -1) {
                                    timeConflicts[code_current] = selectedCourses[code_current];
                                    timeConflicts[code_other] = selectedCourses[code_other];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// code to execute on document ready
// event listeners created here
$(function() {
    filteredCourses = allCourses;
    searchedCourses = filteredCourses;

    displaySearchResults(true);

    calendar = $('#calendar');

    calendar.fullCalendar({
        header: false,
        contentHeight: 550,
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
        eventRender: function(event, element) {
            var code = event.id;
            var placement;
            if (!allCourses[code]) return;
            if (allCourses[code][0]["BeginTime"] && moment(event.start).hour() > 14) {
                placement = "top";
            } else {
                placement = "bottom";
            }
            var warning = "";
            if (timeConflicts[code]) {
                warning += "<br /><span style='color:red;'><b>Warning:</b> Time conflict detected.</span>"
            }
            if (sectionConflicts[code]) {
                warning += "<br /><span style='color:red;'><b>Warning:</b> Multiple sections of same course added.</span>"
            }
            var prer = PrereqCourseCode[code.substring(0, 8)];
            if (!prer) {
                prer = "none";
            }
            $(element).popover({
                title: allCourses[code][0]["LongTitle"],
                content: "<b>Course Code:</b> " + code +
                    "<br /><b>Building:</b> " + allCourses[code][0]["Building"] +
                    "<br /><b>Room:</b> " + allCourses[code][0]["Room"] +
                    "<br /><b>Capacity:</b> " + allCourses[code][0]["Capacity"] +
                    "<br /><b>Enrollment:</b> " + allCourses[code][0]["Enrollment"] +
                    "<br /><b>Prereqs: </b> " + prer +
                    warning +
                    '<br /><br /><div style="text-align:center;"><button type="button" data-code="' + code +
                    '" class="btn btn-default remove-course-btn" aria-label="Remove Course"><span class="glyphicon glyphicon-remove x-icon-in-button" aria-hidden="true"></span><span> Remove Course</span></button></div>',
                placement: placement,
                trigger: "manual",
                html: true,
                container: "#calendar"
            }).click(function(e) {
                $('.fc-event').not(this).popover("hide"); /* hide other popovers */
                $(this).popover('toggle'); /* show popover now it's setup */
                e.preventDefault();
                e.stopPropagation();
            });;
        }
    });

    // stop event propagation when clicking on popovers
    $(document).on("click", ".popover", function(e) {
        e.stopPropagation();
    });

    // hide popovers on general clicks
    $(document).on("click", function(e) {
        $('#calendar .popover').popover("hide");
    });

    $("#reset_button").click(function() {
        clearCourses();
        updateSelectedCourses();
        $("#week").val("");
        $("#course").val("");
        $("#time").val("");
        $("#department").val("");
        $("#searchfield").val("").trigger("input");
    });

    $("#searchfield").on("input", function(event) {
        searchCourses($("#searchfield").val());
    });

    $("#course_codes_button").click(function() {
        detectConflicts();
        printCourseCodes();
    });

    $(".filter-item").change(filterCourses);

    $(".searchResultsTab").click(function() {
        displaySearchResults();
    });

    $(".selectedCoursesTab").click(function() {
        updateSelectedCourses();
    });

    // click handler for course result links
    $(document.body).on("click", ".course_link", function(event) {
        var link = $(event.currentTarget);
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

    // click handler for course remove button
    $(document.body).on("click", ".remove-course-btn", function(event) {
        var btn = $(event.currentTarget);
        var code = btn.attr("data-code");
        if (selectedCourses[code]) {
            // remove course
            removeCourse(code);
            btn.removeClass("active");
        }
        $('.popover').popover("hide");
        updateSelectedCourses();
        displaySearchResults();
    });


    $(document).on('click', '.copyButton', function (event) {
        var btn = $(event.currentTarget);
        var code = btn.attr("data-code");
        copyMessage(code);
    });

    $("#tips_button").click(function() {
        // Initialize the tour for the Tips
        tips.init();
        // Start the tips tour
        tips.start(true);
    });

    $("#tutorial_button").click(function() {
        // Initialize the tour for the Tutorial
        tutorial.init();

        // Start the tutorial tour
        tutorial.start(true);

        //tutorial.setCurrentStep(0);
    });

    // Add the meal time display code here
    $("div input:radio").change(function() {
        if (document.getElementById("none").checked) {
            displayMealTime("clear");
        }
        if (document.getElementById("hicks").checked) {
            displayMealTime("hicks");
        }
        if (document.getElementById("map").checked) {
            displayMealTime("map");
        }
        if (document.getElementById("sac").checked) {
            displayMealTime("sac");
        }
    });
});
