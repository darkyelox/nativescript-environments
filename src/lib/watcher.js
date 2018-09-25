const choki = require('chokidar');
const path = require('path');
const {
    interpreteFile
} = require('./environments-interpreter')
const {
    ENVIRONMENTS_FILE
} = require('./constants')

const args = JSON.parse(process.argv[2]);
const environments = args.environments;
const projectDir = args.projectDir;
const projectType = args.projectType;

process.send('Watching for environment: ' + Array.from(environments, environment => environment.name).join(', '))
process.send('Watching into dir: ' + projectDir)

var watcherOptions = {
    ignoreInitial: true,
    cwd: projectDir,
    awaitWriteFinish: {
        pollInterval: 100,
        stabilityThreshold: 300
    },
    ignored: ['**/.*', '.*', 'platforms/*', 'node_modules/*', 'hooks/*'] // hidden files and App_Resources folder
};

const forWatch = [...environments.map(environment => {
    return `**/*.${environment.name}.*`
}), `**/${ENVIRONMENTS_FILE}`];

process.send('watching for: ' + forWatch)

watcher = choki.watch(forWatch, watcherOptions)
    .on('change', (filePath) => {
        process.send('live sync file:' + filePath);
        try {
            const logger = {
                info: function (message) {
                    process.send(message)
                }
            }
            interpreteFile(logger, projectDir, filePath, projectType)
        } catch (error) {
            process.send('some error:' + error);
        }
    });