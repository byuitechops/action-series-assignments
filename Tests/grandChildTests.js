/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, callback) => {
    tap.test('action-series-assignments', (tapTest) => {
        function assignments_delete(deleteCallback) {
            var found = '';

            /* Insert assignments to delete here */
            var doomedAssignments = [
                /\[co~\d*\]/i //delete Course Outcomes assignments
            ];

            /* Get an array of all the assignments in the course */
            canvas.getAssignments(course.info.canvasOU, (err, assignments) => {
                if (err) {
                    callback(err, course);
                    return;
                }
                /* For each doomedAssignment, check if it still exists or not */
                doomedAssignments.forEach(item => {
                    found = assignments.find(assignment => item.test(assignment.name));
                    if (found) {
                        tapTest.fail(`The assignment '${item}' was marked to be deleted but still exists`);
                    } else {
                        tapTest.pass(`The assignment '${item}' was deleted`);
                    }
                });
                deleteCallback(null);
                return;
            });
        }

        /* An array of functions for each associated action in action-series-assignments */
        var myFunctions = [
            assignments_delete,
        ];

        /* Run each universal grandchilds' test in its own function, one at a time */
        asyncLib.series(myFunctions, (seriesErr) => {
            if (seriesErr) {
                course.error(seriesErr);
            }
            tapTest.end();
        });
    });

    callback(null, course);
};