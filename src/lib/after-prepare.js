const { environmentsInterpreter, isWatcherRunning } = require('./environments-interpreter')

module.exports = function(logger, projectData, options, hookArgs) {
    var liveSync = isWatcherRunning();
	var appFilesUpdaterOptions = (hookArgs && hookArgs.appFilesUpdaterOptions) || {};
	var bundle = options.bundle || appFilesUpdaterOptions.bundle;

	if (liveSync) {
		logger.warn("Hook skipped because of livesync is in progress.")
		return;
	}
    return environmentsInterpreter(logger, projectData, options, hookArgs)
    // return Promise.reject(new Error('stopped'))
}