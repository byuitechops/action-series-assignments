/* Dependencies */
const canvas = require('canvas-wrapper');

/* Actions */
var actions = [
    require('../actions/assignments-delete.js'),
];

class TechOps {
    constructor() {
        this.getHTML = getHTML;
        this.setHTML = setHTML;
        this.getPosition = getPosition;
        this.setPosition = setPosition;
        this.getTitle = getTitle;
        this.setTitle = setTitle;
        this.getID = getID;
        this.delete = false;
        this.type = 'Assignment';
    }
}

/* Retrieve all items of the type */
function getItems(course, callback) {
    /* Get all of the assignments from Canvas */
    canvas.getAssignments(course.info.canvasOU, (err, items) => {
        if (err) {
            callback(err);
            return;
        }
        /* Give each item the TechOps helper class */
        items.forEach(it => {
            it.techops = new TechOps();
        });

        callback(null, items);
    });
}

/* Build the PUT object for an item */
/******** "NOTE: The assignment overrides feature is in beta" - Canvas API Documentation ********/
function buildPutObj(assignment) {
    return {
        'assignment': {
            'name': assignment.name,
            'position': assignment.position,
            'submission_types': assignment.submission_types,
            'allowed_extensions': assignment.allowed_extensions,
            'turnitin_enabled': assignment.turnitin_enabled,
            'vericite_enabled': assignment.vericite_enabled,
            'turnitin_settings': assignment.turnitin_settings,
            'integration_data': assignment.integration_data,
            'integration_id': assignment.integration_id,
            'peer_reviews': assignment.peer_reviews,
            'automatic_peer_reviews': assignment.automatic_peer_reviews,
            'notify_of_update': assignment.notify_of_update,
            'group_category_id': assignment.group_category_id,
            'grade_group_students_individually': assignment.grade_group_students_individually,
            'external_tool_tag_attributes': assignment.external_tool_tag_attributes,
            'points_possible': assignment.points_possible,
            'grading_type': assignment.grading_type,
            'due_at': assignment.due_at,
            'lock_at': assignment.lock_at,
            'unlock_at': assignment.unlock_at,
            'description': assignment.description,
            'assignment_group_id': assignment.assignment_group_id,
            'muted': assignment.muted,
            'assignment_overrides': assignment.assignment_overrides,
            'only_visible_to_overrides': assignment.only_visible_to_overrides,
            'published': assignment.published,
            'grading_standard_id': assignment.grading_standard_id,
            'omit_from_final_grade': assignment.omit_from_final_grade,
        }
    };
}

function deleteItem(course, assignment, callback) {
    canvas.delete(`/api/v1/courses/${course.info.canvasOU}/assignments/${assignment.id}`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, null);
    });
}

/* PUT an item back into Canvas with updates */
function putItem(course, assignment, callback) {
    if (assignment.delete == true) {
        deleteItem(course, assignment, callback);
        return;
    }
    var putObj = buildPutObj(assignment);
    canvas.put(`/api/v1/courses/${course.info.canvasOU}/assignments/${assignment.id}`, putObj, (err, newItem) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, newItem);
    });
}

function getHTML(item) {
    return null;
}

function setHTML(item, newHTML) {
    return null;
}

function getTitle(item) {
    return item.name;
}

function setTitle(item, newTitle) {
    item.name = newTitle;
}

function getPosition(item) {
    return item.position;
}

function setPosition(item, newPosition) {
    item.position = newPosition;
}

function getID(item) {
    return item.id;
}

module.exports = {
    actions: actions,
    getItems: getItems,
    putItem: putItem,
};