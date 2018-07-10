const { getEnvironmentConfig } = require('./environments-interpreter')

module.exports = function (logger, projectData, options, hookArgs) {
    const environmentConfig = getEnvironmentConfig(projectData.projectDir, hookArgs)

    logger.info(environmentConfig)

    if (hookArgs.liveSyncData && !hookArgs.liveSyncData.bundle) {
		return (args, originalMethod) => {
			return originalMethod(...args).then(originalPatterns => {
				originalPatterns.push(`!platforms/**/*.${environmentConfig.name}.*`);
                originalPatterns.push(`environments-config.toml`);
				return originalPatterns;
			});
		};
	}
}