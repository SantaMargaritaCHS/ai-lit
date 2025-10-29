/**
 * MCP Report Generator - Creates Markdown Reports
 *
 * Formats test results into human-readable reports
 */

const fs = require('fs');
const path = require('path');

class ReportGenerator {
  constructor(results) {
    this.results = results;
  }

  /**
   * Generate markdown report
   */
  generateMarkdown() {
    const { testRun, summary, suites, failures } = this.results;

    let report = '';

    // Header
    report += `# MCP Test Report - ${new Date(testRun.timestamp).toLocaleString()}\n\n`;
    report += `## Summary\n`;
    report += `- **Test Type**: ${testRun.testType}\n`;
    report += `- **Duration**: ${(testRun.duration / 1000 / 60).toFixed(1)}m\n`;
    report += `- **Total Tests**: ${summary.total}\n`;
    report += `- **Passed**: ${summary.passed} (${summary.successRate || '0%'})\n`;
    report += `- **Failed**: ${summary.failed}\n`;
    report += `- **Skipped**: ${summary.skipped}\n\n`;

    report += `---\n\n`;

    // Test Suites Table
    report += `## Test Suites\n\n`;
    report += `| Suite | Tests | Passed | Failed | Duration |\n`;
    report += `|-------|-------|--------|--------|----------|\n`;

    for (const suite of suites) {
      const duration = (suite.duration / 1000).toFixed(1);
      report += `| ${suite.name} | ${suite.total} | ${suite.passed} | ${suite.failed} | ${duration}s |\n`;
    }

    report += `\n---\n\n`;

    // Failures
    if (failures.length > 0) {
      report += `## Failures\n\n`;

      failures.forEach((failure, index) => {
        report += `### ${index + 1}. ${failure.test}\n`;
        report += `**Suite**: ${failure.suite}\n`;
        if (failure.error) {
          report += `**Error**: ${failure.error}\n`;
        }
        report += `**Duration**: ${failure.duration}ms\n\n`;

        if (failure.steps) {
          const failedStep = failure.steps.find(s => !s.success);
          if (failedStep) {
            report += `**Failed Step**: ${failedStep.action || 'Unknown'}\n`;
            if (failedStep.error) {
              report += `**Step Error**: ${failedStep.error}\n`;
            }
          }
        }

        report += `\n`;
      });

      report += `---\n\n`;
    }

    // Recommendations
    report += `## Recommendations\n\n`;

    if (failures.length === 0) {
      report += `✅ All tests passed! Platform is stable.\n\n`;
    } else {
      report += `### High Priority\n`;
      failures.forEach((failure, index) => {
        report += `${index + 1}. Fix: ${failure.test}\n`;
        if (failure.error) {
          report += `   - ${failure.error}\n`;
        }
      });
      report += `\n`;
    }

    // Footer
    report += `---\n\n`;
    report += `**Report Generated**: ${new Date().toLocaleString()}\n`;
    report += `**MCP Server**: ${testRun.mcpServer}\n`;
    report += `**App URL**: ${testRun.appUrl}\n`;

    return report;
  }

  /**
   * Save report to file
   */
  save(filename = null) {
    const reportsDir = path.join(__dirname, '../../test-reports/mcp');

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportFilename = filename || `mcp-test-report-${this.results.testRun.id}.md`;
    const reportPath = path.join(reportsDir, reportFilename);

    const markdown = this.generateMarkdown();
    fs.writeFileSync(reportPath, markdown);

    return reportPath;
  }

  /**
   * Get summary text
   */
  getSummaryText() {
    const { summary } = this.results;
    return `✅ ${summary.passed} passed, ❌ ${summary.failed} failed, ⏭️ ${summary.skipped} skipped (${summary.successRate || '0%'} success rate)`;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const resultsFile = args.find(arg => arg.startsWith('--results='))?.split('=')[1];
  const latest = args.includes('--latest');

  const reportsDir = path.join(__dirname, '../../test-reports/mcp');

  if (!fs.existsSync(reportsDir)) {
    console.log('No test reports found');
    process.exit(1);
  }

  let inputFile;

  if (latest) {
    // Find latest results file
    const files = fs.readdirSync(reportsDir)
      .filter(f => f.endsWith('.json'))
      .map(f => ({ name: f, path: path.join(reportsDir, f), time: fs.statSync(path.join(reportsDir, f)).mtime }))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      console.log('No test results found');
      process.exit(1);
    }

    inputFile = files[0].path;
  } else if (resultsFile) {
    inputFile = path.join(reportsDir, resultsFile);
  } else {
    console.log('Usage:');
    console.log('  node report-generator.js --latest                    # Generate report from latest results');
    console.log('  node report-generator.js --results=results.json      # Generate from specific file');
    process.exit(1);
  }

  // Load results
  const results = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  // Generate report
  const generator = new ReportGenerator(results);
  const reportPath = generator.save();

  console.log(`\n📄 Report generated: ${reportPath}`);
  console.log(`\n${generator.getSummaryText()}\n`);

  process.exit(0);
}

module.exports = ReportGenerator;
