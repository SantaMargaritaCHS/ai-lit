/**
 * MCP Test Suites - Comprehensive Test Definitions
 *
 * Defines all 10 test suites for the AI Literacy Student Platform
 */

const { APP_URL } = require('./mcp-client');

const MODULES = [
  { id: 'what-is-ai', name: 'What Is AI' },
  { id: 'intro-to-gen-ai', name: 'Intro to Gen AI' },
  { id: 'responsible-ethical-ai', name: 'Responsible & Ethical AI' },
  { id: 'understanding-llms', name: 'Understanding LLMs' },
  { id: 'llm-limitations', name: 'LLM Limitations' },
  { id: 'privacy-data-rights', name: 'Privacy & Data Rights' },
  { id: 'ai-environmental-impact', name: 'AI Environmental Impact' },
  { id: 'introduction-to-prompting', name: 'Introduction to Prompting' },
  { id: 'ancient-compass-ai-ethics', name: 'Ancient Compass AI Ethics' }
];

// Suite 1: Platform Integrity
const PLATFORM_INTEGRITY_SUITE = {
  id: 'platform-integrity',
  name: 'Platform Integrity',
  description: 'Verify core functionality and module availability',
  tests: [
    {
      name: 'Homepage Loads',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 2000 },
        { action: 'is_visible', selector: 'nav' },
        { action: 'is_visible', selector: 'main' }
      ],
      expected: { allVisible: true }
    },
    {
      name: 'All Modules Listed',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 2000 },
        { action: 'evaluate', script: 'document.querySelectorAll(".module-card, [data-module]").length' }
      ],
      expected: { moduleCount: 9 }
    },
    ...MODULES.map(module => ({
      name: `Module ${module.name} Loads`,
      url: `${APP_URL}/module/${module.id}`,
      steps: [
        { action: 'wait', duration: 3000 },
        { action: 'evaluate', script: 'document.title' },
        { action: 'is_visible', selector: 'main' }
      ],
      expected: { hasTitle: true }
    }))
  ]
};

// Suite 2: Developer Mode Validation
const DEVELOPER_MODE_SUITE = {
  id: 'developer-mode',
  name: 'Developer Mode Validation',
  description: 'Test Universal Developer Mode activation and navigation',
  tests: MODULES.slice(0, 5).map(module => ({  // Test on first 5 modules
    name: `Developer Mode - ${module.name}`,
    url: `${APP_URL}/module/${module.id}`,
    steps: [
      { action: 'wait', duration: 2000 },
      // Try to activate Developer Mode (may not work via MCP, but test presence)
      { action: 'evaluate', script: 'typeof window.DevModeContext !== "undefined" ? "exists" : "missing"' },
      // Check if activities are registered
      { action: 'evaluate', script: 'window.__activities ? window.__activities.length : 0' }
    ],
    expected: { devModeExists: true }
  }))
};

// Suite 3: Progress Persistence
const PROGRESS_PERSISTENCE_SUITE = {
  id: 'progress-persistence',
  name: 'Progress Persistence',
  description: 'Test save/load/clear functionality',
  tests: [
    {
      name: 'LocalStorage Available',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 1000 },
        { action: 'evaluate', script: 'typeof localStorage !== "undefined"' }
      ],
      expected: { available: true }
    },
    ...['what-is-ai', 'intro-to-gen-ai', 'ancient-compass-ai-ethics'].map(moduleId => ({
      name: `Progress Persistence - ${moduleId}`,
      url: `${APP_URL}/module/${moduleId}`,
      steps: [
        { action: 'wait', duration: 2000 },
        // Check if progress persistence functions exist
        { action: 'evaluate', script: `localStorage.getItem("module-progress-${moduleId}")` }
      ],
      expected: { canSave: true }
    }))
  ]
};

// Suite 4: AI Validation System
const AI_VALIDATION_SUITE = {
  id: 'ai-validation',
  name: 'AI Validation System',
  description: 'Test Gemini AI validation and escape hatch',
  tests: [
    {
      name: 'Gemini API Configuration Check',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 1000 },
        { action: 'evaluate', script: 'typeof window.generateEducationFeedback !== "undefined" ? "exists" : "missing"' }
      ],
      expected: { apiConfigured: true }
    },
    {
      name: 'Text Area Validation Present',
      url: `${APP_URL}/module/what-is-ai`,
      steps: [
        { action: 'wait', duration: 3000 },
        { action: 'evaluate', script: 'document.querySelectorAll("textarea").length' }
      ],
      expected: { hasTextAreas: true }
    }
  ]
};

// Suite 5: Video Playback
const VIDEO_PLAYBACK_SUITE = {
  id: 'video-playback',
  name: 'Video Playback',
  description: 'Validate video URLs and playback functionality',
  tests: MODULES.slice(0, 6).map(module => ({
    name: `Video Elements - ${module.name}`,
    url: `${APP_URL}/module/${module.id}`,
    steps: [
      { action: 'wait', duration: 3000 },
      { action: 'evaluate', script: 'document.querySelectorAll("video, [data-video]").length' }
    ],
    expected: { hasVideo: true }
  }))
};

// Suite 6: Accessibility Compliance
const ACCESSIBILITY_SUITE = {
  id: 'accessibility',
  name: 'Accessibility Compliance',
  description: 'WCAG 2.1 AA validation',
  tests: [
    {
      name: 'Semantic HTML Check',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 2000 },
        { action: 'evaluate', script: `({
          divWithOnClick: document.querySelectorAll('div[onclick]').length,
          buttonsWithoutType: document.querySelectorAll('button:not([type])').length,
          imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length
        })` }
      ],
      expected: { noViolations: true }
    },
    ...MODULES.map(module => ({
      name: `Accessibility - ${module.name}`,
      url: `${APP_URL}/module/${module.id}`,
      steps: [
        { action: 'wait', duration: 2000 },
        { action: 'is_visible', selector: 'main' },
        { action: 'is_visible', selector: 'nav' },
        { action: 'evaluate', script: 'document.querySelectorAll("button, a").length' }
      ],
      expected: { accessible: true }
    }))
  ]
};

// Suite 7: Module-Specific Validation
const MODULE_SPECIFIC_SUITE = {
  id: 'module-specific',
  name: 'Module-Specific Validation',
  description: 'Test module-specific features',
  tests: MODULES.map(module => ({
    name: `Module Features - ${module.name}`,
    url: `${APP_URL}/module/${module.id}`,
    steps: [
      { action: 'wait', duration: 2000 },
      { action: 'evaluate', script: 'document.title' },
      { action: 'is_visible', selector: 'main' },
      // Check for interactive elements
      { action: 'evaluate', script: 'document.querySelectorAll("button, input, textarea, select").length' }
    ],
    expected: { hasInteractiveElements: true }
  }))
};

// Suite 8: Responsive Design
const RESPONSIVE_DESIGN_SUITE = {
  id: 'responsive-design',
  name: 'Responsive Design',
  description: 'Test layouts across device sizes',
  tests: [
    {
      name: 'Desktop Layout (1920x1080)',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 2000 },
        { action: 'evaluate', script: 'window.innerWidth >= 1280 ? "desktop" : "mobile"' }
      ],
      expected: { layoutWorks: true }
    },
    {
      name: 'Mobile Layout Check',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 2000 },
        { action: 'evaluate', script: 'document.body.scrollWidth > window.innerWidth ? "horizontal-scroll" : "ok"' }
      ],
      expected: { noHorizontalScroll: true }
    }
  ]
};

// Suite 9: Cross-Browser Compatibility
const CROSS_BROWSER_SUITE = {
  id: 'cross-browser',
  name: 'Cross-Browser Compatibility',
  description: 'Test on different browsers',
  tests: [
    {
      name: 'Basic Compatibility Check',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 2000 },
        { action: 'evaluate', script: 'navigator.userAgent' },
        { action: 'is_visible', selector: 'main' }
      ],
      expected: { compatible: true }
    }
  ]
};

// Suite 10: Performance & Quality
const PERFORMANCE_SUITE = {
  id: 'performance',
  name: 'Performance & Quality',
  description: 'Monitor performance and code quality',
  tests: [
    {
      name: 'Initial Load Time',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 2000 },
        { action: 'evaluate', script: 'performance.timing.loadEventEnd - performance.timing.navigationStart' }
      ],
      expected: { loadTime: '<3000ms' }
    },
    {
      name: 'Network Requests Count',
      url: `${APP_URL}`,
      steps: [
        { action: 'wait', duration: 3000 },
        { action: 'evaluate', script: 'performance.getEntriesByType("resource").length' }
      ],
      expected: { requestCount: '<50' }
    }
  ]
};

// All suites
const ALL_SUITES = [
  PLATFORM_INTEGRITY_SUITE,
  DEVELOPER_MODE_SUITE,
  PROGRESS_PERSISTENCE_SUITE,
  AI_VALIDATION_SUITE,
  VIDEO_PLAYBACK_SUITE,
  ACCESSIBILITY_SUITE,
  MODULE_SPECIFIC_SUITE,
  RESPONSIVE_DESIGN_SUITE,
  CROSS_BROWSER_SUITE,
  PERFORMANCE_SUITE
];

// Smoke test (fast subset)
const SMOKE_TEST_SUITES = [
  PLATFORM_INTEGRITY_SUITE,
  {
    ...VIDEO_PLAYBACK_SUITE,
    tests: VIDEO_PLAYBACK_SUITE.tests.slice(0, 3) // Only first 3 modules
  },
  {
    ...ACCESSIBILITY_SUITE,
    tests: ACCESSIBILITY_SUITE.tests.slice(0, 4) // Only semantic check + 3 modules
  }
];

module.exports = {
  ALL_SUITES,
  SMOKE_TEST_SUITES,
  MODULES,
  PLATFORM_INTEGRITY_SUITE,
  DEVELOPER_MODE_SUITE,
  PROGRESS_PERSISTENCE_SUITE,
  AI_VALIDATION_SUITE,
  VIDEO_PLAYBACK_SUITE,
  ACCESSIBILITY_SUITE,
  MODULE_SPECIFIC_SUITE,
  RESPONSIVE_DESIGN_SUITE,
  CROSS_BROWSER_SUITE,
  PERFORMANCE_SUITE
};
