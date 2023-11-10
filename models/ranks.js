// We grab Schema and model from mongoose library.
const chalk = require("chalk");
const { Schema, model } = require("mongoose");

// We declare new schema.
const ranksSchema = new Schema({
    name: {
        type: String
    },

    displayName: {
        type: String
    },

    style: {
        type: String
    },

    permissions: {
        type: [String],
        default: ["NONE"]
    }
});


// We export it as a mongoose model.
module.exports = model("ranks", ranksSchema);