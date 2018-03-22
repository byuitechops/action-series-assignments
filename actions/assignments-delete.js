module.exports = (course, assignment, callback) => {
    //if delete attribute is already set to true, do nothing
    if (assignment.techops.delete) {
        callback(null, course, assignment);
        return;
    }

    //insert assignments to delete here
    var doomedAssignments = [
        /\[co~\d*\]/i //delete Course Outcomes assignments
    ];

    var found = doomedAssignments.find((rgx) => rgx.test(assignment.name));

    //modify assignment properties to prep it for termination
    //only called found is NOT undefined
    function action() {
        var logCategory = 'Assignments - Deleted';

        /* If we're running a standards check and not doing any changes... */
        if (course.info.checkStandard === true) {
            logCategory = 'Assigments - Deprecated';
        } else {
            assignment.techops.delete = true;
        }

        assignment.techops.log(logCategory, {
            'Title': assignment.name,
            'ID': assignment.id
        });
        callback(null, course, assignment);
    }

    //an assignment matching at least one element in the doomedAssignments has been found.
    if (found != undefined) {
        action();
    } else {
        callback(null, course, assignment);
    }
};