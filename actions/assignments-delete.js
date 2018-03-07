module.exports = (course, assignment, callback) => {
    //if delete attribute is already set to true, do nothing
    if (assignment.techops.delete) {
        callback(null, course, assignment);
        return;
    }

    //insert assignments to delete here
    var doomedAssignments = [
        /\[co~\d*\]/i   //delete Course Outcomes assignments
    ];

    var found = doomedAssignments.find((rgx) => rgx.test(assignment.name));

    //modify assignment properties to prep it for termination
    //only called found is NOT undefined
    function modifyAssignment() {
        assignment.techops.delete = true;
        
        course.log('Assignments - Deleted', {
            'Title': assignment.name,
            'ID': assignment.id
        });
    }

    //an assignment matching at least one element in the 
    //doomedAssignments has been found.
    if (typeof found != "undefined") {
        modifyAssignment();
    }

    //return and report
    callback(null, course, assignment);
};