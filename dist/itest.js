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
import { performance } from "perf_hooks";
import ProgressBar from "progress";
import chalk from "chalk";
const testDownloadSpeed = (url, sizeInMB) => __awaiter(void 0, void 0, void 0, function* () {
    const totalSize = sizeInMB * 5;
    let totalReceivedMB = 0;
    let totalDuration = 0;
    const bar = new ProgressBar(`${chalk.cyan("Downloading")} [:bar] :percent`, {
        total: totalSize,
        width: 30,
        complete: chalk.green("="),
        incomplete: chalk.gray(" "),
    });
    console.log(chalk.blue("Starting download..."));
    yield new Promise((resolve, reject) => {
        const startTime = performance.now();
        const options = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
            }
        };
        http.get(url, options, (res) => {
            let receivedMB = 0;
            res.on("data", (chunk) => {
                const chunkMB = chunk.length / (1024 * 1024);
                receivedMB += chunkMB;
                totalReceivedMB += chunkMB;
                bar.tick(chunkMB);
            });
            res.on("end", () => {
                const endTime = performance.now();
                totalDuration = (endTime - startTime);
                resolve();
            });
            res.on("error", (err) => {
                reject(err);
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
    const durationInSeconds = totalDuration / 1000;
    const averageSpeed = (totalReceivedMB / durationInSeconds) * 8;
    return averageSpeed;
});
const downloadUrl = "http://ipv4.download.thinkbroadband.com/10MB.zip";
const downloadSize = 10;
testDownloadSpeed(downloadUrl, downloadSize)
    .then((speed) => {
    console.log(chalk.green(`Download Speed: ${speed.toFixed(2)} Mbps`));
})
    .catch((err) => {
    console.error(chalk.red("Error during speed test:"), err);
});
