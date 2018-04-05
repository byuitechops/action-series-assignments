/* Dependencies */
const canvas = require('canvas-wrapper');

/* Actions */
var actions = [
    require('./actions/assignments-delete.js'),
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
        this.logs = [];
        this.delete = false;
        this.type = 'Assignment';
    }

    log(title, details) {
        this.logs.push({ title, details });
    }

    message(message) {
        this.logs.push({ title: 'message', details: { message: message }});
    }

    warning(warning) {
        this.logs.push({ title: 'warning', details: { warning: warning }});
    }

    error(error) {
        this.logs.push({ error: error });
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
            'title': assignment.name, // Not in documentation, but throws an error with 'name' instead
            'position': assignment.position,
            'turnitin_enabled': assignment.turnitin_enabled,
            'published': assignment.published,
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
    if (assignment.techops.delete === true) {
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
    return item.description;
}

function setHTML(item, newHTML) {
    item.description = newHTML;
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