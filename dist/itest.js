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
import http from "http";
import chalk from "chalk";
import { intro, outro, spinner, log } from "@clack/prompts";
import { performance } from "perf_hooks";
import ProgressBar from "progress";
// Function to test download speed
const testDownloadSpeed = (url, sizeInMB) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = performance.now();
    const bar = new ProgressBar("  Downloading [:bar] :percent", {
        total: sizeInMB,
        width: 30,
        complete: "=",
        incomplete: " ",
    });
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let receivedMB = 0;
            res.on("data", (chunk) => {
                receivedMB += chunk.length / (1024 * 1024); // Convert to MB
                bar.tick(receivedMB > sizeInMB ? sizeInMB - bar.curr : chunk.length / (1024 * 1024));
            });
            res.on("end", () => {
                const endTime = performance.now();
                const durationInSeconds = (endTime - startTime) / 1000;
                resolve((sizeInMB / durationInSeconds) * 8); // Speed in Mbps
            });
            res.on("error", reject);
        }).on("error", reject);
    });
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    intro(chalk.blue.bold("🚀 Internet Speed Tester"));
    const loadSpinner = spinner();
    try {
        // Test Download Speed
        loadSpinner.start(chalk.cyan("Testing download speed..."));
        const downloadSpeed = yield testDownloadSpeed("http://ipv4.download.thinkbroadband.com/100MB.zip", 10);
        loadSpinner.stop(chalk.green.bold(`Download Speed: ${downloadSpeed.toFixed(2)} Mbps`));
        log.success(chalk.green("✅ Test completed successfully!"));
    }
    catch (error) {
        loadSpinner.stop(chalk.red("❌ Error occurred during the test."));
        log.error(chalk.red(error.message || "An unknown error occurred."));
    }
    outro(chalk.yellow.bold("Thank you for using Internet Speed Tester!"));
});
main().catch((err) => {
    console.error(chalk.red("An unexpected error occurred:"), err);
    process.exit(1);
});
