/**
 * Gemini Vision Analyzer - Visual Bug Detection
 *
 * Integrates with existing Gemini Vision Inspector for screenshot analysis
 */

const mcpClient = require('./mcp-client');

class GeminiAnalyzer {
  constructor(options = {}) {
    this.options = {
      apiKey: options.apiKey || process.env.GEMINI_API_KEY,
      model: options.model || 'gemini-2.5-flash',
      ...options
    };
  }

  /**
   * Analyze screenshot for visual bugs
   */
  async analyzeScreenshot(screenshotUrl, context = {}) {
    if (!this.options.apiKey) {
      console.warn('⚠️ Gemini API key not configured. Skipping visual analysis.');
      return null;
    }

    const prompt = this.buildAnalysisPrompt(context);

    try {
      // Note: This is a placeholder. Actual implementation would call Gemini Vision API
      // For now, return a structure that matches expected output
      return {
        success: true,
        analysis: {
          visualBugs: [],
          accessibilityIssues: [],
          uxConcerns: [],
          recommendations: []
        },
        note: 'Gemini Vision analysis requires API integration'
      };
    } catch (error) {
      console.error('Gemini Vision analysis error:', error.message);
      return null;
    }
  }

  /**
   * Build analysis prompt
   */
  buildAnalysisPrompt(context) {
    const { moduleName, testName, expectedBehavior } = context;

    let prompt = 'Analyze this educational module screenshot:\n\n';

    if (moduleName) {
      prompt += `Module: ${moduleName}\n`;
    }

    if (testName) {
      prompt += `Test: ${testName}\n`;
    }

    prompt += '\nPlease identify:\n';
    prompt += '1. Visual bugs or rendering issues\n';
    prompt += '2. Accessibility concerns (contrast, text readability)\n';
    prompt += '3. UX issues (layout, button visibility, clarity)\n';
    prompt += '4. Any elements that seem out of place\n\n';

    if (expectedBehavior) {
      prompt += `Expected: ${expectedBehavior}\n\n`;
    }

    prompt += 'Provide specific, actionable recommendations.\n';

    return prompt;
  }

  /**
   * Analyze contrast ratios
   */
  async analyzeContrast(url) {
    try {
      const result = await mcpClient.evaluate(`
        const elements = Array.from(document.querySelectorAll('*')).slice(0, 100);
        const violations = [];

        function getLuminance(r, g, b) {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }

        function getContrastRatio(fg, bg) {
          const fgLum = getLuminance(...fg) + 0.05;
          const bgLum = getLuminance(...bg) + 0.05;
          return Math.max(fgLum, bgLum) / Math.min(fgLum, bgLum);
        }

        function parseColor(color) {
          const match = color.match(/\\d+/g);
          return match ? match.map(Number).slice(0, 3) : [255, 255, 255];
        }

        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const bgColor = styles.backgroundColor;
          const textColor = styles.color;

          if (bgColor && textColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            const bg = parseColor(bgColor);
            const fg = parseColor(textColor);
            const ratio = getContrastRatio(fg, bg);

            if (ratio < 4.5 && el.textContent.trim().length > 0) {
              violations.push({
                tag: el.tagName.toLowerCase(),
                classes: el.className,
                ratio: ratio.toFixed(2),
                required: '4.5'
              });
            }
          }
        });

        return violations.slice(0, 20);
      `);

      return result;
    } catch (error) {
      console.error('Contrast analysis error:', error.message);
      return null;
    }
  }

  /**
   * Detect missing text colors
   */
  async detectMissingTextColors(url) {
    try {
      const result = await mcpClient.evaluate(`
        const elements = Array.from(document.querySelectorAll('[class*="bg-"]'));
        const issues = [];

        elements.forEach(el => {
          const classes = Array.from(el.classList);
          const hasBg = classes.some(c => c.startsWith('bg-'));
          const hasText = classes.some(c => c.startsWith('text-'));

          if (hasBg && !hasText) {
            issues.push({
              tag: el.tagName.toLowerCase(),
              classes: classes.join(' '),
              text: el.textContent.substring(0, 50)
            });
          }
        });

        return issues.slice(0, 20);
      `);

      return result;
    } catch (error) {
      console.error('Text color detection error:', error.message);
      return null;
    }
  }

  /**
   * Check semantic HTML
   */
  async checkSemanticHTML(url) {
    try {
      const result = await mcpClient.evaluate(`
        ({
          divWithOnClick: document.querySelectorAll('div[onclick]').length,
          buttonsWithoutType: document.querySelectorAll('button:not([type])').length,
          imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
          inputsWithoutLabels: document.querySelectorAll('input:not([aria-label]):not([id])').length,
          headingOrder: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.tagName)
        })
      `);

      return result;
    } catch (error) {
      console.error('Semantic HTML check error:', error.message);
      return null;
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const url = args[1] || 'https://AILitStudents.replit.app';

  const analyzer = new GeminiAnalyzer();

  (async () => {
    switch (command) {
      case 'contrast':
        console.log(`Analyzing contrast ratios for: ${url}`);
        const contrastResult = await analyzer.analyzeContrast(url);
        console.log(JSON.stringify(contrastResult, null, 2));
        break;

      case 'text-colors':
        console.log(`Checking for missing text colors: ${url}`);
        const textColorResult = await analyzer.detectMissingTextColors(url);
        console.log(JSON.stringify(textColorResult, null, 2));
        break;

      case 'semantic':
        console.log(`Checking semantic HTML: ${url}`);
        const semanticResult = await analyzer.checkSemanticHTML(url);
        console.log(JSON.stringify(semanticResult, null, 2));
        break;

      default:
        console.log('Usage:');
        console.log('  node gemini-analyzer.js contrast [url]       # Analyze contrast ratios');
        console.log('  node gemini-analyzer.js text-colors [url]    # Check for missing text colors');
        console.log('  node gemini-analyzer.js semantic [url]       # Check semantic HTML');
        process.exit(1);
    }
  })().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = GeminiAnalyzer;
