import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import chalk from 'chalk';

const execAsync = promisify(exec);

export interface PingResult {
  host: string;
  alive: boolean;
  time?: number; // milliseconds
  min?: number;
  max?: number;
  avg?: number;
  stddev?: number;
  packetLoss?: number;
  error?: string;
}

export interface PingTestOptions {
  count: number;
  timeout: number;
  interval: number;
}

export class PingTester {
  private static readonly DEFAULT_OPTIONS: PingTestOptions = {
    count: 4,
    timeout: 5000,
    interval: 1000
  };

  private static readonly TEST_HOSTS = [
    { name: 'Google DNS', host: '8.8.8.8' },
    { name: 'Cloudflare DNS', host: '1.1.1.1' },
    { name: 'Google', host: 'google.com' },
    { name: 'Cloudflare', host: 'cloudflare.com' }
  ];

  /**
   * Run ping tests to multiple hosts
   */
  static async runPingTests(options: Partial<PingTestOptions> = {}): Promise<PingResult[]> {
    const testOptions = { ...this.DEFAULT_OPTIONS, ...options };
    
    console.log(chalk.bold.blue('🏓 Running Ping Tests...'));
    console.log(chalk.gray(`Testing ${this.TEST_HOSTS.length} hosts with ${testOptions.count} packets each`));
    
    const results: PingResult[] = [];
    
    for (const { name, host } of this.TEST_HOSTS) {
      console.log(chalk.gray(`Pinging ${name} (${host})...`));
      
      try {
        const result = await this.pingHost(host, testOptions);
        results.push(result);
        
        if (result.alive) {
          console.log(chalk.green(`✓ ${name}: ${result.avg?.toFixed(1)}ms avg`));
        } else {
          console.log(chalk.red(`✗ ${name}: Failed`));
        }
      } catch (error) {
        console.log(chalk.red(`✗ ${name}: Error`));
        results.push({
          host,
          alive: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  /**
   * Ping a specific host
   */
  static async pingHost(host: string, options: PingTestOptions): Promise<PingResult> {
    const platform = os.platform();
    
    try {
      let command: string;
      
      switch (platform) {
        case 'win32':
          command = `ping -n ${options.count} -w ${options.timeout} ${host}`;
          break;
        case 'darwin':
        case 'linux':
        default:
          command = `ping -c ${options.count} -W ${Math.ceil(options.timeout / 1000)} ${host}`;
          break;
      }
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && stderr.trim()) {
        throw new Error(stderr.trim());
      }
      
      return this.parsePingOutput(host, stdout, platform);
    } catch (error) {
      return {
        host,
        alive: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Parse ping command output based on platform
   */
  private static parsePingOutput(host: string, output: string, platform: string): PingResult {
    const result: PingResult = {
      host,
      alive: false
    };
    
    try {
      if (platform === 'win32') {
        return this.parseWindowsPingOutput(host, output);
      } else {
        return this.parseUnixPingOutput(host, output);
      }
    } catch (error) {
      result.error = 'Failed to parse ping output';
      return result;
    }
  }

  /**
   * Parse Windows ping output
   */
  private static parseWindowsPingOutput(host: string, output: string): PingResult {
    const result: PingResult = { host, alive: false };
    
    // Check if ping was successful
    if (output.includes('Request timed out') || output.includes('Destination host unreachable')) {
      return result;
    }
    
    // Extract individual ping times
    const timeMatches = output.match(/time[<=](\d+)ms/g);
    if (!timeMatches || timeMatches.length === 0) {
      return result;
    }
    
    const times = timeMatches.map(match => {
      const timeMatch = match.match(/(\d+)ms/);
      return timeMatch ? parseInt(timeMatch[1], 10) : 0;
    }).filter(time => time > 0);
    
    if (times.length === 0) {
      return result;
    }
    
    result.alive = true;
    result.min = Math.min(...times);
    result.max = Math.max(...times);
    result.avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    
    // Calculate standard deviation
    const variance = times.reduce((sum, time) => sum + Math.pow(time - result.avg!, 2), 0) / times.length;
    result.stddev = Math.sqrt(variance);
    
    // Extract packet loss
    const lossMatch = output.match(/\((\d+)% loss\)/);
    if (lossMatch) {
      result.packetLoss = parseInt(lossMatch[1], 10);
    }
    
    return result;
  }

  /**
   * Parse Unix/Linux/macOS ping output
   */
  private static parseUnixPingOutput(host: string, output: string): PingResult {
    const result: PingResult = { host, alive: false };
    
    // Check if ping was successful
    if (output.includes('100% packet loss') || output.includes('Network is unreachable')) {
      return result;
    }
    
    // Extract statistics line (e.g., "round-trip min/avg/max/stddev = 1.234/5.678/9.012/2.345 ms")
    const statsMatch = output.match(/round-trip min\/avg\/max\/stddev = ([\d.]+)\/([\d.]+)\/([\d.]+)\/([\d.]+) ms/);
    if (statsMatch) {
      result.alive = true;
      result.min = parseFloat(statsMatch[1]);
      result.avg = parseFloat(statsMatch[2]);
      result.max = parseFloat(statsMatch[3]);
      result.stddev = parseFloat(statsMatch[4]);
    } else {
      // Fallback: try to extract individual ping times
      const timeMatches = output.match(/time=([\d.]+) ms/g);
      if (timeMatches && timeMatches.length > 0) {
        const times = timeMatches.map(match => {
          const timeMatch = match.match(/([\d.]+) ms/);
          return timeMatch ? parseFloat(timeMatch[1]) : 0;
        }).filter(time => time > 0);
        
        if (times.length > 0) {
          result.alive = true;
          result.min = Math.min(...times);
          result.max = Math.max(...times);
          result.avg = times.reduce((sum, time) => sum + time, 0) / times.length;
          
          const variance = times.reduce((sum, time) => sum + Math.pow(time - result.avg!, 2), 0) / times.length;
          result.stddev = Math.sqrt(variance);
        }
      }
    }
    
    // Extract packet loss
    const lossMatch = output.match(/(\d+)% packet loss/);
    if (lossMatch) {
      result.packetLoss = parseInt(lossMatch[1], 10);
    }
    
    return result;
  }

  /**
   * Display ping test results
   */
  static displayResults(results: PingResult[]): void {
    console.log(chalk.bold.cyan('\n🏓 Ping Test Results:'));
    console.log(chalk.gray('─'.repeat(60)));
    
    const successfulPings = results.filter(r => r.alive);
    const failedPings = results.filter(r => !r.alive);
    
    if (successfulPings.length > 0) {
      console.log(chalk.green(`✓ ${successfulPings.length}/${results.length} hosts reachable`));
      console.log();
      
      // Display detailed results
      successfulPings.forEach(result => {
        console.log(chalk.blue(`📍 ${result.host}:`));
        if (result.avg !== undefined) {
          console.log(chalk.gray(`   Average: ${result.avg.toFixed(1)}ms`));
        }
        if (result.min !== undefined && result.max !== undefined) {
          console.log(chalk.gray(`   Range: ${result.min.toFixed(1)}ms - ${result.max.toFixed(1)}ms`));
        }
        if (result.stddev !== undefined) {
          console.log(chalk.gray(`   Std Dev: ${result.stddev.toFixed(1)}ms`));
        }
        if (result.packetLoss !== undefined) {
          const lossColor = result.packetLoss === 0 ? chalk.green : result.packetLoss < 10 ? chalk.yellow : chalk.red;
          console.log(lossColor(`   Packet Loss: ${result.packetLoss}%`));
        }
        console.log();
      });
      
      // Calculate overall statistics
      const avgLatencies = successfulPings.map(r => r.avg).filter(avg => avg !== undefined) as number[];
      if (avgLatencies.length > 0) {
        const overallAvg = avgLatencies.reduce((sum, avg) => sum + avg, 0) / avgLatencies.length;
        console.log(chalk.bold(`📊 Overall Average Latency: ${overallAvg.toFixed(1)}ms`));
        
        // Latency classification
        let classification = '';
        let emoji = '';
        
        if (overallAvg <= 20) {
          classification = 'Excellent';
          emoji = '🚀';
        } else if (overallAvg <= 50) {
          classification = 'Good';
          emoji = '👍';
        } else if (overallAvg <= 100) {
          classification = 'Fair';
          emoji = '👌';
        } else {
          classification = 'Poor';
          emoji = '🐌';
        }
        
        console.log(chalk.bold(`${emoji} Latency Rating: ${classification}`));
      }
    }
    
    if (failedPings.length > 0) {
      console.log(chalk.red(`\n✗ ${failedPings.length} hosts unreachable:`));
      failedPings.forEach(result => {
        console.log(chalk.red(`   ${result.host}: ${result.error || 'Failed'}`));
      });
    }
    
    console.log(chalk.gray('─'.repeat(60)));
  }
}
