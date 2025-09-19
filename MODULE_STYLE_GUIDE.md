# Module Style Guide - AI Literacy Platform

## Theme-Aware Color System

This guide ensures consistent theming across all modules that automatically adapts to light and dark modes.

## Core Principles

1. **Never use hardcoded colors** - Always use semantic classes that adapt to theme
2. **Test in both modes** - Ensure readability in both light and dark themes
3. **Use semantic naming** - Classes should describe intent, not appearance

## Semantic Color Classes

### Text Colors
```tsx
// Primary text (adapts: gray-900 → white)
className="text-primary"  // or just omit, as it's default

// Secondary text (adapts: gray-700 → gray-300)
className="text-secondary"

// Muted text (adapts: gray-600 → gray-400)
className="text-muted"

// Accent colors (auto-adapt to theme)
className="text-accent"           // blue-600 → blue-400
className="text-accent-secondary"  // purple-600 → purple-400
```

### Background Colors
```tsx
// Module/page backgrounds
className="bg-module"      // white → gray-900

// Card backgrounds
className="bg-card"        // gray-50 → gray-800
className="bg-card-hover"  // gray-100 → gray-700

// Colored backgrounds with automatic text contrast
className="bg-blue-soft"    // blue-50 → blue-900/30, auto text color
className="bg-purple-soft"  // purple-50 → purple-900/30, auto text color
className="bg-green-soft"   // green-50 → green-900/30, auto text color
className="bg-yellow-soft"  // yellow-50 → yellow-900/30, auto text color
className="bg-red-soft"     // red-50 → red-900/30, auto text color
className="bg-orange-soft"  // orange-50 → orange-900/30, auto text color
```

### Border Colors
```tsx
className="border-primary"          // gray-200 → gray-700
className="border-accent"           // blue-300 → blue-700
className="border-accent-secondary" // purple-300 → purple-700
```

## Migration Examples

### ❌ Before (Wrong)
```tsx
// Hardcoded colors that break in different themes
<div className="bg-purple-500/20 text-white">
<h3 className="text-blue-200">Title</h3>
<p className="text-gray-400">Content</p>

// Light backgrounds with white text (invisible!)
<div className="bg-blue-50 text-white">
```

### ✅ After (Correct)
```tsx
// Semantic classes that adapt to theme
<div className="bg-purple-soft">
<h3 className="text-accent">Title</h3>
<p className="text-muted">Content</p>

// Automatic contrast adjustment
<div className="bg-blue-soft"> // Text color handled automatically
```

## Common Patterns

### Cards
```tsx
<Card className="bg-card border border-primary">
  <CardHeader>
    <CardTitle className="text-primary">Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-secondary">Content here</p>
  </CardContent>
</Card>
```

### Colored Sections
```tsx
// Info section
<div className="bg-blue-soft p-4 rounded-lg">
  <h3 className="font-semibold mb-2">Information</h3>
  <p>This text automatically has proper contrast</p>
</div>

// Success section  
<div className="bg-green-soft p-4 rounded-lg">
  <h3 className="font-semibold mb-2">Success!</h3>
  <p>Your answer is correct</p>
</div>
```

### Progress Indicators
```tsx
<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
  <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}} />
</div>
```

### Interactive Elements
```tsx
// Buttons maintain their gradients but ensure contrast
<Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
  Click Me
</Button>

// Option buttons that adapt
<button className={selected 
  ? "bg-blue-soft border-2 border-blue-500"
  : "bg-card border border-primary hover:bg-card-hover"
}>
  Option
</button>
```

## Icon Colors
```tsx
// Icons should use semantic colors
<Brain className="text-blue-600 dark:text-blue-400" />
<CheckCircle className="text-green-600 dark:text-green-400" />
<AlertCircle className="text-yellow-600 dark:text-yellow-400" />
<XCircle className="text-red-600 dark:text-red-400" />
```

## Testing Checklist

Before committing any module changes:

- [ ] Test in light mode - all text readable?
- [ ] Test in dark mode - all text readable?
- [ ] No `text-white` on light backgrounds
- [ ] No `text-black` on dark backgrounds  
- [ ] All interactive elements have hover states
- [ ] Focus states are visible in both themes

## Quick Reference

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `text-white` | `text-primary` or remove | Automatic contrast |
| `text-blue-200` | `text-muted` | Subtle text |
| `bg-blue-500/20` | `bg-blue-soft` | Includes text color |
| `bg-white/10` | `bg-card` | Card backgrounds |
| `border-white/30` | `border-primary` | Adaptive borders |
| `text-gray-400` | `text-muted` | Muted text |
| `bg-gradient-to-br from-blue-900` | `bg-module` | Module backgrounds |

## Adding New Semantic Classes

If you need a new semantic color, add it to `/client/src/index.css`:

```css
@layer utilities {
  .bg-[name]-soft {
    @apply bg-[color]-50 dark:bg-[color]-900/30 
           text-[color]-900 dark:text-[color]-100;
  }
}
```

This ensures the color works in both themes with proper text contrast.

## Questions?

When in doubt:
1. Check existing modules that have been updated (IntroToGenAIModule, IntroLLMsModule)
2. Test in both light and dark modes
3. Use semantic classes over specific color values