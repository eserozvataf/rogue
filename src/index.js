const path = require('path'),
    chalk = require('chalk'),
    // logger = require('simple-node-logger'),
    fsManager = require('./utils/fsManager.js'),
    Config = require('./config/'),
    Runner = require('./runner/'),
    ModuleManager = require('./ModuleManager.js');

class sey {
    constructor() {
        this.moduleManager = new ModuleManager();
        this.config = Config;
        this.startParameters = {};
    }

    init() {
        this.moduleManager.init();
        this.moduleManager.registerOps(Config);

        this.workingPath = path.join(process.cwd(), '.sey');

        // this.logManager = logger.createLogManager();
        // this.logManager.createConsoleAppender();

        // this.log = this.logManager.createLogger('sey');
    }

    initFile(file, preferApi, override) {
        if (fsManager.exists(file) && !override) {
            console.log(chalk.red('Aborted. File already exists:'), chalk.gray(file));

            return;
        }

        const sampleFile = (preferApi) ? 'seyfile.api.sample.js' : 'seyfile.config.sample.js',
            content = fsManager.readFile(`${__dirname}/../etc/${sampleFile}`);

        fsManager.writeFile(file, content);

        console.log(chalk.white('File created:'), chalk.gray(file));
    }

    clean() {
        fsManager.rm(`${this.workingPath}/*`);

        console.log(chalk.white('Working path is cleaned.'));
    }

    selfCheck() {
        return [];
    }

    async run(configInstance) {
        let currentConfig;

        if (configInstance instanceof Config) {
            currentConfig = configInstance;
        }
        else {
            currentConfig = new Config(configInstance);
        }

        const currentRunner = new Runner(this.moduleManager, currentConfig);

        return await currentRunner.run('publish', this.startParameters);
    }

    async runFile(filepath, startParameters) {
        global.sey = this;
        this.startParameters = startParameters;

        const returnValue = require(filepath);

        if (Object.keys(returnValue).length > 0) {
            await this.run(returnValue);
        }
    }
}

const instance = new sey();

instance.init();

module.exports = instance;
