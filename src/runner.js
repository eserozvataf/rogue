'use strict';

const chalk = require('chalk'),
    deepmerge = require('./utils/deepmerge.js'),
    runnerOp = require('./runnerOp.js'),
    taskException = require('./taskException.js');

class runner {
    constructor(config) {
        this.config = config;
    }

    getBundleConfig(name) {
        let config = {};

        if (this.config.content.global !== undefined) {
            deepmerge(config, this.config.content.global);
        }

        if (this.config.content[name] !== undefined) {
            deepmerge(config, this.config.content[name]);
        }

        return config;
    }

    async runBundle(name) {
        const config = this.getBundleConfig(name);

        console.log(chalk.green('bundle:'), chalk.bold.white(name));
        try {
            if (config.ops !== undefined) {
                for (let key in config.ops) {
                    console.log(chalk.green('  op #' + key));
                    const op = new runnerOp(name, config.ops[key], config);
                    await op.start();
                }
            }
        } catch (ex) {
            if (ex instanceof taskException) {
                console.log(ex.export());
            } else {
                console.log(ex);
            }
        }
    }

    async run() {
        for (let bundle in this.config.content) {
            if (bundle === 'global') {
                continue;
            }

            await this.runBundle(bundle);
        }
    }
}

module.exports = runner;
