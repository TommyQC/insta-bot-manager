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
        type: String
    }
});

model("ranks", ranksSchema).watch().on('change', async(data) => {
    if (data.operationType === "drop") {
        console.log(`${chalk.green(`[MONGODB]`)} ${chalk.warning(`[WARNING]`)} A drop action has been detected on collection ${chalk.underline(data.ns.coll)}. Reloading database...`);
        delete require.cache[require.resolve(`../modules/db_init.js`)];
        require(`../modules/db_init.js`).code();
    }
});

// We export it as a mongoose model.
module.exports = model("ranks", ranksSchema);