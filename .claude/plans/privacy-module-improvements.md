# Privacy & Data Rights Module - Improvement Plan

**Created:** February 9, 2026
**Status:** ✅ COMPLETED
**Module:** `/module/privacy-data-rights`

---

## ✅ Completed (February 9, 2026)

### Phase 1: Date Updates
- [x] Updated all 20 citation access dates to February 9, 2026
- [x] Updated header comments in data files
- [x] Updated simulated Snapchat ToS "Last Updated" text
- [x] Updated Works Cited "accurate as of" text

### Phase 2: Missing Citations Added
- [x] **Google Gemini** - Added citations [24, 25]
  - Gemini Apps Privacy Hub
  - Gemini API Additional Terms of Service
- [x] **Claude.ai** - Added citations [26, 27, 28]
  - How long do you store my data?
  - Updates to Consumer Terms and Privacy Policy
  - How does Anthropic protect personal data?
- [x] **Perplexity AI** - Added citations [29, 30]
  - Perplexity Privacy Policy (Feb 5, 2026)
  - What data does Perplexity collect?

### Phase 3: New Tools Added
- [x] **Grok (X/xAI)** - Added as HIGH RISK with citations [31, 32, 33]
  - xAI Privacy Policy
  - X Terms of Service Update (Jan 15, 2026)
  - xAI Consumer Terms of Service
  - WARNING: Perpetual license, NO opt-out after Jan 15, 2026
- [x] **Meta AI** - Added as HIGH RISK with citations [34, 35]
  - WebProNews article on 2026 policy
  - Data Studios WhatsApp analysis
  - WARNING: AI chats used for ads, no full opt-out in US

### Phase 4: Tool Updates
- [x] **Google Gemini** - Updated with human reviewer info, 18-month retention
- [x] **Claude.ai** - Updated with opt-in training option (30-day default vs 5-year opt-in)
- [x] **Perplexity AI** - Updated with training opt-out info, 30-day deletion

### Phase 5: Know Your Rights Section
- [x] Added "Know Your Rights: Laws That Protect You" section to action-plan
  - COPPA (Children's Online Privacy Protection Act)
  - State Privacy Laws (CCPA, Virginia, etc.)
  - EU AI Act & GDPR

---

## Files Modified

**Citations:**
- `client/src/data/privacyPolicyCitations.ts` - Added 12 new citations (#24-35)

**Tools Data:**
- `client/src/data/aiToolsPrivacyData.ts` - Updated 3 tools, added 2 new tools

**Module:**
- `client/src/components/modules/PrivacyDataRightsModule.tsx` - Added Know Your Rights section

---

## Summary Statistics

| Metric | Before | After |
|--------|--------|-------|
| Total Citations | 23 | 35 |
| Total AI Tools | 10 | 12 |
| High-Risk Tools | 4 | 6 |
| Tools with Citations | 7 | 12 |

---

## New Tool Risk Assessment

| Tool | Rating | Key Risk |
|------|--------|----------|
| Grok (X/xAI) | 🔴 LOW | Perpetual license, NO opt-out |
| Meta AI | 🔴 LOW | AI chats used for ads, no US opt-out |

---

## Future Considerations (Not Implemented)

- [ ] Add voice/image privacy considerations (AI voice cloning, image generation)
- [ ] Add step-by-step data deletion guides for each tool
- [ ] Research current teen AI usage trends for 2026
- [ ] Add Progress Persistence to this module
- [ ] Consider separate "Your Rights" activity if content grows

---

## Research Sources

### Grok/X
- https://x.ai/legal/privacy-policy
- https://privacy.x.com/en/blog/2025/updates-tos-privacy-policy
- https://x.ai/legal/terms-of-service

### Meta AI
- https://www.webpronews.com/metas-2026-ai-policy-sparks-privacy-fury-over-chat-data-use/
- https://www.datastudios.org/post/meta-ai-in-whatsapp-assistant-behavior-model-updates-and-data-privacy-controls

### Claude.ai
- https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data
- https://www.anthropic.com/news/updates-to-our-consumer-terms
- https://privacy.claude.com/en/articles/10458704-how-does-anthropic-protect-the-personal-data-of-claude-users

### Perplexity AI
- https://www.perplexity.ai/hub/legal/privacy-policy
- https://www.perplexity.ai/help-center/en/articles/10354855-what-data-does-perplexity-collect-about-me

### Google Gemini
- https://support.google.com/gemini/answer/13594961
- https://ai.google.dev/gemini-api/terms
