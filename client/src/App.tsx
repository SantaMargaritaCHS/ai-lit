import React from 'react';
import { Route, Switch, Router } from 'wouter';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';
import { UserProvider } from './context/UserContext';
import { ActivityRegistryProvider } from './context/ActivityRegistryContext';
import { UniversalDevModeProvider } from './components/UniversalDevModeProvider';
import { ThemeProvider } from './context/ThemeContext';

// Import the 9 modules
import WhatIsAIModule from './components/WhatIsAIModule/WhatIsAIModule';
import IntroToGenAIModule from './components/modules/IntroToGenAIModule';
import ResponsibleEthicalAIModule from './components/modules/ResponsibleEthicalAIModule';
import UnderstandingLLMsModule from './components/modules/UnderstandingLLMsModule';
import LLMLimitationsModule from './components/modules/LLMLimitationsModule';
import PrivacyDataRightsModule from './components/modules/PrivacyDataRightsModule';
import AIEnvironmentalImpactModule from './components/modules/AIEnvironmentalImpactModule';
import IntroductionToPromptingModule from './components/modules/IntroductionToPromptingModule';
import AncientCompassModule from './components/modules/AncientCompassModule';

// Import Module Builder (isolated - does not affect existing modules)
import { ModuleBuilderPage } from './components/builder';

const moduleMap = {
  'what-is-ai': WhatIsAIModule,
  'intro-to-gen-ai': IntroToGenAIModule,
  'responsible-ethical-ai': ResponsibleEthicalAIModule,
  'understanding-llms': UnderstandingLLMsModule,
  'llm-limitations': LLMLimitationsModule,
  'privacy-data-rights': PrivacyDataRightsModule,
  'ai-environmental-impact': AIEnvironmentalImpactModule,
  'introduction-to-prompting': IntroductionToPromptingModule,
  'ancient-compass-ai-ethics': AncientCompassModule,
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ai-literacy-theme">
      <UserProvider>
        <ActivityRegistryProvider>
          <UniversalDevModeProvider>
            <Router>
              <Switch>
                <Route path="/" component={HomePage} />
                {/* Module Builder - Isolated route (does not affect existing modules) */}
                <Route path="/builder" component={ModuleBuilderPage} />
                <Route path="/module/:moduleId">
                  {(params) => <ModulePage moduleId={params.moduleId} moduleMap={moduleMap} />}
                </Route>
              </Switch>
            </Router>
          </UniversalDevModeProvider>
        </ActivityRegistryProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;