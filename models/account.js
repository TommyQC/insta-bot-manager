// We grab Schema and model from mongoose library.
const chalk = require("chalk");
const { Int32 } = require("mongodb");
const { Schema, model } = require("mongoose");

// We declare new schema.
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    rank: {
        type: String,
        default: "user",
        required: true
    },

    picture: {
        type: String,
        default: `/assets/images/profile/user-${Math.floor(Math.random() * (5 - 1 + 1) + 1)}.jpg`,
        required: false
    }
});

userSchema.post('save', async function() {
    if ((await model("users", userSchema).find({ username: this._doc.username })).length > 1) {
        await model("users", userSchema).findByIdAndDelete(this.id).then(doc => {
            console.log(`${chalk.green("[MONGODB]")} ${chalk.red("[-]")} Account ${chalk.bold(this._doc.username)} was dismissed because an account with that username already exists.`)
        })
    }
});

model("users", userSchema).watch().on('change', async(data) => {
    if (data.operationType === "drop") {
        console.log(`${chalk.green(`[MONGODB]`)} ${chalk.warning(`[WARNING]`)} A drop action has been detected on collection ${chalk.underline(data.ns.coll)}. Reloading database...`);
        delete require.cache[require.resolve(`../modules/db_init.js`)];
        require(`../modules/db_init.js`).code();
    }
});

// We export it as a mongoose model.
module.exports = {
    schema: userSchema,
    model: model("users", userSchema)
};