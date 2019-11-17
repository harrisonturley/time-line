//note: this is boilerplate code, slightly adapted from an online tutorial
//source: https://zellwk.com/blog/seed-database/

const fs = require('fs');
const util = require('util');
const readDir = util.promisify(fs.readdir);
const path = require('path');
const mongoose = require('mongoose');

// Load seeds of all models
async function seedDatabase(runSaveMiddleware = false) {
    const dir = await readDir(__dirname);
    const seedFiles = dir.filter(f => f.endsWith('.seed.js'));

    for (const file of seedFiles) {
        const modelName = file.split('.seed.js')[0];
        const model = mongoose.models[modelName];

        if (!model) throw new Error(`Cannot find Model '${modelName}'`);
        const fileContents = require(path.join(__dirname, file));

        runSaveMiddleware
            ? await model.create(fileContents)
            : await model.insertMany(fileContents)
    }
}

exports.seedDatabase = seedDatabase;