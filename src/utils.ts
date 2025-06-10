import * as os from 'os';
import chalk from 'chalk';
import figlet from 'figlet';

export interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  osVersion: string;
  hostname: string;
  uptime: number;
  totalMemory: number;
  freeMemory: number;
}

export class Utils {
  /**
   * Display application banner
   */
  static displayBanner(): void {
    console.clear();
    
    try {
      const banner = figlet.textSync('PingFlow v2', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      });
      
      console.log(chalk.cyan(banner));
    } catch (error) {
      // Fallback if figlet fails
      console.log(chalk.cyan.bold('\n██████╗ ██╗███╗   ██╗ ██████╗ ███████╗██╗      ██████╗ ██╗    ██╗'));
      console.log(chalk.cyan.bold('██╔══██╗██║████╗  ██║██╔════╝ ██╔════╝██║     ██╔═══██╗██║    ██║'));
      console.log(chalk.cyan.bold('██████╔╝██║██╔██╗ ██║██║  ███╗█████╗  ██║     ██║   ██║██║ █╗ ██║'));
      console.log(chalk.cyan.bold('██╔═══╝ ██║██║╚██╗██║██║   ██║██╔══╝  ██║     ██║   ██║██║███╗██║'));
      console.log(chalk.cyan.bold('██║     ██║██║ ╚████║╚██████╔╝██║     ███████╗╚██████╔╝╚███╔███╔╝'));
      console.log(chalk.cyan.bold('╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ '));
      console.log(chalk.cyan.bold('                                                                v2.0'));
    }
    
    console.log(chalk.gray('─'.repeat(70)));
    console.log(chalk.yellow('🌐 Comprehensive Internet Speed & Network Analysis Tool'));
    console.log(chalk.gray('   Cross-platform • Accurate • Reliable'));
    console.log(chalk.gray('─'.repeat(70)));
    console.log();
  }

  /**
   * Get system information
   */
  static getSystemInfo(): SystemInfo {
    return {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      osVersion: os.release(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem()
    };
  }

  /**
   * Display system information
   */
  static displaySystemInfo(systemInfo: SystemInfo): void {
    console.log(chalk.bold.cyan('\n💻 System Information:'));
    console.log(chalk.gray('─'.repeat(40)));
    
    console.log(chalk.blue(`🖥️  Platform: ${this.getPlatformName(systemInfo.platform)} (${systemInfo.arch})`));
    console.log(chalk.blue(`📦 Node.js: ${systemInfo.nodeVersion}`));
    console.log(chalk.gray(`🏠 Hostname: ${systemInfo.hostname}`));
    console.log(chalk.gray(`⏰ Uptime: ${this.formatUptime(systemInfo.uptime)}`));
    console.log(chalk.gray(`💾 Memory: ${this.formatBytes(systemInfo.freeMemory)} / ${this.formatBytes(systemInfo.totalMemory)} available`));
    
    console.log(chalk.gray('─'.repeat(40)));
  }

  /**
   * Get user-friendly platform name
   */
  private static getPlatformName(platform: string): string {
    switch (platform) {
      case 'win32':
        return 'Windows';
      case 'darwin':
        return 'macOS';
      case 'linux':
        return 'Linux';
      case 'freebsd':
        return 'FreeBSD';
      case 'openbsd':
        return 'OpenBSD';
      case 'android':
        return 'Android';
      default:
        return platform;
    }
  }

  /**
   * Format uptime in human-readable format
   */
  private static formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    const parts: string[] = [];
    
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.length > 0 ? parts.join(' ') : '< 1m';
  }

  /**
   * Format bytes in human-readable format
   */
  static formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    
    return `${size.toFixed(1)} ${sizes[i]}`;
  }

  /**
   * Format speed in human-readable format
   */
  static formatSpeed(mbps: number): string {
    if (mbps >= 1000) {
      return `${(mbps / 1000).toFixed(2)} Gbps`;
    }
    return `${mbps.toFixed(2)} Mbps`;
  }

  /**
   * Sleep for specified milliseconds
   */
  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Display loading spinner
   */
  static async withSpinner<T>(
    promise: Promise<T>, 
    message: string = 'Loading...'
  ): Promise<T> {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let frameIndex = 0;
    
    const spinner = setInterval(() => {
      process.stdout.write(`\r${chalk.cyan(frames[frameIndex])} ${chalk.gray(message)}`);
      frameIndex = (frameIndex + 1) % frames.length;
    }, 100);
    
    try {
      const result = await promise;
      clearInterval(spinner);
      process.stdout.write('\r' + ' '.repeat(message.length + 5) + '\r'); // Clear the line
      return result;
    } catch (error) {
      clearInterval(spinner);
      process.stdout.write('\r' + ' '.repeat(message.length + 5) + '\r'); // Clear the line
      throw error;
    }
  }

  /**
   * Display error message with proper formatting
   */
  static displayError(error: Error | string, context?: string): void {
    console.log();
    console.log(chalk.red.bold('❌ Error:'));
    
    if (context) {
      console.log(chalk.red(`Context: ${context}`));
    }
    
    const message = error instanceof Error ? error.message : error;
    console.log(chalk.red(`Message: ${message}`));
    
    if (error instanceof Error && error.stack) {
      console.log(chalk.gray('\nStack trace:'));
      console.log(chalk.gray(error.stack));
    }
    
    console.log();
    console.log(chalk.yellow('💡 Troubleshooting tips:'));
    console.log(chalk.gray('• Check your internet connection'));
    console.log(chalk.gray('• Verify firewall settings'));
    console.log(chalk.gray('• Try running as administrator (Windows) or with sudo (Linux/macOS)'));
    console.log(chalk.gray('• Check if antivirus software is blocking the application'));
    console.log();
  }

  /**
   * Display success message
   */
  static displaySuccess(message: string): void {
    console.log(chalk.green.bold(`✅ ${message}`));
  }

  /**
   * Display warning message
   */
  static displayWarning(message: string): void {
    console.log(chalk.yellow.bold(`⚠️  ${message}`));
  }

  /**
   * Display info message
   */
  static displayInfo(message: string): void {
    console.log(chalk.blue.bold(`ℹ️  ${message}`));
  }

  /**
   * Validate if a string is a valid URL
   */
  static isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate if a string is a valid IP address
   */
  static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * Get current timestamp in ISO format
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format duration in human-readable format
   */
  static formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Check if running with elevated privileges
   */
  static isElevated(): boolean {
    try {
      // On Windows, check if running as administrator
      if (os.platform() === 'win32') {
        return process.getuid ? process.getuid() === 0 : false;
      }
      
      // On Unix-like systems, check if running as root
      return process.getuid ? process.getuid() === 0 : false;
    } catch {
      return false;
    }
  }
}
