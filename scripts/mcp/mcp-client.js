/**
 * MCP Client - Wrapper for MCP Debugger Service
 *
 * Provides simplified interface for browser automation testing
 * via https://mcp-debugger-production.up.railway.app
 *
 * GitHub: https://github.com/maizoro87/MCP-Debugger
 *
 * Authentication: Requires MCP_DEBUGGER_API_KEY environment variable
 */

const https = require('https');

const MCP_BASE_URL = 'https://mcp-debugger-production.up.railway.app';
const APP_URL = 'https://AILitStudents.replit.app';
const MCP_API_KEY = process.env.MCP_DEBUGGER_API_KEY || process.env.MCP_API_KEY;

class MCPClient {
  constructor(baseUrl = MCP_BASE_URL) {
    this.baseUrl = baseUrl;
    this.maxRetries = 3;
    this.retryDelay = 2000; // ms
  }

  /**
   * Check MCP server health
   */
  async checkHealth() {
    try {
      const response = await this.request('/health', 'GET');
      return {
        success: response.status === 'ok',
        timestamp: response.timestamp,
        service: response.service
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Navigate to URL
   */
  async navigate(url, options = {}) {
    const { waitUntil = 'networkidle', timeout = 30000 } = options;

    return await this.mcpRequest('navigate', {
      url,
      waitUntil,
      timeout
    });
  }

  /**
   * Execute multi-step test
   */
  async multiStepTest(url, steps, options = {}) {
    const { timeout = 60000 } = options;

    return await this.mcpRequest('multi_step_test', {
      url,
      steps,
      timeout
    });
  }

  /**
   * Evaluate JavaScript in browser
   */
  async evaluate(script, options = {}) {
    return await this.multiStepTest(APP_URL, [
      { action: 'wait', duration: 1000 },
      { action: 'evaluate', script }
    ], options);
  }

  /**
   * Check if element is visible
   */
  async isVisible(url, selector, options = {}) {
    return await this.multiStepTest(url, [
      { action: 'wait', duration: 2000 },
      { action: 'is_visible', selector }
    ], options);
  }

  /**
   * Click element
   */
  async click(url, selector, options = {}) {
    const { waitBefore = 2000, waitAfter = 1000 } = options;

    return await this.multiStepTest(url, [
      { action: 'wait', duration: waitBefore },
      { action: 'click', selector },
      { action: 'wait', duration: waitAfter }
    ], options);
  }

  /**
   * Type text into input
   */
  async type(url, selector, text, options = {}) {
    const { waitBefore = 1000, waitAfter = 500 } = options;

    return await this.multiStepTest(url, [
      { action: 'wait', duration: waitBefore },
      { action: 'type', selector, text },
      { action: 'wait', duration: waitAfter }
    ], options);
  }

  /**
   * Get DOM state
   */
  async getDOMState(url, options = {}) {
    return await this.multiStepTest(url, [
      { action: 'wait', duration: 2000 },
      { action: 'dom_state' }
    ], options);
  }

  /**
   * Make MCP request
   */
  async mcpRequest(method, params, retries = 0) {
    try {
      const response = await this.request('/mcp', 'POST', {
        method,
        params
      });

      return response;
    } catch (error) {
      if (retries < this.maxRetries) {
        console.log(`Retry ${retries + 1}/${this.maxRetries} after error: ${error.message}`);
        await this.sleep(this.retryDelay);
        return await this.mcpRequest(method, params, retries + 1);
      }
      throw error;
    }
  }

  /**
   * Generic HTTP request
   */
  async request(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const headers = {
        'Content-Type': 'application/json'
      };

      // Add authentication for /mcp endpoint (health check is public)
      if (path === '/mcp' && MCP_API_KEY) {
        // Primary method (recommended)
        headers['X-API-Key'] = MCP_API_KEY;
        // Alternative method (also supported)
        // headers['Authorization'] = `Bearer ${MCP_API_KEY}`;
      }

      const options = {
        method,
        headers
      };

      const req = https.request(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);

            if (res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}: ${parsed.error || data}`));
            } else {
              resolve(parsed);
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
module.exports = new MCPClient();
module.exports.MCPClient = MCPClient;
module.exports.APP_URL = APP_URL;
module.exports.MCP_BASE_URL = MCP_BASE_URL;

// CLI usage
if (require.main === module) {
  const command = process.argv[2];
  const client = new MCPClient();

  (async () => {
    switch (command) {
      case 'health':
        const health = await client.checkHealth();
        console.log(JSON.stringify(health, null, 2));
        process.exit(health.success ? 0 : 1);
        break;

      case 'navigate':
        const url = process.argv[3] || APP_URL;
        const navResult = await client.navigate(url);
        console.log(JSON.stringify(navResult, null, 2));
        process.exit(navResult.success ? 0 : 1);
        break;

      case 'test':
        const testUrl = process.argv[3] || `${APP_URL}/module/what-is-ai`;
        const testResult = await client.isVisible(testUrl, 'nav');
        console.log(JSON.stringify(testResult, null, 2));
        process.exit(testResult.success ? 0 : 1);
        break;

      default:
        console.log('MCP Client - Usage:');
        console.log('  node mcp-client.js health              # Check server health');
        console.log('  node mcp-client.js navigate [url]      # Navigate to URL');
        console.log('  node mcp-client.js test [url]          # Test navigation visibility');
        process.exit(1);
    }
  })().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
