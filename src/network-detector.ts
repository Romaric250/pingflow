import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as dns from 'dns';
import chalk from 'chalk';

const execAsync = promisify(exec);
const dnsLookup = promisify(dns.lookup);

export interface NetworkInfo {
  isConnected: boolean;
  connectionType: 'wifi' | 'ethernet' | 'mobile' | 'unknown';
  wifiName?: string;
  ipAddress?: string;
  gateway?: string;
  dnsServers?: string[];
  interfaceName?: string;
}

export interface ConnectivityTestResult {
  isOnline: boolean;
  latency?: number;
  error?: string;
}

export class NetworkDetector {
  private static readonly TEST_HOSTS = [
    'google.com',
    'cloudflare.com',
    '8.8.8.8',
    'microsoft.com'
  ];

  /**
   * Comprehensive network connectivity test
   */
  static async testConnectivity(): Promise<ConnectivityTestResult> {
    console.log(chalk.gray('🔍 Testing internet connectivity...'));
    
    for (const host of this.TEST_HOSTS) {
      try {
        const startTime = Date.now();
        await dnsLookup(host);
        const latency = Date.now() - startTime;
        
        console.log(chalk.green(`✓ Connected to ${host} (${latency}ms)`));
        return { isOnline: true, latency };
      } catch (error) {
        console.log(chalk.yellow(`⚠ Failed to reach ${host}`));
        continue;
      }
    }
    
    return { 
      isOnline: false, 
      error: 'No internet connectivity detected. Please check your network connection.' 
    };
  }

  /**
   * Get comprehensive network information
   */
  static async getNetworkInfo(): Promise<NetworkInfo> {
    const platform = os.platform();
    
    try {
      switch (platform) {
        case 'win32':
          return await this.getWindowsNetworkInfo();
        case 'darwin':
          return await this.getMacNetworkInfo();
        case 'linux':
          return await this.getLinuxNetworkInfo();
        default:
          return await this.getGenericNetworkInfo();
      }
    } catch (error) {
      console.warn(chalk.yellow('Warning: Could not retrieve detailed network information'));
      return await this.getGenericNetworkInfo();
    }
  }

  /**
   * Windows-specific network information
   */
  private static async getWindowsNetworkInfo(): Promise<NetworkInfo> {
    try {
      // Get WiFi information
      const wifiResult = await execAsync('netsh wlan show profiles');
      const currentWifiResult = await execAsync('netsh wlan show interfaces');
      
      let wifiName: string | undefined;
      let connectionType: 'wifi' | 'ethernet' | 'mobile' | 'unknown' = 'unknown';
      
      // Parse current WiFi connection
      if (currentWifiResult.stdout.includes('State') && currentWifiResult.stdout.includes('connected')) {
        const ssidMatch = currentWifiResult.stdout.match(/SSID\s*:\s*(.+)/);
        if (ssidMatch) {
          wifiName = ssidMatch[1].trim();
          connectionType = 'wifi';
        }
      }
      
      // Get IP configuration
      const ipconfigResult = await execAsync('ipconfig');
      const ipMatch = ipconfigResult.stdout.match(/IPv4 Address[.\s]*:\s*([0-9.]+)/);
      const ipAddress = ipMatch ? ipMatch[1] : undefined;
      
      // Get gateway
      const gatewayResult = await execAsync('ipconfig | findstr "Default Gateway"');
      const gatewayMatch = gatewayResult.stdout.match(/([0-9.]+)/);
      const gateway = gatewayMatch ? gatewayMatch[1] : undefined;
      
      // If no WiFi but has IP, assume ethernet
      if (!wifiName && ipAddress && connectionType === 'unknown') {
        connectionType = 'ethernet';
      }
      
      return {
        isConnected: !!ipAddress,
        connectionType,
        wifiName,
        ipAddress,
        gateway
      };
    } catch (error) {
      return await this.getGenericNetworkInfo();
    }
  }

  /**
   * macOS-specific network information
   */
  private static async getMacNetworkInfo(): Promise<NetworkInfo> {
    try {
      // Get WiFi information
      const wifiResult = await execAsync('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I');
      
      let wifiName: string | undefined;
      let connectionType: 'wifi' | 'ethernet' | 'mobile' | 'unknown' = 'unknown';
      
      const ssidMatch = wifiResult.stdout.match(/\s*SSID:\s*(.+)/);
      if (ssidMatch) {
        wifiName = ssidMatch[1].trim();
        connectionType = 'wifi';
      }
      
      // Get IP information
      const ifconfigResult = await execAsync('ifconfig');
      const ipMatch = ifconfigResult.stdout.match(/inet\s+([0-9.]+).*broadcast/);
      const ipAddress = ipMatch ? ipMatch[1] : undefined;
      
      // Get gateway
      const routeResult = await execAsync('route -n get default');
      const gatewayMatch = routeResult.stdout.match(/gateway:\s*([0-9.]+)/);
      const gateway = gatewayMatch ? gatewayMatch[1] : undefined;
      
      if (!wifiName && ipAddress && connectionType === 'unknown') {
        connectionType = 'ethernet';
      }
      
      return {
        isConnected: !!ipAddress,
        connectionType,
        wifiName,
        ipAddress,
        gateway
      };
    } catch (error) {
      return await this.getGenericNetworkInfo();
    }
  }

  /**
   * Linux-specific network information
   */
  private static async getLinuxNetworkInfo(): Promise<NetworkInfo> {
    try {
      let wifiName: string | undefined;
      let connectionType: 'wifi' | 'ethernet' | 'mobile' | 'unknown' = 'unknown';
      
      // Try to get WiFi information using different methods
      try {
        const iwconfigResult = await execAsync('iwconfig 2>/dev/null');
        const ssidMatch = iwconfigResult.stdout.match(/ESSID:"([^"]+)"/);
        if (ssidMatch) {
          wifiName = ssidMatch[1];
          connectionType = 'wifi';
        }
      } catch {
        // Try nmcli as fallback
        try {
          const nmcliResult = await execAsync('nmcli -t -f active,ssid dev wifi | grep "^yes"');
          const ssidMatch = nmcliResult.stdout.match(/yes:(.+)/);
          if (ssidMatch) {
            wifiName = ssidMatch[1].trim();
            connectionType = 'wifi';
          }
        } catch {
          // WiFi detection failed, continue with other info
        }
      }
      
      // Get IP information
      const ipResult = await execAsync('hostname -I');
      const ipAddress = ipResult.stdout.trim().split(' ')[0];
      
      // Get gateway
      const routeResult = await execAsync('ip route | grep default');
      const gatewayMatch = routeResult.stdout.match(/default via ([0-9.]+)/);
      const gateway = gatewayMatch ? gatewayMatch[1] : undefined;
      
      if (!wifiName && ipAddress && connectionType === 'unknown') {
        connectionType = 'ethernet';
      }
      
      return {
        isConnected: !!ipAddress,
        connectionType,
        wifiName,
        ipAddress,
        gateway
      };
    } catch (error) {
      return await this.getGenericNetworkInfo();
    }
  }

  /**
   * Generic network information using Node.js built-ins
   */
  private static async getGenericNetworkInfo(): Promise<NetworkInfo> {
    const interfaces = os.networkInterfaces();
    
    for (const [name, addrs] of Object.entries(interfaces)) {
      if (!addrs) continue;
      
      for (const addr of addrs) {
        if (addr.family === 'IPv4' && !addr.internal) {
          return {
            isConnected: true,
            connectionType: name.toLowerCase().includes('wifi') || name.toLowerCase().includes('wlan') ? 'wifi' : 'ethernet',
            ipAddress: addr.address,
            interfaceName: name
          };
        }
      }
    }
    
    return {
      isConnected: false,
      connectionType: 'unknown'
    };
  }

  /**
   * Display network information in a user-friendly format
   */
  static displayNetworkInfo(networkInfo: NetworkInfo): void {
    console.log(chalk.bold.cyan('\n📡 Network Information:'));
    console.log(chalk.gray('─'.repeat(40)));
    
    if (networkInfo.isConnected) {
      console.log(chalk.green('✓ Status: Connected'));
      console.log(chalk.blue(`📶 Connection Type: ${networkInfo.connectionType.toUpperCase()}`));
      
      if (networkInfo.wifiName) {
        console.log(chalk.yellow(`📡 WiFi Network: ${networkInfo.wifiName}`));
      }
      
      if (networkInfo.ipAddress) {
        console.log(chalk.gray(`🌐 IP Address: ${networkInfo.ipAddress}`));
      }
      
      if (networkInfo.gateway) {
        console.log(chalk.gray(`🚪 Gateway: ${networkInfo.gateway}`));
      }
      
      if (networkInfo.interfaceName) {
        console.log(chalk.gray(`🔌 Interface: ${networkInfo.interfaceName}`));
      }
    } else {
      console.log(chalk.red('✗ Status: Not Connected'));
      console.log(chalk.yellow('Please check your network connection and try again.'));
    }
    
    console.log(chalk.gray('─'.repeat(40)));
  }
}
