/******************************************************************************
 * Assignments Delete
 * Description: Create an array of assignment titles and set their delete 
 * attribute on the TechOps class to true. If the delete attribute is set to 
 * true, the assignment will be deleted in action-series-master main.js 
 ******************************************************************************/
module.exports = (course, assignment, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        //if delete attribute is already set to true, do nothing
        if (assignment.techops.delete === true || validPlatform !== true) {
            callback(null, course, assignment);
            return;
        }

        //insert assignments to delete here
        var doomedAssignments = [
            /\[co~\d*\]/i //delete Course Outcomes assignments
        ];

        var found = doomedAssignments.find(rgx => rgx.test(assignment.name));

        //modify assignment properties to prep it for termination
        //only called found is NOT undefined
        function action() {
            var logCategory = 'Deleted Assignments';

            /* If we're running a standards check and not doing any changes... */
            if (course.info.checkStandard === true) {
                logCategory = 'Deprecated Assigments';
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
        if (found !== undefined) {
            action();
        } else {
            callback(null, course, assignment);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, assignment);
    }
};

module.exports.details = {
    title: 'assignments-delete'
}