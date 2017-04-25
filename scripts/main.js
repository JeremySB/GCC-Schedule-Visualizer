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

// Tips Tour instantiation
var tips = new Tour({
    name: "tips",
    storage: false,
    steps: [{
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #1",
        content: "Be sure to always use a wired ethernet connection when scheduling."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #2",
        content: "A full-time GCC student pays the same amount of tuition for a 13 credit semester as they do a 17 credit one. Spend that money wisely!"
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #3",
        content: "If you do have to use Wi-Fi, do so in an unpopulated area, like the crawspace beneath Harbison Chapel."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #4",
        content: "Make sure that you're on the course code tab on myGCC's academics page and NOT the referance code tab."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #5",
        content: "Don't let another person schedule for you; if you want something done right then use our software."
    },
    {
        element: "#tips_button",
        animation: true,
        placement: "bottom",
        title: "Tip #6",
        content: "HTML element inspection... that's all."
    }
    ]
});

// Tutorial Tour instantiation
var tutorial = new Tour({
    name: "tutorial",
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'>« Prev</button><button class='btn btn-default' data-role='next'>Next »</button><button class='btn btn-default' data-role='end'>Close tutorial</button></div></div>",
    steps: [{
        element: ".search-row",
        placement: "auto right",
        backdrop: "true",
        title: "Step #1",
        content: "Use this search bar to look for things like COMP 340, computer science, or operating systems."
    },
    {
        element: ".form-group.row",
        placement: "auto right",
        backdrop: "true",
        title: "Step #2",
        content: "Filter your results even further with these awesome filters, provided free of charge!"
    },
    {
        element: ".results-row",
        placement: "auto top",
        backdrop: "true",
        title: "Step #3",
        content: "Watch as all the courses matching your search criteria appear here on the results tab. " +
        "You can add them to your schedule just by clicking on them! " +
        "Flip over to the selected courses tab to see the courses you have added. You can also remove courses by clicking on them from there too."
    },
    {
        element: "#calendar",
        placement: "auto left",
        backdrop: "true",
        title: "Step #4",
        content: "Here's were you can see all your selected courses on a real calendar. You can click on any of the courses to see some more info and to remove them from the calendar."
    },
    {
        element: "#tutorial_button",
        placement: "auto top",
        backdrop: "true",
        backdropPadding: {
            top: 5,
            right: 355,
            bottom: 5,
            left: 5
        },
        title: "Step #5",
        content: "You can easily add any of the on-campus dinning options to the calendar here to see how they line up with the schedule you're considering."
    },
    {
        element: "#tips_button",
        placement: "auto top",
        backdrop: "true",
        backdropPadding: {
            top: 5,
            right: 220,
            bottom: 5,
            left: 81
        },
        title: "Step #6",
        content: "Here's were you can view some sweet tips about scheduling, courtesy of your local tip chef Bobby Brown."
    },
    {
        element: "#reset_button",
        placement: "auto top",
        backdrop: "true",
        backdropPadding: {
            top: 5,
            right: 150,
            bottom: 5,
            left: 215
        },
        title: "Step #7",
        content: "If you feel the need to erase everything you have ever worked for then you came to the wrong place. " +
        "But if you want to start your schedule over again, you can simply click this button."
    },
    {
        element: "#course_codes_button",
        placement: "auto top",
        backdrop: "true",
        backdropPadding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 280
        },
        title: "Step #8",
        content: "At the end of the day, you'll need to click this button to actually get the information you'll have to paste into myGCC's academic page to add the courses you've pick out. " +
        "Good luck and see you next time, space cowboy."
    }
    ]
});


// quick utility function to pad numbers with 0's on the left
function pad(num, size) {
    return ('000000000' + num).substr(-size);
}

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

    if (Object.keys(sectionConflicts).length > 0) {
        $("<div>")
            .addClass('alert alert-danger')
            .html('<span class="glyphicon glyphicon-warning-sign"></span><strong> Warning!</strong> You have two sections of the same class in your schedule. Please review your schedule and pick only one section of each course.')
            .appendTo(coursePopup);
    } else if (Object.keys(timeConflicts).length > 0) {
        $("<div>")
            .addClass('alert alert-danger')
            .html('<span class="glyphicon glyphicon-warning-sign"></span><strong> Warning!</strong> You have a timing conflict in your schedule. Please review your schedule and make sure no courses overlap.')
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
                .html('<div class="col-xs-10 col-xs-offset-1 container-center">' +
                '<div class="copy-boxes col-xs-3 col-xs-offset-2" id=' + divtarget + '>' + code + '</div>' +
                '<button id="copyButton" class="' + btn + ' btn btn-info col-xs-2" data-clipboard-action="copy" data-clipboard-target="#' + divtarget + '"> Copy </button>' +
                '<div class="Prereq-boxes col-xs-4">' + prer + '</div></div>')
                .appendTo(coursePopup);

            // The code to copy the buttons
            $("<div>")
                .addClass('copyScript')
                .html('<script class="copyScript">var clipboard = new Clipboard(".' + btn + '");</script>')
                .appendTo(popupScript);

            count++;
        }
    }

    //if no selected courses
    if (Object.keys(selectedCourses).length === 0) {
        var inside = $("<div>")
            .text('Select some courses first!')
            .appendTo(coursePopup);
    }
}

function copyMessage() {
    $.notify({
        // options
        message: 'Course Code Copied Successfully!'
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
    query = query.toUpperCase().trim();

    // return everything if there is no query
    if (!query) {
        searchedCourses = filteredCourses;
        displaySearchResults();
        return;
    }


    if (departmentNames[query]) {
        query = departmentNames[query];
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

        if (Object.keys(searchedCourses).length != 0) {
            for (var code in searchedCourses) {
                var link = getResultLink(code);

                fragment.append(link);
            }

            courseTable.append(fragment);
            courseTable.scrollTop(0);
        } else {
            $("<div>").text("No Matching Courses...").addClass("noneMatching").appendTo(courseTable);
        }
    }
    else {
        // don't rebuild, just go thru results and hide/toggle active
        $(".course_link").each(function (index) {
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
        } else {
            $("<div>").text("No Matching Courses...").addClass("noneMatching").appendTo(courseTable);
        }
    }
}

// Convert the time from military time to standard time
function getTime(code) {
    var BeginTime = searchedCourses[code][0]["BeginTime"];
    var EndTime = searchedCourses[code][0]["EndTime"];

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
    if (Object.keys(searchedCourses[code]).length > 1) {
        var days = searchedCourses[code][0]["Meets"] + searchedCourses[code][1]["Meets"];
        if (days == "MWFR" || days == "RMWF") {
            return "MWRF";
        } else if (days == "MWFT" || days == "TMWF") {
            return "MTWF";
        } else if (days == "MFTR" || days == "TRMF") {
            return "MTRF";
        } else if (days == "RT" || days == "TR") {
            return "TR";
        } else {
            return searchedCourses[code][0]["Meets"];
        }
    } else {
        if (searchedCourses[code][0]["Meets"] == "") {
            return "N/A";
        } else {
            return searchedCourses[code][0]["Meets"];
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
        .text(searchedCourses[code][0]["ShortTitle"])
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
        $("<div>").text("No Matching Courses...").addClass("noneMatching").appendTo(selectedTable);
    }
}

function detectConflicts() {
    sectionConflicts = {};
    timeConflicts = {};

    for (var code_current in selectedCourses) {
        for (var code_other in selectedCourses) {
            if (code_current != code_other) {
                var code_current_trim = code_current.substring(0, 8);
                var code_other_trim = code_other.substring(0, 8);
                if (code_current_trim == code_other_trim) {
                    sectionConflicts[code_current] = selectedCourses[code_current];
                    sectionConflicts[code_other] = selectedCourses[code_other];
                }

                // TODO: add timing conflict checking
            }
        }
    }
}

// code to execute on document ready
// event listeners created here
$(function () {
    filteredCourses = allCourses;
    searchedCourses = filteredCourses;

    displaySearchResults(true);

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
        eventRender: function (event, element) {
            var code = event.id;
            var placement;
            if (allCourses[code][0]["BeginTime"] && moment(event.start).hour() > 14) {
                placement = "top";
            }
            else {
                placement = "bottom";
            }
            $(element).popover({
                title: allCourses[code][0]["LongTitle"],
                content: "<b>Course Code:</b> " + code
                + "<br /><b>Building:</b> " + allCourses[code][0]["Building"]
                + "<br /><b>Room:</b> " + allCourses[code][0]["Room"]
                + "<br /><b>Capacity:</b> " + allCourses[code][0]["Capacity"]
                + "<br /><b>Enrollment:</b> " + allCourses[code][0]["Enrollment"]
                + '<br /><br /><div style="text-align:center;"><button type="button" data-code="' + code
                + '" class="btn btn-default remove-course-btn" aria-label="Remove Course"><span class="glyphicon glyphicon-remove x-icon-in-button" aria-hidden="true"></span><span> Remove Course</span></button></div>',
                placement: placement,
                trigger: "manual",
                html: true,
                container: "#calendar"
            }).click(function (e) {
                $('.fc-event').not(this).popover("hide"); /* hide other popovers */
                $(this).popover('toggle'); /* show popover now it's setup */
                e.preventDefault();
                e.stopPropagation();
            });;
        }
    });

    // stop event propagation when clicking on popovers
    $(document).on("click", ".popover", function (e) {
        e.stopPropagation();
    });

    // hide popovers on general clicks
    $(document).on("click", function (e) {
        $('.popover').popover("hide");
    });

    $("#reset_button").click(function () {
        clearCourses();
        updateSelectedCourses();
    });

    $("#searchfield").on("input", function (event) {
        searchCourses($("#searchfield").val());
    });

    $("#course_codes_button").click(function () {
        detectConflicts();
        printCourseCodes();
    });

    $(".filter-item").change(filterCourses);

    $(".searchResultsTab").click(function () {
        displaySearchResults();
    });

    $(".selectedCoursesTab").click(function () {
        updateSelectedCourses();
    });

    // click handler for course result links
    $(document.body).on("click", ".course_link, .remove-course-btn", function (event) {
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
    $(document.body).on("click", ".remove-course-btn", function (event) {
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


    $(document).on('click', '#copyButton', function () {
        copyMessage();
    });

    $("#tips_button").click(function () {
        // Initialize the tour for the Tips
        tips.init();
        // Start the tips tour
        tips.start(true);
    });

    $("#tutorial_button").click(function () {
        // Initialize the tour for the Tutorial
        tutorial.init();

        // Start the tutorial tour
        tutorial.start(true);

        //tutorial.setCurrentStep(0);
    });
});
