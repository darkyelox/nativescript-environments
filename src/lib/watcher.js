const choki = require('chokidar');
const path = require('path');
const {
    environmentsInterpreter
} = require('./environments-interpreter')

const args = JSON.parse(process.argv[2]);
const environments = args.environments;
const directory = args.directory;

process.send('Watching for environment:' + environment)
process.send('Watching into dir:' + directory)

var watcherOptions = {
    ignoreInitial: true,
    cwd: directory,
    awaitWriteFinish: {
        pollInterval: 100,
        stabilityThreshold: 300
    },
    //ignored: ['**/.*', '.*'] // hidden files and App_Resources folder
};

watcher = choki.watch(environments.map(environment => {
        `**/*.${environment}.js`
    }), watcherOptions)
    .on('all', (event, filePath) => {
        process.send('live sync file path' + filePath);
    });