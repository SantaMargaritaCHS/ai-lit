// Quick environment variable check for debugging
// This file can be imported anywhere to check if env vars are accessible

export function checkEnvVars() {
  console.log('🔍 Environment Variable Check:');
  console.log('─'.repeat(60));

  // Check all possible variations
  const viteGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const geminiKey = import.meta.env.GEMINI_API_KEY;
  const allEnvVars = import.meta.env;

  console.log('VITE_GEMINI_API_KEY:', viteGeminiKey ? '✅ Present (starts with: ' + viteGeminiKey.substring(0, 10) + '...)' : '❌ Not found');
  console.log('GEMINI_API_KEY:', geminiKey ? '✅ Present (starts with: ' + geminiKey.substring(0, 10) + '...)' : '❌ Not found');

  console.log('\n📋 All available import.meta.env keys:');
  console.log(Object.keys(allEnvVars));

  console.log('─'.repeat(60));

  return {
    viteGeminiKey,
    geminiKey,
    hasAnyKey: Boolean(viteGeminiKey || geminiKey)
  };
}

// Auto-run on import for debugging
if (import.meta.env.DEV) {
  checkEnvVars();
}
