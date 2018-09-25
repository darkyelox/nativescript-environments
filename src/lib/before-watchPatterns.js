const {
	getAllEnvironmentConfigs
} = require('./environments-interpreter')
const {
	ENVIRONMENTS_FILE
} = require('./constants')

module.exports = function (logger, projectData, options, hookArgs) {

	const environmentConfigs = getAllEnvironmentConfigs(projectData.projectDir);

	if (hookArgs.liveSyncData && !hookArgs.liveSyncData.bundle) {
		return (args, originalMethod) => {
			return originalMethod(...args).then(originalPatterns => {
				// originalPatterns.push(`!${projectData.platformsDir}`);

				// environmentConfigs.forEach(environmentConfig => {
				// 	originalPatterns.push(`${projectData.projectDir}/**/*.${environmentConfig.name}.*`);
				// });

				originalPatterns.push(`${projectData.projectDir}/${ENVIRONMENTS_FILE}`);
				return originalPatterns;
			});
		};
	}
}