const { environmentsInterpreter, isWatcherRunning } = require('./environments-interpreter')

module.exports = function(logger, projectData, options, hookArgs) {
    var liveSync = isWatcherRunning();
	var appFilesUpdaterOptions = (hookArgs && hookArgs.appFilesUpdaterOptions) || {};
	var bundle = options.bundle || appFilesUpdaterOptions.bundle;

	if (liveSync || bundle) {
		logger.warn("Hook skipped because either bundling or livesync is in progress.")
		return;
	}
    return environmentsInterpreter(logger, projectData, options, hookArgs)
    // return Promise.reject(new Error('stopped'))
}
