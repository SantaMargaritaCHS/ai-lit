/**
 * MCP Test Runner - Orchestrates Test Execution
 *
 * Runs test suites and collects results
 */

const mcpClient = require('./mcp-client');
const { ALL_SUITES, SMOKE_TEST_SUITES, MODULES } = require('./test-suites');

class TestRunner {
  constructor(options = {}) {
    this.options = {
      verbose: options.verbose || false,
      stopOnFailure: options.stopOnFailure || false,
      timeout: options.timeout || 60000,
      ...options
    };

    this.results = {
      testRun: {
        id: `mcp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        startTime: Date.now(),
        testType: options.testType || 'custom',
        mcpServer: mcpClient.baseUrl,
        appUrl: mcpClient.APP_URL
      },
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      },
      suites: [],
      failures: [],
      autoCollaborationTriggered: []
    };
  }

  /**
   * Run all test suites
   */
  async runAll() {
    this.log('🚀 Starting MCP Test Runner\n');
    this.log(`MCP Server: ${mcpClient.baseUrl}`);
    this.log(`App URL: ${mcpClient.APP_URL}\n`);

    // Check MCP server health
    this.log('🏥 Checking MCP server health...');
    const health = await mcpClient.checkHealth();

    if (!health.success) {
      this.log('❌ MCP server is not healthy');
      this.log(`   Error: ${health.error}`);
      return this.finalize();
    }

    this.log('✅ MCP server is healthy\n');

    // Run all suites
    for (const suite of ALL_SUITES) {
      await this.runSuite(suite);

      if (this.options.stopOnFailure && this.results.summary.failed > 0) {
        this.log('\n⛔ Stopping due to failures (stopOnFailure enabled)');
        break;
      }
    }

    return this.finalize();
  }

  /**
   * Run smoke test
   */
  async runSmoke() {
    this.results.testRun.testType = 'smoke';
    this.log('🚀 Starting MCP Smoke Test\n');

    // Health check
    const health = await mcpClient.checkHealth();
    if (!health.success) {
      this.log('❌ MCP server not healthy');
      return this.finalize();
    }

    this.log('✅ MCP server is healthy\n');

    // Run smoke test suites
    for (const suite of SMOKE_TEST_SUITES) {
      await this.runSuite(suite);
    }

    return this.finalize();
  }

  /**
   * Run specific suite
   */
  async runSuite(suite) {
    this.log(`\n${'='.repeat(60)}`);
    this.log(`Running Test Suite: ${suite.name}`);
    this.log('='.repeat(60) + '\n');

    const suiteResult = {
      id: suite.id,
      name: suite.name,
      description: suite.description,
      total: suite.tests.length,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      startTime: Date.now(),
      tests: []
    };

    for (const test of suite.tests) {
      const testResult = await this.runTest(test, suite.id);
      suiteResult.tests.push(testResult);

      if (testResult.status === 'passed') {
        suiteResult.passed++;
        this.results.summary.passed++;
      } else if (testResult.status === 'failed') {
        suiteResult.failed++;
        this.results.summary.failed++;

        // Record failure
        this.results.failures.push({
          suite: suite.name,
          test: test.name,
          ...testResult
        });
      } else {
        suiteResult.skipped++;
        this.results.summary.skipped++;
      }

      this.results.summary.total++;
    }

    suiteResult.duration = Date.now() - suiteResult.startTime;
    this.results.suites.push(suiteResult);

    // Suite summary
    this.log(`\nSuite Summary: ${suiteResult.passed}/${suiteResult.total} passed`);
    this.log(`Duration: ${(suiteResult.duration / 1000).toFixed(1)}s\n`);
  }

  /**
   * Run single test
   */
  async runTest(test, suiteId) {
    const startTime = Date.now();

    try {
      this.log(`⏳ ${test.name}`);

      if (this.options.verbose) {
        this.log(`   URL: ${test.url}`);
        this.log(`   Steps: ${test.steps.length}`);
      }

      // Execute test
      const result = await mcpClient.multiStepTest(test.url, test.steps, {
        timeout: this.options.timeout
      });

      const duration = Date.now() - startTime;

      if (result.success && result.completedSteps === result.totalSteps) {
        this.log(`✅ ${test.name}`);
        if (this.options.verbose) {
          this.log(`   Duration: ${duration}ms\n`);
        }

        return {
          name: test.name,
          status: 'passed',
          duration,
          steps: result.steps
        };
      } else {
        this.log(`❌ ${test.name}`);
        this.log(`   Failed: ${result.failedSteps}/${result.totalSteps} steps`);
        if (this.options.verbose && result.steps) {
          const failedStep = result.steps.find(s => !s.success);
          if (failedStep) {
            this.log(`   Error: ${failedStep.error || 'Unknown'}`);
          }
        }

        return {
          name: test.name,
          status: 'failed',
          duration,
          error: `Failed ${result.failedSteps} steps`,
          steps: result.steps
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      this.log(`❌ ${test.name}`);
      this.log(`   Error: ${error.message}`);

      return {
        name: test.name,
        status: 'failed',
        duration,
        error: error.message
      };
    }
  }

  /**
   * Run module-specific tests
   */
  async runModule(moduleId) {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) {
      this.log(`❌ Module not found: ${moduleId}`);
      return this.finalize();
    }

    this.results.testRun.testType = `module-${moduleId}`;
    this.log(`\n🚀 Testing Module: ${module.name}\n`);

    // Health check
    const health = await mcpClient.checkHealth();
    if (!health.success) {
      this.log('❌ MCP server not healthy');
      return this.finalize();
    }

    // Run suites 1-7 for the specific module
    const moduleSuites = ALL_SUITES.slice(0, 7).map(suite => ({
      ...suite,
      tests: suite.tests.filter(test =>
        test.url.includes(moduleId) || test.name.includes(module.name)
      )
    })).filter(suite => suite.tests.length > 0);

    for (const suite of moduleSuites) {
      await this.runSuite(suite);
    }

    return this.finalize();
  }

  /**
   * Finalize results
   */
  finalize() {
    this.results.testRun.endTime = Date.now();
    this.results.testRun.duration = this.results.testRun.endTime - this.results.testRun.startTime;

    // Calculate success rate
    if (this.results.summary.total > 0) {
      this.results.summary.successRate =
        ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1) + '%';
    }

    // Print summary
    this.log('\n' + '='.repeat(60));
    this.log('Test Summary');
    this.log('='.repeat(60) + '\n');
    this.log(`Total Tests: ${this.results.summary.total}`);
    this.log(`Passed: ${this.results.summary.passed}`);
    this.log(`Failed: ${this.results.summary.failed}`);
    this.log(`Skipped: ${this.results.summary.skipped}`);
    this.log(`Success Rate: ${this.results.summary.successRate || '0%'}`);
    this.log(`Duration: ${(this.results.testRun.duration / 1000).toFixed(1)}s\n`);

    if (this.results.failures.length > 0) {
      this.log('❌ Failed Tests:');
      this.results.failures.forEach(failure => {
        this.log(`   • ${failure.suite}: ${failure.test}`);
        if (failure.error) {
          this.log(`     ${failure.error}`);
        }
      });
      this.log('');
    }

    return this.results;
  }

  /**
   * Log helper
   */
  log(message) {
    if (this.options.verbose || message.includes('✅') || message.includes('❌') || message.includes('=')) {
      console.log(message);
    }
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    stopOnFailure: args.includes('--stop-on-failure'),
    suite: args.find(arg => arg.startsWith('--suite='))?.split('=')[1],
    module: args.find(arg => arg.startsWith('--module='))?.split('=')[1]
  };

  const runner = new TestRunner(options);

  (async () => {
    let results;

    if (options.suite === 'smoke') {
      results = await runner.runSmoke();
    } else if (options.suite === 'all' || !options.suite) {
      results = await runner.runAll();
    } else if (options.module) {
      results = await runner.runModule(options.module);
    } else {
      console.log('Usage:');
      console.log('  node test-runner.js --suite=all                # Run all tests');
      console.log('  node test-runner.js --suite=smoke              # Run smoke tests');
      console.log('  node test-runner.js --module=what-is-ai        # Test specific module');
      console.log('  node test-runner.js --suite=all --verbose      # Verbose output');
      process.exit(1);
    }

    // Save results
    const fs = require('fs');
    const path = require('path');
    const reportsDir = path.join(__dirname, '../../test-reports/mcp');

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportFile = path.join(reportsDir, `mcp-test-results-${results.testRun.id}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));

    console.log(`\n📄 Results saved to: ${reportFile}`);

    // Exit with appropriate code
    process.exit(results.summary.failed > 0 ? 1 : 0);
  })().catch(error => {
    console.error('\n❌ Test runner error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = TestRunner;
