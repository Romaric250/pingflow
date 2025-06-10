# PingFlow v2 - Comprehensive Network Analysis Tool

PingFlow v2 is a powerful, cross-platform command-line tool that provides comprehensive network analysis including internet speed testing, connectivity detection, WiFi information, and latency measurements. Built with TypeScript and designed to work flawlessly on Windows, macOS, and Linux.

## ✨ Features

### 🚀 **Complete Network Analysis**
- **Internet Speed Testing** - Accurate download speed measurement with multiple fallback servers
- **Network Connectivity Detection** - Smart detection of internet connectivity issues
- **WiFi Information** - Display current WiFi network name and connection details
- **Ping Latency Testing** - Comprehensive latency testing to multiple hosts
- **Network Interface Details** - IP address, gateway, and interface information

### 🌍 **Cross-Platform Compatibility**
- **Windows** - Full support including WiFi name detection
- **macOS** - Native support with system integration
- **Linux** - Compatible with major distributions
- **Robust Error Handling** - Graceful handling of network issues

### 🎨 **Beautiful Interface**
- **Interactive CLI** - Modern, user-friendly command-line interface
- **Real-time Progress** - Live progress bars with speed indicators
- **Colorful Output** - Intuitive color-coded results
- **Multiple Modes** - Interactive, automatic, and specific test modes

### ⚡ **Advanced Features**
- **Multiple Test Servers** - Automatic failover between speed test servers
- **Smart Server Selection** - Chooses the best available server automatically
- **Comprehensive Error Messages** - Clear, actionable error reporting
- **Detailed Statistics** - Min/max/average latency, packet loss, and more

## 📦 Installation

First, ensure you have Node.js (version 14 or higher) installed on your system.

Install PingFlow v2 globally via npm:

```bash
npm install -g pingflow
```

## 🚀 Usage

### Interactive Mode (Recommended)
```bash
pingflow
```

### Command Line Options
```bash
# Run all tests automatically
pingflow --auto

# Speed test only
pingflow --speed

# Ping test only
pingflow --ping

# Network information only
pingflow --network

# Show detailed system information
pingflow --auto --verbose

# Skip intro banner
pingflow --network --no-intro

# Show help
pingflow --help

# Show version
pingflow --version
```

## 📊 Example Output

```bash
  ____  _             _____ _                       ____
 |  _ \(_)_ __   __ _|  ___| | _____      __ __   _|___ \
 | |_) | | '_ \ / _` | |_  | |/ _ \ \ /\ / / \ \ / / __) |
 |  __/| | | | | (_| |  _| | | (_) \ V  V /   \ V / / __/
 |_|   |_|_| |_|\__, |_|   |_|\___/ \_/\_/     \_/ |_____|
                |___/
──────────────────────────────────────────────────────────────────────
🌐 Comprehensive Internet Speed & Network Analysis Tool
   Cross-platform • Accurate • Reliable
──────────────────────────────────────────────────────────────────────

📡 Network Information:
────────────────────────────────────────
✓ Status: Connected
📶 Connection Type: WIFI
📡 WiFi Network: MyHomeNetwork
🌐 IP Address: 192.168.1.100
🚪 Gateway: 192.168.1.1
────────────────────────────────────────

🏓 Ping Test Results:
────────────────────────────────────────────────────────────
✓ 4/4 hosts reachable
📊 Overall Average Latency: 25.3ms
🚀 Latency Rating: Excellent
────────────────────────────────────────────────────────────

📊 Speed Test Results:
──────────────────────────────────────────────────
✓ Test completed successfully
🌐 Server: Cloudflare
⬇️  Download Speed: 85.42 Mbps
📦 Data Transferred: 10.00 MB
⏰ Duration: 0.94 seconds
⚡ Speed Rating: Very Good
──────────────────────────────────────────────────
```

## 🔧 Technical Details

### Speed Test Servers
PingFlow v2 uses multiple high-quality speed test servers with automatic failover:
- **Cloudflare** - Global CDN with excellent performance
- **Fast.com (Netflix)** - Netflix's speed testing infrastructure
- **ThinkBroadband** - Reliable UK-based testing server
- **SpeedTest.net** - Popular speed testing service
- **Proof General** - European testing server

### Network Detection
- **Windows**: Uses `netsh` commands for WiFi detection and `ipconfig` for network details
- **macOS**: Leverages `airport` utility and system commands
- **Linux**: Compatible with `iwconfig`, `nmcli`, and standard networking tools
- **Fallback**: Uses Node.js built-in network interfaces as backup

### Ping Testing
- Tests connectivity to multiple reliable hosts (Google DNS, Cloudflare DNS, etc.)
- Provides detailed statistics including min/max/average latency and packet loss
- Cross-platform ping command compatibility

## 🛠️ Troubleshooting

### Common Issues

**"No internet connectivity detected"**
- Check your network connection
- Verify firewall settings aren't blocking the application
- Try running with administrator/sudo privileges

**"All speed test servers failed"**
- Check if your ISP or firewall is blocking HTTP/HTTPS requests
- Verify DNS resolution is working
- Try the network info test first: `pingflow --network`

**WiFi name not detected**
- On Windows: Run as Administrator for full WiFi access
- On Linux: Ensure `iwconfig` or `nmcli` is available
- On macOS: Grant terminal network access permissions

**Permission errors**
- Run as Administrator (Windows) or with sudo (Linux/macOS)
- Check antivirus software isn't blocking the application

### Platform-Specific Notes

**Windows**
- For best results, run Command Prompt as Administrator
- Windows Defender may require permission for network access
- PowerShell and Command Prompt are both supported

**macOS**
- May require granting network access permissions
- Works with both Terminal and iTerm2
- Compatible with macOS 10.14 and later

**Linux**
- Requires `ping` command (usually pre-installed)
- For WiFi detection: `iwconfig` or `nmcli` recommended
- Tested on Ubuntu, Debian, CentOS, and Arch Linux

## 🔄 What's New in v2

### Major Improvements
- ✅ **Full Windows Compatibility** - Fixed all Windows-specific issues
- ✅ **WiFi Name Detection** - Cross-platform WiFi network identification
- ✅ **Multiple Speed Test Servers** - Automatic failover for reliability
- ✅ **Enhanced Error Handling** - Clear, actionable error messages
- ✅ **Interactive CLI** - Modern, user-friendly interface
- ✅ **Comprehensive Ping Testing** - Detailed latency analysis
- ✅ **Network Information Display** - Complete connection details
- ✅ **Command Line Options** - Flexible usage modes

### Technical Enhancements
- Rewritten in TypeScript for better reliability
- Modular architecture for easier maintenance
- Improved cross-platform compatibility
- Better error recovery and retry logic
- Enhanced progress indicators and user feedback

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Setup
```bash
# Clone the repository
git clone https://github.com/Romaric250/pingflow.git
cd pingflow

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Test the built version
npm run test
```

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all the speed test server providers
- Built with love using Node.js and TypeScript
- Inspired by the need for reliable, cross-platform network testing

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Romaric250/pingflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Romaric250/pingflow/discussions)
- **Email**: lonfonyuyromaric@gmail.com

---

### Happy testing! 🚀 @Romaric250