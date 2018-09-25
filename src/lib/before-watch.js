const { environmentsWatcher } = require('./environments-interpreter')

module.exports = function (logger, projectData, options, hookArgs) {
    // logger.info(hookArgs)

    /* if (hookArgs.config) {
        const appFilesUpdaterOptions = hookArgs.config.appFilesUpdaterOptions;
        if (appFilesUpdaterOptions.bundle) {
            logger.warn("Hook skipped because bundling is in progress.")
            return;
        }
    } */

    return environmentsWatcher(logger, projectData, options, hookArgs)
    //return Promise.resolve();
}