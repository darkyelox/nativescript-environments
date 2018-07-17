const choki = require('chokidar');
const path = require('path');
const {
    interpreteFile
} = require('./environments-interpreter')

const args = JSON.parse(process.argv[2]);
const environments = args.environments;
const directory = args.directory;
const projectType = args.projectType;

process.send('Watching for environment:' + environments)
process.send('Watching into dir:' + directory)

var watcherOptions = {
    ignoreInitial: true,
    cwd: directory,
    awaitWriteFinish: {
        pollInterval: 100,
        stabilityThreshold: 300
    },
    ignored: ['**/.*', '.*', 'platforms/*', 'node_modules/*', 'hooks/*'] // hidden files and App_Resources folder
};

watcher = choki.watch(environments.map(environment => {
        return `**/*.${environment.name}.*`
    }), watcherOptions)
    .on('change', (filePath) => {
        process.send('live sync file:' + filePath);
        try {
            const logger = {
                info: function (message) {
                    process.send(message)
                }
            }
            interpreteFile(logger, directory, filePath, projectType)
        } catch(error) {
            process.send('some error:' + error);
        }
    });