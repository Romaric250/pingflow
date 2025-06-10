var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { intro, outro, select, confirm, spinner, isCancel, cancel } from '@clack/prompts';
import chalk from 'chalk';
import { NetworkDetector } from './network-detector.js';
import { SpeedTester } from './speed-tester.js';
import { PingTester } from './ping-tester.js';
import { Utils } from './utils.js';
export class CLI {
    constructor(options = {}) {
        this.options = options;
    }
    /**
     * Run the interactive CLI
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.options.skipIntro) {
                    Utils.displayBanner();
                    intro(chalk.cyan('Welcome to PingFlow v2!'));
                    // Display system info if verbose
                    if (this.options.verbose) {
                        const systemInfo = Utils.getSystemInfo();
                        Utils.displaySystemInfo(systemInfo);
                    }
                }
                // Auto-run mode
                if (this.options.autoRun) {
                    yield this.runAllTests();
                    return;
                }
                // Specific test type
                if (this.options.testType) {
                    yield this.runSpecificTest(this.options.testType);
                    return;
                }
                // Interactive mode
                yield this.runInteractiveMode();
            }
            catch (error) {
                if (isCancel(error)) {
                    cancel('Operation cancelled.');
                    process.exit(0);
                }
                else {
                    Utils.displayError(error instanceof Error ? error : new Error(String(error)));
                    process.exit(1);
                }
            }
        });
    }
    /**
     * Run interactive mode with user prompts
     */
    runInteractiveMode() {
        return __awaiter(this, void 0, void 0, function* () {
            const testType = yield select({
                message: 'What would you like to test?',
                options: [
                    {
                        value: 'all',
                        label: '🚀 Complete Analysis',
                        hint: 'Network info + Speed test + Ping test'
                    },
                    {
                        value: 'speed',
                        label: '⚡ Speed Test Only',
                        hint: 'Download speed measurement'
                    },
                    {
                        value: 'ping',
                        label: '🏓 Ping Test Only',
                        hint: 'Latency and connectivity test'
                    },
                    {
                        value: 'network',
                        label: '📡 Network Info Only',
                        hint: 'WiFi name and connection details'
                    }
                ]
            });
            if (isCancel(testType)) {
                cancel('Operation cancelled.');
                return;
            }
            yield this.runSpecificTest(testType);
            // Ask if user wants to run another test
            const runAgain = yield confirm({
                message: 'Would you like to run another test?'
            });
            if (isCancel(runAgain)) {
                outro(chalk.cyan('Thanks for using PingFlow v2! 🚀'));
                return;
            }
            if (runAgain) {
                console.log(); // Add spacing
                yield this.runInteractiveMode();
            }
            else {
                outro(chalk.cyan('Thanks for using PingFlow v2! 🚀'));
            }
        });
    }
    /**
     * Run a specific test type
     */
    runSpecificTest(testType) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (testType) {
                case 'all':
                    yield this.runAllTests();
                    break;
                case 'speed':
                    yield this.runSpeedTest();
                    break;
                case 'ping':
                    yield this.runPingTest();
                    break;
                case 'network':
                    yield this.runNetworkInfo();
                    break;
                default:
                    throw new Error(`Unknown test type: ${testType}`);
            }
        });
    }
    /**
     * Run all tests in sequence
     */
    runAllTests() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(chalk.bold.blue('\n🔍 Running Complete Network Analysis...\n'));
            // 1. Network Information
            yield this.runNetworkInfo();
            // 2. Connectivity Test
            const s = spinner();
            s.start('Testing internet connectivity...');
            try {
                const connectivityResult = yield NetworkDetector.testConnectivity();
                s.stop();
                if (!connectivityResult.isOnline) {
                    Utils.displayError(connectivityResult.error || 'No internet connection detected');
                    return;
                }
                Utils.displaySuccess(`Internet connection verified (${connectivityResult.latency}ms)`);
            }
            catch (error) {
                s.stop();
                Utils.displayError(error instanceof Error ? error : new Error(String(error)));
                return;
            }
            // 3. Ping Tests
            yield this.runPingTest();
            // 4. Speed Test
            yield this.runSpeedTest();
            console.log(chalk.bold.green('\n✅ Complete analysis finished!'));
        });
    }
    /**
     * Run network information test
     */
    runNetworkInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const s = spinner();
            s.start('Gathering network information...');
            try {
                const networkInfo = yield NetworkDetector.getNetworkInfo();
                s.stop();
                NetworkDetector.displayNetworkInfo(networkInfo);
            }
            catch (error) {
                s.stop();
                Utils.displayError(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
    /**
     * Run ping test
     */
    runPingTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pingResults = yield PingTester.runPingTests();
                PingTester.displayResults(pingResults);
            }
            catch (error) {
                Utils.displayError(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
    /**
     * Run speed test
     */
    runSpeedTest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const speedResult = yield SpeedTester.runSpeedTest();
                SpeedTester.displayResults(speedResult);
            }
            catch (error) {
                Utils.displayError(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
    /**
     * Parse command line arguments
     */
    static parseArgs(args) {
        const options = {};
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            switch (arg) {
                case '--help':
                case '-h':
                    this.displayHelp();
                    process.exit(0);
                    break;
                case '--version':
                case '-v':
                    this.displayVersion();
                    process.exit(0);
                    break;
                case '--auto':
                case '-a':
                    options.autoRun = true;
                    break;
                case '--speed':
                case '-s':
                    options.testType = 'speed';
                    break;
                case '--ping':
                case '-p':
                    options.testType = 'ping';
                    break;
                case '--network':
                case '-n':
                    options.testType = 'network';
                    break;
                case '--verbose':
                    options.verbose = true;
                    break;
                case '--no-intro':
                    options.skipIntro = true;
                    break;
                default:
                    if (arg.startsWith('-')) {
                        console.error(chalk.red(`Unknown option: ${arg}`));
                        console.log(chalk.gray('Use --help for available options'));
                        process.exit(1);
                    }
                    break;
            }
        }
        return options;
    }
    /**
     * Display help information
     */
    static displayHelp() {
        console.log(chalk.cyan.bold('PingFlow v2 - Network Analysis Tool\n'));
        console.log(chalk.yellow('Usage:'));
        console.log('  pingflow [options]\n');
        console.log(chalk.yellow('Options:'));
        console.log('  -h, --help      Show this help message');
        console.log('  -v, --version   Show version information');
        console.log('  -a, --auto      Run all tests automatically');
        console.log('  -s, --speed     Run speed test only');
        console.log('  -p, --ping      Run ping test only');
        console.log('  -n, --network   Show network information only');
        console.log('  --verbose       Show detailed system information');
        console.log('  --no-intro      Skip the intro banner\n');
        console.log(chalk.yellow('Examples:'));
        console.log('  pingflow                 # Interactive mode');
        console.log('  pingflow --auto          # Run all tests');
        console.log('  pingflow --speed         # Speed test only');
        console.log('  pingflow --ping          # Ping test only');
        console.log('  pingflow --network       # Network info only');
        console.log('  pingflow --auto --verbose # All tests with system info\n');
        console.log(chalk.gray('For more information, visit: https://github.com/Romaric250/pingflow'));
    }
    /**
     * Display version information
     */
    static displayVersion() {
        console.log(chalk.cyan('PingFlow v2.0.0'));
        console.log(chalk.gray('Cross-platform network analysis tool'));
        console.log(chalk.gray('Built with Node.js and TypeScript'));
    }
}
