var selectedCourses = {};

// name parameter is in the form "ACCT 202 A"
function addCourse(name) {
    // TODO: add checks for errors
    if(!selectedCourses[name] && allCourses[name])
        selectedCourses[name] = allCourses[name];
}

// name parameter is in the form "ACCT 202 A"
function removeCourse(name) {
    // This shouldn't cause errors if course doesn't exist, but haven't tested that
    delete selectedCourses[name];
}

function clearCourses() {
    selectedCourses = {};
}

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