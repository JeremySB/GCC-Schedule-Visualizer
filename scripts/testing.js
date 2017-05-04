testingCourses = Object.freeze({
  
});


$(function () {
    // SSet up stuff
    // Test days of week
    FilterDays();
    // Test course numbers
    // Test Department
    // Test time of day
});

function FilterDays(){
    filterCoursesTest(null,null,null,"M");
    testFilterDays("M",3);
    filterCoursesTest(null,null,null,"T");
    testFilterDays("T");
    filterCoursesTest(null,null,null,"W");
    testFilterDays("W");
    filterCoursesTest(null,null,null,"R");
    testFilterDays("R");
    filterCoursesTest(null,null,null,"F");
    testFilterDays("F");
    filterCoursesTest(null,null,null,"MWF");
    testFilterDays("MWF");
    filterCoursesTest(null,null,null,"TR");
    testFilterDays("TR");
    filterCoursesTest(null,null,null,"MWRF");
    testFilterDays("MWRF");
    filterCoursesTest(null,null,null,"MTWF");
    testFilterDays("MTWF");
    filterCoursesTest(null,null,null,"MTRF");
    testFilterDays("MTRF");
    filterCoursesTest(null,null,null,"MW");
    testFilterDays("MW");
    filterCoursesTest(null,null,null,"WF");
    testFilterDays("WF");
}

function testFilterDays(day,matching){
  var count = 0;
    for(var code in testingCourses){
        var cur = testingCourses[code][0];
        var meets = cur["Meets"];
        if (testingCourses[code][1]) meets = meets + testingCourses[code][1]["Meets"];

        if(meets == day){
          count++;
        }
    }
    if(count != matching){
      console.log("Testing: " + day + " failed");
    }else{
      console.log("Testing: " + day + " sucsess");
    }
}

function FilterTimes(time){

}

function FilterDepartment(department){

}

function FilterNumber(course){

}

// filter all courses by selected filters and store the resulting courses in filteredCoursesTest
function filterCoursesTest(department,time,course,week) {
    filteredCoursesTest = {};

    for (var code in testingCourses) {
        var selector = 0; // usually the first item is the class, other ones might be labs
        var cur = testingCourses[code][selector];

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
            if (testingCourses[code][1]) meets = meets + testingCourses[code][1]["Meets"];

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

        filteredCoursesTest[code] = testingCourses[code];
    }

    // now update the search results
    searchCourses($("#searchfield").val());
}
