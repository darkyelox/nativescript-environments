const { environmentsInterpreter } = require('./environments-interpreter')

module.exports = function(logger, projectData, options, hookArgs) {
    // logger.info(options)
    return environmentsInterpreter(logger, projectData, options, hookArgs)
}
