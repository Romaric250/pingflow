import http from "http";
import { performance } from "perf_hooks";
import ProgressBar from "progress";
import chalk from "chalk";

const testDownloadSpeed = async (url: string, sizeInMB: number): Promise<number> => {
    const totalSize = sizeInMB; 
    let totalReceivedMB = 0;
    let totalDuration = 0;

   
    const bar = new ProgressBar(`${chalk.cyan("In Progress...")} [:bar] :percent`, {
        total: totalSize,
        width: 30,
        complete: chalk.green("█"),
        incomplete: chalk.gray("░"),
        renderThrottle: 16,
    });


    console.log(chalk.bold.blue("🚀Starting Test..."));
    console.log(chalk.gray("Testing speed..."));

    await new Promise<void>((resolve, reject) => {
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
    console.log(chalk.bold.blue("Test Completed"));
    console.log(chalk.green(`Download Speed: ${averageSpeed.toFixed(2)} Mbps`));
    return averageSpeed;
};

const downloadUrl = "http://ipv4.download.thinkbroadband.com/10MB.zip"; 
const downloadSize = 10; 
testDownloadSpeed(downloadUrl, downloadSize)
    .then((speed) => {
        console.log(chalk.green(`Your Internet speed is: ${speed.toFixed(2)} Mbps`));
    })
    .catch((err) => {
        console.error(chalk.red("Error during speed test:"), err);
    });
