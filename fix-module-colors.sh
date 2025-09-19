#!/bin/bash

# Script to help fix color issues in modules
# This performs common replacements to migrate to semantic colors

echo "Fixing module color issues..."

# List of modules to fix
MODULES=(
  "client/src/components/modules/UnderstandingLLMsModule.tsx"
  "client/src/components/modules/LLMLimitationsModule.tsx"
  "client/src/components/modules/PrivacyDataRightsModule.tsx"
  "client/src/components/modules/AIEnvironmentalImpactModule.tsx"
  "client/src/components/modules/IntroductionToPromptingModule.tsx"
  "client/src/components/WhatIsAIModule/WhatIsAIModule.tsx"
)

for MODULE in "${MODULES[@]}"; do
  if [ -f "$MODULE" ]; then
    echo "Processing $MODULE..."
    
    # Backup original
    cp "$MODULE" "$MODULE.backup"
    
    # Common replacements
    sed -i '' \
      -e 's/className="min-h-screen bg-gradient-to-br from-[a-z-]*900 [^"]*"/className="min-h-screen bg-module"/g' \
      -e 's/text-white/text-primary/g' \
      -e 's/text-blue-200/text-muted/g' \
      -e 's/text-blue-300/text-accent/g' \
      -e 's/text-purple-200/text-accent-secondary/g' \
      -e 's/text-purple-300/text-accent-secondary/g' \
      -e 's/text-gray-400/text-muted/g' \
      -e 's/text-gray-300/text-secondary/g' \
      -e 's/bg-white\/10/bg-card/g' \
      -e 's/bg-blue-500\/20/bg-blue-soft/g' \
      -e 's/bg-purple-500\/20/bg-purple-soft/g' \
      -e 's/bg-green-500\/20/bg-green-soft/g' \
      -e 's/bg-yellow-500\/20/bg-yellow-soft/g' \
      -e 's/bg-red-500\/20/bg-red-soft/g' \
      -e 's/border-white\/30/border-primary/g' \
      -e 's/border-white\/20/border-primary/g' \
      "$MODULE"
    
    echo "✓ Fixed $MODULE"
  else
    echo "✗ Module not found: $MODULE"
  fi
done

echo "Done! Please review changes and test in both light and dark modes."
echo "Backup files created with .backup extension"