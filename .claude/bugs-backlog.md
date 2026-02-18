# Bugs Backlog — Known Issues to Fix

> Issues that have been investigated, root-caused, and documented but not yet fixed.
> Each entry includes: what it is, why it happens, the fix, and how to verify safely.

---

## Bug #1 — Video Black Screen on Load (Privacy & Data Rights Module)

**Status:** Investigated, not yet fixed
**Severity:** Medium — affects 4 of 6 video segments in the Privacy module
**Reported:** February 2026 QA review
**Affected file:** `client/src/components/PremiumVideoPlayer.tsx`

---

### What the User Sees

On segments 2, 11, and 13 of the Privacy & Data Rights module (and likely segment 15 too), the video area loads as a completely **black rectangle showing 0:00 duration**. No play button is visible. No loading spinner appears. The video only becomes visible if the user clicks directly on the black area. This does not happen on segments 5 and 8 of the same module.

---

### Key Observation: It's Video-File-Specific

This is the most important clue. The Privacy module uses two video files:

| Code Case | Reporter's Segment # | Video File | Black Screen? |
|-----------|----------------------|------------|---------------|
| case 1    | Segment 2            | `dataAndYou` | YES |
| case 4    | Segment 5            | `chatPrivate` | No — worked fine |
| case 7    | Segment 8            | `chatPrivate` | No — worked fine |
| case 10   | Segment 11           | `dataAndYou` | YES |
| case 12   | Segment 13           | `dataAndYou` | YES |
| case 14   | Segment 15 (est.)    | `dataAndYou` | Likely YES |

**All `dataAndYou` segments black-screen. Both `chatPrivate` segments work.**
This is not a random timing issue — the `dataAndYou` video file loads metadata faster (probably smaller file, or Firebase CDN caches it more aggressively), which causes it to consistently hit the race condition described below.

Full video file paths:
```
Videos/Privacy and AI Tools What You Need to Know/AI,_Your_Data,_and_You.mp4      ← broken
Videos/Privacy and AI Tools What You Need to Know/Your_AI_Chat_Isn_t_Private.mp4   ← fine
```

---

### Root Cause: Race Condition in PremiumVideoPlayer

There are two React effects in `PremiumVideoPlayer.tsx` that interact poorly:

**Effect A — `loadVideo`** (line 235–306, deps: `[videoUrl, userId]`)
- Runs on mount
- Sets `setLoading(true)` → `setVideoFadedIn(false)` (video goes invisible)
- Awaits `getVideoUrl()` to resolve Firebase Storage → HTTPS URL
- Sets `video.src = resolvedUrl`, calls `video.load()`
- Sets `setLoading(false)`

**Effect B — segment change effect** (line 309–502, deps: `[currentSegment?.id, videoUrl, loading, showInteractive]`)
- Has an early-exit guard at line 310: `if (!videoRef.current || loading || !currentSegment) return;`
- When `loading = true`, **exits immediately without attaching any event listeners**
- When `loading = false`, runs and attaches `handleLoadedMetadata`
- `handleLoadedMetadata` (line 326–341) calls `setTimeout(() => setVideoFadedIn(true), 50)` — this is the **only place** `videoFadedIn` is flipped back to `true`

**The race:**

1. `loadVideo` runs, sets `loading = true`, starts async URL resolution
2. Effect B runs, sees `loading = true`, **exits early** — no listener attached
3. `loadVideo` resolves, sets `video.src`, calls `video.load()`, sets `loading = false`
4. For `dataAndYou` (fast-loading): browser already has metadata ready. `readyState >= 1` before Effect B can run
5. Effect B runs (loading is now false), reaches line 322: `if (video.readyState >= 1) { seekToStart(); }` — seeks correctly — **but does NOT call `setVideoFadedIn(true)`**
6. Effect B attaches `handleLoadedMetadata` listener — but the event already fired and **will not fire again**
7. `videoFadedIn` stays `false` permanently → `opacity-0` on the video element → black screen

For `chatPrivate` (slower-loading): metadata hasn't loaded by the time Effect B runs, so `readyState < 1`. Effect B attaches the listener. When metadata eventually loads, `handleLoadedMetadata` fires, calls `setVideoFadedIn(true)`. Works correctly.

**Secondary contributing issue** (line 804):
```tsx
<source src={videoUrl} type="video/mp4" />
```
This uses the raw relative Firebase path (`Videos/...`) not the resolved HTTPS URL. `video.src` is set programmatically with the correct URL, but having a conflicting `<source>` element is messy. Some browsers may attempt to load the invalid `<source>` first, causing an error event before the correct `src` takes over.

---

### The Fix

**File:** `client/src/components/PremiumVideoPlayer.tsx`
**Line:** 322–324

**Current code:**
```typescript
// If metadata is already available (same video URL re-used across segments), seek immediately
if (video.readyState >= 1) {
  seekToStart();
}
```

**Fixed code:**
```typescript
// If metadata is already available (same video URL re-used across segments), seek immediately
if (video.readyState >= 1) {
  seekToStart();
  setVideoFadedIn(true); // metadata already loaded — safe to show immediately
}
```

That's a one-line addition. When the segment change effect finds metadata is already available, it now also triggers the fade-in, closing the gap left by the missed `handleLoadedMetadata` event.

**Optional secondary fix** (lower priority, same file, line 804):
Remove the `<source>` element since `video.src` is always set programmatically:
```tsx
// Remove this:
<source src={videoUrl} type="video/mp4" />
// video.src is set in loadVideo effect — <source> is redundant and uses the wrong URL format
```

---

### Risk Assessment

**Risk level: Medium.** `PremiumVideoPlayer` is a shared component used by most modules. The one-line fix is logically safe (it only fires when `readyState >= 1`, which already means metadata is loaded), but because it touches a shared component, regressions in other modules are possible.

**Modules using PremiumVideoPlayer:**
- What Is AI
- Intro to Gen AI
- Understanding LLMs
- LLM Limitations
- AI Environmental Impact
- Introduction to Prompting
- Privacy & Data Rights

---

### Verification Plan

Test **before** deploying the fix (establish baseline):
1. Open Privacy & Data Rights module in production
2. Advance to Segment 2 (first video — "Who Else Sees Your AI Chats?")
3. Confirm black screen reproduces
4. Note which other video segments also show black screen

Test **after** deploying the fix:
1. **Privacy module — all video segments:**
   - Segment 2 (case 1): `dataAndYou` 0–48.7s → should fade in without clicking
   - Segment 5 (case 4): `chatPrivate` 106.7–199.6s → should still work
   - Segment 8 (case 7): `chatPrivate` 65.3–106s → should still work
   - Segment 11 (case 10): `dataAndYou` 85.2–142s → should now fade in
   - Segment 13 (case 12): `dataAndYou` 142–198.3s → should now fade in
   - Segment 15 (case 14): `dataAndYou` 224–248.5s → should now fade in

2. **Regression tests in other modules (spot-check):**
   - Understanding LLMs: play first video segment → confirm fade-in works
   - AI Environmental Impact: play first video → confirm fade-in works
   - Intro to Gen AI: play first video → confirm fade-in works

3. **Dev Tools throttling test:**
   - Open DevTools → Network tab → set to "Fast 3G"
   - Repeat Privacy module video segments
   - Should still work (slower loads means `readyState < 1` when Effect B runs, existing path)
   - Set to "No throttling"
   - Should also still work (fast loads now handled by the new `readyState` branch)

4. **Cross-fade / segment transition test:**
   - Any module that uses PremiumVideoPlayer with `crossfade: true` segments
   - Confirm the fade-out → fade-in transition still works correctly

5. **Dev Mode skip test:**
   - Activate Dev Mode, use "Skip to End" button on a Privacy video
   - Confirm segment advances correctly and next video fades in

---

### Notes for When You Fix This

- The fix is small but verify the build passes: `npx tsc --noEmit`
- The `<source>` cleanup is optional but worth doing at the same time — it removes a subtle confusion from the codebase
- If you want to be extra safe, add a fallback in `loadVideo` too: after `setLoading(false)`, check `if (videoRef.current?.readyState >= 1) setVideoFadedIn(true)` — belt-and-suspenders approach
- Deploy to Replit and wait for it to go live before running MCP tests

---

*Documented: February 2026*
