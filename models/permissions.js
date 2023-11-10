const { Schema, model } = require("mongoose");

const PermissionSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    displayName: {
        type: String,
        required: true
    },

    description: {
        type: String
    }
});

module.exports = model('permissions', PermissionSchema);