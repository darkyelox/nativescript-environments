const { getWatcher } = require('./environments-interpreter')
// const kill = require('tree-kill')

module.exports = function (logger) {
    let watcher = getWatcher()
    if(watcher && watcher.connected) {
        logger.info('watcher killing')
        watcher.disconnect();
        // kill(watcher.pid, 'SIGKILL')
        watcher.kill("SIGINT")
        watcher = null
        logger.info('watcher killed')
    }

    // return Promise.resolve()
}