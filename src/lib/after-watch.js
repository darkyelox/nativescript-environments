const { killWatcher } = require('./environments-interpreter')
// const kill = require('tree-kill')

module.exports = function (logger) {
    killWatcher(logger)

    // return Promise.resolve()
}