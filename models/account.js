// We grab Schema and model from mongoose library.
const chalk = require("chalk");
const { Int32 } = require("mongodb");
const { Schema, model } = require("mongoose");

// We declare new schema.
const userSchema = new Schema({
    username: {
        type: String
    },

    password: {
        type: String
    },

    rank: {
        type: String
    }
});

userSchema.post('save', async function() {
    if ((await model("users", userSchema).find({ username: this._doc.username })).length > 1) {
        await model("users", userSchema).findByIdAndDelete(this.id).then(doc => {
            console.log(`${chalk.green("[MONGODB]")} ${chalk.red("[-]")} Account ${chalk.bold(this._doc.username)} was dismissed because an account with that username already exists.`)
        })
    }
});

// We export it as a mongoose model.
module.exports = {
    schema: userSchema,
    model: model("users", userSchema)
};