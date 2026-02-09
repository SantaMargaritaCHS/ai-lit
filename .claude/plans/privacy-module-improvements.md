# Privacy & Data Rights Module - Improvement Plan

**Created:** February 9, 2026
**Status:** In Progress
**Module:** `/module/privacy-data-rights`

---

## Completed

### Date Updates (Feb 9, 2026)
- [x] Updated all 20 citation access dates to February 9, 2026
- [x] Updated header comments in data files
- [x] Updated simulated Snapchat ToS "Last Updated" text
- [x] Updated Works Cited "accurate as of" text

**Files Modified:**
- `client/src/data/privacyPolicyCitations.ts`
- `client/src/data/policyComparisonData.ts`
- `client/src/data/aiToolsPrivacyData.ts`
- `client/src/components/PrivacyModule/TCTimerChallenge.tsx`
- `client/src/components/modules/PrivacyDataRightsModule.tsx`

---

## Pending Improvements

### 1. Missing Citations (High Priority)
These tools have no citations (`citationIds: []`):
- [ ] **Google Gemini** - Need privacy policy and ToS citations
- [ ] **Claude.ai** - Need Anthropic usage policy citations
- [ ] **Perplexity AI** - Need privacy policy citations

**Action:** Research and add 2-3 citations per tool

### 2. Add New AI Tools (Medium Priority)
Popular with teens in 2026, not currently covered:
- [ ] **Grok** (X/Twitter's AI) - Growing usage among students
- [ ] **Meta AI** (WhatsApp/Instagram integration)
- [ ] **Microsoft Copilot Pro** (paid consumer version vs education)

**Action:** Research privacy policies and add to `aiToolsPrivacyData.ts`

### 3. Verify Age Restrictions (Medium Priority)
- [ ] **Google Gemini** - Currently listed as 18+, verify if still accurate
- [ ] Check if any other platforms have updated age requirements

### 4. Add "Know Your Rights" Section (Medium Priority)
Currently no coverage of:
- [ ] **COPPA** protections (mentioned but not explained)
- [ ] **State privacy laws** (CCPA, Virginia VCDPA, etc.)
- [ ] **EU AI Act** enforcement (relevant for global context)
- [ ] **FTC actions** against AI companies

**Action:** Consider adding a brief "Your Legal Rights" activity or callout

### 5. Content Enhancements (Lower Priority)
- [ ] Add voice/image privacy considerations (AI voice cloning, image generation)
- [ ] Add step-by-step data deletion guides for each tool
- [ ] Research current teen AI usage trends for 2026
- [ ] Add section on AI in college admissions (relevant to Jordan scenario)

---

## Technical Debt

- [ ] Add Progress Persistence to this module (currently not implemented per CLAUDE.md)
- [ ] Verify all external URLs still resolve correctly
- [ ] Consider adding Dev Mode reflection shortcuts (if not present)

---

## Notes

- The Jordan simulation scenario is timeless and doesn't need date updates
- External article URLs containing "2025" are correct (publication dates)
- Module has 8 activities with good educational flow
- Exit ticket has AI validation but escape hatch status unclear

---

## How to Resume

```bash
# Review this plan
cat /home/runner/workspace/.claude/plans/privacy-module-improvements.md

# Key files to edit
client/src/data/aiToolsPrivacyData.ts      # Add new tools
client/src/data/privacyPolicyCitations.ts  # Add citations
```
