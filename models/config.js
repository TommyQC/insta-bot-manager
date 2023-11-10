// We grab Schema and model from mongoose library.
const chalk = require("chalk");
const { Schema, model } = require("mongoose");

// We declare new schema.
const configSchema = new Schema({
    name: {
        type: String
    },

    type: {
        type: String
    },

    d_name: {
        type: String
    },

    value: {
        type: String
    }
});

// We export it as a mongoose model.
module.exports = model("config", configSchema);