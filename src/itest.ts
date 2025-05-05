#!/usr/bin/env node

import * as http from "http";
import * as https from "https";
import { performance } from "perf_hooks";
import ProgressBar from "progress";
import chalk from "chalk";
import { URL } from "url";

// Define an Options interface for configuration parameters
interface Options {
  timeout: number; 
  retries: number; 
  userAgent: string; 
}

// Default configuration options
const defaultOptions: Options = {
  timeout: 10000, // 10-second timeout
  retries: 3,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
};

// Async function to test download speed
const testDownloadSpeed = async (
  url: string,
  expectedSizeMB: number,
  options: Options = defaultOptions
): Promise<number> => {
  let totalReceivedMB = 0;
  let totalDuration = 0;
  let attempt = 0;

  // Select proper module based on URL protocol
  const parsedUrl = new URL(url);
  const httpModule = parsedUrl.protocol === "https:" ? https : http;

  // Function for a single download attempt with a Promise
  const downloadAttempt = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Reset total received data for this attempt
      totalReceivedMB = 0;
      const startTime = performance.now();

      const requestOptions = {
        headers: {
          "User-Agent": options.userAgent,
        },
      };

      const req = httpModule.get(url, requestOptions, (res) => {
        if (res.statusCode && res.statusCode !== 200) {
          reject(new Error(`Failed with status code ${res.statusCode}`));
          return;
        }

        // Use 'Content-Length' header if available to determine exact file size
        let totalSizeMB = expectedSizeMB;
        const expectedBytes = expectedSizeMB * 1024 * 1024;
        if (res.headers["content-length"]) {
          const contentLength = parseInt(res.headers["content-length"] as string, 10);
          totalSizeMB = contentLength / (1024 * 1024);
          // Log a warning if the server-reported size deviates significantly from expectations
          if (Math.abs(contentLength - expectedBytes) > expectedBytes * 0.1) {
            console.warn(
              chalk.yellow(
                "Warning: Content-Length differs significantly from expected size."
              )
            );
          }
        }

        // testing new commit form new localhost and to see if it works
        const bar = new ProgressBar(`${chalk.cyan("In Progress...")} [:bar] :percent`, {
          total: totalSizeMB,
          width: 30,
          complete: chalk.green("█"),
          incomplete: chalk.gray("░"),
          renderThrottle: 16,
        });

        res.on("data", (chunk: Buffer) => {
          const chunkMB = chunk.length / (1024 * 1024);
          totalReceivedMB += chunkMB;
          bar.tick(chunkMB);
        });

        res.on("end", () => {
          const endTime = performance.now();
          totalDuration = endTime - startTime;
          resolve();
        });

        res.on("error", (err) => {
          reject(err);
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      // Set a timeout to catch stalled connections
      req.setTimeout(options.timeout, () => {
        req.abort();
        reject(new Error("Request timed out"));
      });
    });
  };

  console.log(chalk.bold.blue("🚀 Starting Test..."));
  console.log(chalk.gray("Testing speed..."));

  // Loop through attempts until successful download or retry limit is reached
  while (attempt < options.retries) {
    try {
      await downloadAttempt();
      break; // Successful attempt exits the loop
    } catch (err) {
      attempt++;
      console.error(chalk.red(`Attempt ${attempt} failed:`), err);
      if (attempt >= options.retries) {
        throw new Error("All attempts failed. Please check your connection and try again.");
      } else {
        console.log(chalk.yellow(`Retrying... (${attempt}/${options.retries})`));
      }
    }
  }

  const durationInSeconds = totalDuration / 1000;
  const averageSpeed = (totalReceivedMB / durationInSeconds) * 8; // Convert MB/s to Mbps
  console.log(chalk.bold.blue("Test Completed"));
  console.log(
    chalk.green(
      `Download Speed: ${averageSpeed.toFixed(2)} Mbps (Total Data: ${totalReceivedMB.toFixed(
        2
      )} MB, Duration: ${durationInSeconds.toFixed(2)} sec)`
    )
  );
  return averageSpeed;
};

// Default test parameters
const downloadUrl = "http://ipv4.download.thinkbroadband.com/10MB.zip";
const downloadSize = 10;

testDownloadSpeed(downloadUrl, downloadSize)
  .then((speed) => {
    console.log(chalk.green(`Your Internet speed is: ${speed.toFixed(2)} Mbps`));
  })
  .catch((err) => {
    console.error(chalk.red("Error during speed test:"), err);
  });
