const {
    //renameSync,
    copyFileSync,
    readdirSync,
    statSync
} = require('fs');
const {
    join,
    basename,
    dirname
} = require('path');
const {
    spawn
} = require('child_process');
const {
    ENVIRONMENTS_FILE
} = require('./constants.js');


const toml = require('toml')
const requireFile = require('require-file')

let watcher = null;

const forExclude = (filePath) => {
    const ignoreRegExp = new RegExp('(node_modules|tns_modules|hooks|gradle|build-tools|platform)')

    return ignoreRegExp.test(filePath)
}

const buildFilePathWithoutEnvironment = (logger, environmentConfig, parentPath, file) => {
    const fileName = file.replace(new RegExp(`\\.${environmentConfig.name}`), '')
    logger.info('new FileName', fileName)
    return join(parentPath, fileName)
}

const copyEnvironmentedFiles = (logger, environmentConfig, directory) => {
    const matcherRegExp = new RegExp(`(.*\\.${environmentConfig.name}\\..*)`)
    const platformsDirFiles = readdirSync(directory);

    const matchAndCopyFiles = (parentPath, currentFileOrDir) => {

        const sourceFilePath = join(parentPath, currentFileOrDir);
        const stat = statSync(sourceFilePath)

        if (stat.isDirectory() && !forExclude(sourceFilePath)) {
            readdirSync(sourceFilePath).forEach((file) => matchAndCopyFiles(sourceFilePath, file));
        } else if (matcherRegExp.test(sourceFilePath)) {
            copyEnvironmentedFile(logger, environmentConfig, parentPath, currentFileOrDir)
        }
    }

    platformsDirFiles.forEach((file) => matchAndCopyFiles(directory, file));
    return true;
}

const copyEnvironmentedFile = (logger, environmentConfig, parentPath, file) => {
    const sourceFilePath = join(parentPath, file);
    const targetFilePath = buildFilePathWithoutEnvironment(logger, environmentConfig, parentPath, file);

    logger.info('source path', sourceFilePath)
    logger.info('target path', targetFilePath)

    copyFileSync(sourceFilePath, targetFilePath)
}

const findDefaultEnvironment = function (environmentsData) {
    return environmentsData.environments.find(environment => {
        return environment.default === true
    }) || environmentsData.environments[0];
}

const findEnvironment = function (environmentsData, environment) {

}

const interpreteEnvironment = (logger, environmentConfigs, projectData, watch) => {

    if (watch == true) {
        if (watcher != null) return;
        
        watcher = spawn(process.execPath, [join(__dirname, "./watcher.js"), JSON.stringify({
            environments: environmentConfigs,
            directory: projectData.projectDir,
            projectType: projectData.projectType
        })], {
            stdio: ["ignore", "ignore", "ignore", "ipc"]
        });

        watcher.on('message', message => {
            logger.info(message)
        });

        logger.info('watcher initialized')
    }

    if (copyEnvironmentedFiles(logger, environmentConfigs.find(config => config.default == true), projectData.projectDir)) {
        logger.info('all files copied')
    }
}

const hookArgReader = function (args) {
    if (typeof args !== 'string') {
        return Object.keys(args)[0];
    } else {
        return args;
    }
}

const getEnvironmentConfig = (projectDir, hookArgs) => {
    const environmentsFilePath = join(projectDir, ENVIRONMENTS_FILE);
    const environmentsData = toml.parse(requireFile(environmentsFilePath));

    let environmentConfig;

    if (hookArgs && hookArgs.with_environment) {
        environment = hookArgReader(hookArgs.with_environment);
        environmentConfig = findEnvironment(environmentsData, environment);
    } else {
        environmentConfig = findDefaultEnvironment(environmentsData);
    }

    return environmentConfig;
}

const getAllEnvironmentConfigs = (projectDir) => {
    const environmentsFilePath = join(projectDir, ENVIRONMENTS_FILE);
    const environmentsData = toml.parse(requireFile(environmentsFilePath));

    return environmentsData.environments;
}

exports.isWatcherRunning = function isWatcherRunning() {
    return watcher != undefined && watcher != null;
}

exports.getWatcher = function getWatcher() {
    return watcher;
}

exports.getEnvironmentConfig = getEnvironmentConfig;

exports.getAllEnvironmentConfigs = getAllEnvironmentConfigs;

exports.interpreteFile = function interpreteFile(logger, projectDir, file, projectType) {
    environmentConfigs = getAllEnvironmentConfigs(projectDir)

    const absoluteFile = join(projectDir, file)
    const fileName = basename(absoluteFile);
    const fileDir = dirname(absoluteFile);
    const fileParts = fileName.split('.');
    const fileExtension = fileParts[fileParts.length - 1]
    const fileEnvironment = fileParts[fileParts.length - 2];

    logger.info(absoluteFile)
    logger.info(fileName)
    logger.info(fileEnvironment)

    environmentConfigs.some(environmentConfig => {
        if (environmentConfig.name == fileEnvironment && environmentConfig.default == true) {
            switch (projectType) {
                case 'Angular':
                    if (fileExtension != 'js') {
                        copyEnvironmentedFile(logger, environmentConfig, fileDir, fileName);
                    }
                    break;
                default:
                    copyEnvironmentedFile(logger, environmentConfig, fileDir, fileName);
            }
            return true;
        } else {
            return false;
        }
    });
}

// TODO: modify files only in the platforms folder and not create new files, only move environmented files changing its names.
exports.environmentsInterpreter = function environmentsInterpreter(logger, projectData, options, hookArgs) {
    logger.info('environmentInterpreter')

    return new Promise((resolve, reject) => {
        try {
            environmentConfig = getEnvironmentConfig(projectData.projectDir, hookArgs)

            interpreteEnvironment(logger, [environmentConfig], projectData)
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

exports.environmentsWatcher = function environmentsInterpreter(logger, projectData, options, hookArgs) {
    logger.info('environmentWatcher')

    return new Promise((resolve, reject) => {
        try {
            environmentConfigs = getAllEnvironmentConfigs(projectData.projectDir)

            interpreteEnvironment(logger, environmentConfigs, projectData, true)
            resolve()
        } catch (error) {
            reject(error);
        }
    })
}