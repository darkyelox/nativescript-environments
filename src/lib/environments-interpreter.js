const {
    //renameSync,
    copyFileSync,
    readdirSync,
    statSync
} = require('fs');
const {
    join
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
    const ignoreRegExp = new RegExp('(node_modules|tns_modules|hooks|gradle|build-tools)')

    return ignoreRegExp.test(filePath)
}

const buildFilePathWithoutEnvironment = (logger, environmentConfig, parentPath, file) => {
    /* let fileNameParts = file.split('.');
    let ext = fileNameParts[fileNameParts.length - 1];
    let fileName = fileNameParts;

    return join(parentPath, `${fileName}.${ext}`); */

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
    console.log(platformsDirFiles)
    platformsDirFiles.forEach((file) => matchAndCopyFiles(directory, file));
    return true;
}

const copyEnvironmentedFile = (logger, environmentConfig, parentPath, file) => {
    const sourceFilePath = join(parentPath, file);
    const targetFilePath = buildFilePathWithoutEnvironment(logger, environmentConfig, parentPath, file);

    logger.info('source path', sourceFilePath)
    logger.info('target path', targetFilePath)

    // renameSync(sourceFilePath, targetFilePath)
    copyFileSync(sourceFilePath, targetFilePath)
}

const findDefaultEnvironment = function (environmentsData) {
    return environmentsData.environments.find(environment => {
        return environment.default === true
    }) || environmentsData.environments[0];
}

const findEnvironment = function (environmentsData, environment) {

}

const interpreteEnvironment = (logger, environmentConfigs, directory, watch) => {

    if (watch == true) {
        watcher = spawn(process.execPath, [ join(__dirname, "./watcher.js"), JSON.stringify({ environments: environmentConfigs, directory: directory })], { stdio: ["ignore", "ignore", "ignore", "ipc"] });

        watcher.on('message', message => {
            logger.info(message)
        });

        watcher.on('error', error => {
            throw new Error(error);
        });
    }

    if (copyEnvironmentedFiles(logger, environmentConfigs.find(config => config.default == true), directory)) {
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

const getAllEnvironmentConfigs = (projectDir, hookArgs) => {
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

exports.environmentsInterpreter = function environmentsInterpreter(logger, projectData, options, hookArgs) {
    logger.info('environmentInterpreter')

    return new Promise((resolve, reject) => {
        try {
            environmentConfig = getEnvironmentConfig(projectData.projectDir, hookArgs)

            interpreteEnvironment(logger, [environmentConfig], projectData.projectDir)
            // reject(new Error('stopped'))
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
            environmentConfigs = getAllEnvironmentConfigs(projectData.projectDir, hookArgs)

            interpreteEnvironment(logger, environmentConfigs, projectData.projectDir, true)
            resolve()
        } catch (error) {
            reject(error);
        }
    })
}