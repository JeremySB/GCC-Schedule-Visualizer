var selectedCourses;

// name parameter is in the form "ACCT 202 A"
function addCourse(name) {
    // TODO: add checks for errors
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