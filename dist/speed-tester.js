var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as http from 'http';
import * as https from 'https';
import { performance } from 'perf_hooks';
import ProgressBar from 'progress';
import chalk from 'chalk';
import { URL } from 'url';
export class SpeedTester {
    /**
     * Run comprehensive speed test with automatic server selection
     */
    static runSpeedTest() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const testOptions = Object.assign(Object.assign({}, this.DEFAULT_OPTIONS), options);
            console.log(chalk.bold.blue('🚀 Starting Speed Test...'));
            console.log(chalk.gray('Finding the best server...'));
            // Sort servers by priority
            const servers = [...this.TEST_SERVERS].sort((a, b) => a.priority - b.priority);
            for (const server of servers) {
                console.log(chalk.gray(`Trying ${server.name}...`));
                try {
                    const result = yield this.testDownloadSpeed(server, testOptions);
                    if (result.success) {
                        console.log(chalk.green(`✓ Using ${server.name} for speed test`));
                        return result;
                    }
                }
                catch (error) {
                    console.log(chalk.yellow(`⚠ ${server.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
                    continue;
                }
            }
            throw new Error('All speed test servers failed. Please check your internet connection.');
        });
    }
    /**
     * Test download speed from a specific server
     */
    static testDownloadSpeed(server, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalReceivedMB = 0;
            let totalDuration = 0;
            let attempt = 0;
            const parsedUrl = new URL(server.downloadUrl);
            const httpModule = parsedUrl.protocol === 'https:' ? https : http;
            const downloadAttempt = () => {
                return new Promise((resolve, reject) => {
                    totalReceivedMB = 0;
                    const startTime = performance.now();
                    const requestOptions = {
                        headers: {
                            'User-Agent': options.userAgent,
                            'Accept': '*/*',
                            'Accept-Encoding': 'identity', // Disable compression for accurate speed measurement
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache'
                        },
                        timeout: options.timeout
                    };
                    const req = httpModule.get(server.downloadUrl, requestOptions, (res) => {
                        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
                            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                            return;
                        }
                        // Determine actual file size
                        let totalSizeMB = server.expectedSizeMB;
                        if (res.headers['content-length']) {
                            const contentLength = parseInt(res.headers['content-length'], 10);
                            totalSizeMB = contentLength / (1024 * 1024);
                        }
                        // Create progress bar
                        const bar = new ProgressBar(`${chalk.cyan('Downloading')} [:bar] :percent :rateMB/s ETA: :etas`, {
                            total: totalSizeMB,
                            width: 30,
                            complete: chalk.green('█'),
                            incomplete: chalk.gray('░'),
                            renderThrottle: 100,
                            callback: () => {
                                console.log(chalk.green('\n✓ Download completed'));
                            }
                        });
                        let lastTime = startTime;
                        let lastReceived = 0;
                        res.on('data', (chunk) => {
                            const chunkMB = chunk.length / (1024 * 1024);
                            totalReceivedMB += chunkMB;
                            const currentTime = performance.now();
                            const timeDiff = (currentTime - lastTime) / 1000; // Convert to seconds
                            if (timeDiff > 0.1) { // Update every 100ms
                                const receivedDiff = totalReceivedMB - lastReceived;
                                const currentSpeed = (receivedDiff / timeDiff) * 8; // Convert to Mbps
                                bar.tick(chunkMB, {
                                    rate: currentSpeed.toFixed(1)
                                });
                                lastTime = currentTime;
                                lastReceived = totalReceivedMB;
                            }
                            // Safety check: stop if test is taking too long
                            if (currentTime - startTime > options.maxTestDuration) {
                                req.destroy();
                                reject(new Error('Test duration exceeded maximum allowed time'));
                            }
                        });
                        res.on('end', () => {
                            const endTime = performance.now();
                            totalDuration = endTime - startTime;
                            resolve();
                        });
                        res.on('error', (err) => {
                            reject(err);
                        });
                    });
                    req.on('error', (err) => {
                        reject(err);
                    });
                    req.on('timeout', () => {
                        req.destroy();
                        reject(new Error('Request timed out'));
                    });
                    // Set timeout
                    req.setTimeout(options.timeout, () => {
                        req.destroy();
                        reject(new Error('Request timed out'));
                    });
                });
            };
            // Retry logic
            while (attempt < options.retries) {
                try {
                    yield downloadAttempt();
                    break;
                }
                catch (err) {
                    attempt++;
                    if (attempt >= options.retries) {
                        throw err;
                    }
                    console.log(chalk.yellow(`Retrying... (${attempt}/${options.retries})`));
                    yield new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                }
            }
            const durationInSeconds = totalDuration / 1000;
            const downloadSpeed = (totalReceivedMB / durationInSeconds) * 8; // Convert MB/s to Mbps
            return {
                downloadSpeed,
                serverUsed: server.name,
                totalDataMB: totalReceivedMB,
                durationSeconds: durationInSeconds,
                success: true
            };
        });
    }
    /**
     * Display speed test results in a user-friendly format
     */
    static displayResults(result) {
        console.log(chalk.bold.cyan('\n📊 Speed Test Results:'));
        console.log(chalk.gray('─'.repeat(50)));
        if (result.success) {
            console.log(chalk.green(`✓ Test completed successfully`));
            console.log(chalk.blue(`🌐 Server: ${result.serverUsed}`));
            console.log(chalk.yellow(`⬇️  Download Speed: ${result.downloadSpeed.toFixed(2)} Mbps`));
            if (result.uploadSpeed) {
                console.log(chalk.yellow(`⬆️  Upload Speed: ${result.uploadSpeed.toFixed(2)} Mbps`));
            }
            if (result.latency) {
                console.log(chalk.gray(`⏱️  Latency: ${result.latency.toFixed(0)} ms`));
            }
            console.log(chalk.gray(`📦 Data Transferred: ${result.totalDataMB.toFixed(2)} MB`));
            console.log(chalk.gray(`⏰ Duration: ${result.durationSeconds.toFixed(2)} seconds`));
            // Speed classification
            const speed = result.downloadSpeed;
            let classification = '';
            let emoji = '';
            if (speed >= 100) {
                classification = 'Excellent';
                emoji = '🚀';
            }
            else if (speed >= 50) {
                classification = 'Very Good';
                emoji = '⚡';
            }
            else if (speed >= 25) {
                classification = 'Good';
                emoji = '👍';
            }
            else if (speed >= 10) {
                classification = 'Fair';
                emoji = '👌';
            }
            else {
                classification = 'Slow';
                emoji = '🐌';
            }
            console.log(chalk.bold(`${emoji} Speed Rating: ${classification}`));
        }
        else {
            console.log(chalk.red(`✗ Test failed: ${result.error}`));
        }
        console.log(chalk.gray('─'.repeat(50)));
    }
}
SpeedTester.DEFAULT_OPTIONS = {
    timeout: 15000,
    retries: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    maxTestDuration: 30000
};
SpeedTester.TEST_SERVERS = [
    {
        name: 'Cloudflare',
        downloadUrl: 'https://speed.cloudflare.com/__down?bytes=10485760', // 10MB
        expectedSizeMB: 10,
        priority: 1
    },
    {
        name: 'Fast.com (Netflix)',
        downloadUrl: 'https://api.fast.com/netflix/speedtest/v2/download?bytes=10485760',
        expectedSizeMB: 10,
        priority: 2
    },
    {
        name: 'ThinkBroadband',
        downloadUrl: 'http://ipv4.download.thinkbroadband.com/10MB.zip',
        expectedSizeMB: 10,
        priority: 3
    },
    {
        name: 'SpeedTest.net',
        downloadUrl: 'http://speedtest.ftp.otenet.gr/files/test10Mb.db',
        expectedSizeMB: 10,
        priority: 4
    },
    {
        name: 'Proof General',
        downloadUrl: 'http://proof.ovh.net/files/10Mb.dat',
        expectedSizeMB: 10,
        priority: 5
    }
];
