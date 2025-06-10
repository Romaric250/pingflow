#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CLI } from './cli.js';
import chalk from 'chalk';
/**
 * PingFlow v2 - Comprehensive Network Analysis Tool
 *
 * Features:
 * - Cross-platform internet speed testing
 * - Network connectivity detection
 * - WiFi name and network information
 * - Ping latency testing
 * - Comprehensive error handling
 * - Beautiful CLI interface
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Parse command line arguments
            const args = process.argv.slice(2);
            const options = CLI.parseArgs(args);
            // Create and run CLI
            const cli = new CLI(options);
            yield cli.run();
        }
        catch (error) {
            // Handle unexpected errors
            console.error(chalk.red('\n💥 An unexpected error occurred:'));
            if (error instanceof Error) {
                console.error(chalk.red(error.message));
                if (process.env.NODE_ENV === 'development') {
                    console.error(chalk.gray('\nStack trace:'));
                    console.error(chalk.gray(error.stack));
                }
            }
            else {
                console.error(chalk.red(String(error)));
            }
            console.log(chalk.yellow('\n💡 If this error persists, please report it at:'));
            console.log(chalk.blue('https://github.com/Romaric250/pingflow/issues'));
            process.exit(1);
        }
    });
}
// Handle process signals gracefully
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n👋 Goodbye! Thanks for using PingFlow v2'));
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log(chalk.yellow('\n\n👋 Process terminated. Thanks for using PingFlow v2'));
    process.exit(0);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('\n💥 Unhandled Promise Rejection:'));
    console.error(chalk.red(String(reason)));
    if (process.env.NODE_ENV === 'development') {
        console.error(chalk.gray('Promise:'), promise);
    }
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(chalk.red('\n💥 Uncaught Exception:'));
    console.error(chalk.red(error.message));
    if (process.env.NODE_ENV === 'development') {
        console.error(chalk.gray('\nStack trace:'));
        console.error(chalk.gray(error.stack));
    }
    process.exit(1);
});
// Run the application
main();
