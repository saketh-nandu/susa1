# 3D Scene Fullscreen Fix Bugfix Design

## Overview

The SUSA 3D scene homepage component fails to maintain consistent fullscreen layout due to multiple CSS positioning conflicts and viewport calculation issues. The bug manifests when navigating between pages and on certain device/browser combinations. The root cause is a combination of redundant fixed positioning, conflicting viewport units (vw/vh vs w-screen/h-screen), and missing Canvas-specific styling. The fix will consolidate positioning to a single container level, use consistent viewport units, and ensure the Canvas element properly fills its container across all browsers and navigation states.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when the 3D scene Canvas fails to maintain 100% viewport coverage due to CSS conflicts or navigation state changes
- **Property (P)**: The desired behavior - the 3D scene Canvas fills exactly 100% of the viewport with no gaps or overflow on all devices, browsers, and navigation states
- **Preservation**: All existing 3D scene functionality (letter animations, fracture effects, camera controls, theme changes, responsive behavior) that must remain unchanged
- **SUSA3DScene**: The React Three Fiber component in `src/components/SUSA3DScene.tsx` that renders the 3D letters and scene
- **SUSAHero3D**: The parent component in `src/components/SUSAHero3D.tsx` that wraps the 3D scene with UI overlays
- **Canvas**: The React Three Fiber `<Canvas>` component that creates the WebGL rendering context
- **Fixed Positioning**: CSS `position: fixed` with `inset-0` that positions elements relative to the viewport
- **Viewport Units**: CSS units like `vw`, `vh`, `w-screen`, `h-screen` that reference viewport dimensions

## Bug Details

### Fault Condition

The bug manifests when the 3D scene Canvas is rendered with multiple layers of fixed positioning and conflicting viewport units. The component hierarchy has three levels of fixed positioning (Index page → SUSAHero3D → SUSA3DScene), each attempting to control fullscreen layout. Additionally, the Canvas element uses inline styles that may not properly override Tailwind classes, and viewport unit calculations can differ across browsers.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type RenderContext
  OUTPUT: boolean
  
  RETURN (input.hasMultipleFixedPositionLayers = true)
         AND (input.hasConflictingViewportUnits = true)
         AND (input.canvasStylePriority = "inline-only")
         AND (input.navigationStateChanged = true OR input.browserViewportCalculationDiffers = true)
         AND NOT (canvasFullscreenCoverage = 100%)
END FUNCTION
```

### Examples

- **Navigation Return**: User navigates from home → /about → home. The Canvas resizes incorrectly because React remounts the component and viewport calculations are recalculated with stale values.
- **Mobile Safari**: On iPhone, the 3D scene has a gap at the bottom because Safari's viewport height calculation differs when the address bar is visible vs hidden.
- **Desktop Chrome**: On certain screen sizes, the Canvas has a 1-2px gap on the right edge due to conflicting `w-screen` (100vw) and `width: 100%` styles.
- **Tablet Landscape**: When rotating from portrait to landscape, the Canvas doesn't immediately resize to fill the new viewport dimensions.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All letter animations (floating, fracture effects, hover interactions) must continue to work exactly as before
- Camera controller zoom and navigation transitions must remain smooth and functional
- Letter click handlers must continue to trigger navigation with proper animations
- Background elements (particles, grid floor, lighting) must display correctly
- Theme changes (dark/light mode) must update colors and visual styling appropriately
- Responsive behavior (mobile vs desktop letter positions, camera FOV adjustments) must continue to work

**Scope:**
All inputs that do NOT involve the Canvas container sizing and positioning should be completely unaffected by this fix. This includes:
- All 3D scene content rendering (letters, particles, grid, lighting)
- All user interactions (clicks, hovers, keyboard events)
- All animation and transition logic
- All theme and responsive behavior

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Multiple Fixed Positioning Layers**: Three nested components all use `position: fixed` with `inset-0`:
   - Index.tsx: `<div className="fixed inset-0 h-screen w-screen">`
   - SUSAHero3D.tsx: `<div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}>`
   - SUSA3DScene.tsx: `<div className="fixed inset-0 w-screen h-screen">`
   
   This creates redundant positioning contexts that can conflict during React remounts and navigation state changes.

2. **Conflicting Viewport Units**: The code mixes different viewport unit approaches:
   - Tailwind classes: `w-screen h-screen` (translates to `width: 100vw; height: 100vh`)
   - Inline styles: `width: '100vw', height: '100vh'`
   - Canvas inline styles: `width: '100%', height: '100%'`
   
   The Canvas uses percentage units (100%) while its container uses viewport units (100vw/vh), which can cause mismatches when the browser calculates viewport dimensions differently (especially on mobile with dynamic address bars).

3. **Canvas Style Priority**: The Canvas element uses inline styles (`style={{ width: '100%', height: '100%' }}`) which should override Tailwind classes, but the parent container's viewport units may not provide the correct reference dimensions.

4. **Missing Canvas-Specific Fixes**: The Canvas lacks browser-specific CSS properties that ensure consistent fullscreen behavior:
   - No `position: absolute` on Canvas itself (relies on parent's fixed positioning)
   - No explicit `top: 0; left: 0` on Canvas
   - No `touch-action: none` to prevent mobile scroll interference
   - No `-webkit-overflow-scrolling` handling for iOS

5. **Navigation State Remounting**: When navigating back to the home page, React remounts the SUSA3DScene component. During remount, the `useWindowSize` hook recalculates dimensions, but the Canvas may render before the hook completes, causing a brief sizing mismatch.

## Correctness Properties

Property 1: Fault Condition - Canvas Fullscreen Coverage

_For any_ render context where the home page loads or the user navigates back to the home page, the fixed SUSA3DScene Canvas SHALL fill exactly 100% of the viewport width and height with no gaps, overflow, or sizing mismatches, regardless of device, browser, or navigation state.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - 3D Scene Functionality

_For any_ user interaction or system event that does NOT involve the Canvas container sizing (letter clicks, hover effects, camera movements, theme changes, responsive breakpoint changes), the fixed code SHALL produce exactly the same behavior as the original code, preserving all 3D scene rendering, animations, and interactive functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/components/SUSA3DScene.tsx`

**Function**: `SUSA3DScene` component

**Specific Changes**:
1. **Simplify Container Positioning**: Remove redundant fixed positioning from SUSA3DScene container
   - Change from: `<div className="fixed inset-0 w-screen h-screen pointer-events-auto" style={{ top: 0, left: 0 }}>`
   - Change to: `<div className="absolute inset-0 pointer-events-auto">`
   - Rationale: The parent SUSAHero3D already provides fixed positioning, so SUSA3DScene only needs absolute positioning relative to its parent

2. **Consolidate Canvas Sizing**: Use consistent percentage-based units for Canvas
   - Keep Canvas inline styles: `style={{ width: '100%', height: '100%', display: 'block' }}`
   - Add explicit positioning: `style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0 }}`
   - Rationale: Percentage units relative to the parent container are more reliable than viewport units for nested components

3. **Add Mobile-Specific Fixes**: Include CSS properties for mobile browser compatibility
   - Add to Canvas style: `touchAction: 'none'` to prevent scroll interference
   - Add to container: `style={{ WebkitOverflowScrolling: 'touch' }}` for iOS smoothness
   - Rationale: Mobile browsers have unique viewport calculation quirks that need explicit handling

4. **Ensure Canvas Remount Stability**: Add key prop to Canvas to control remounting behavior
   - Add: `<Canvas key="susa-3d-canvas" ...>`
   - Rationale: Stable key prevents unnecessary remounts during navigation state changes

5. **Verify Parent Container**: Ensure SUSAHero3D uses consistent viewport units
   - Current: `style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}`
   - Keep as-is but verify no conflicts with Index.tsx parent
   - Rationale: The top-level fixed container should use viewport units, but children should use percentage units

**File**: `src/components/SUSAHero3D.tsx`

**Function**: `SUSAHero3D` component

**Specific Changes**:
1. **Simplify Container Styling**: Remove redundant inline styles that duplicate Tailwind classes
   - Current: `style={{ position: 'fixed', inset: 0, top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}`
   - Change to: Keep only `overflow: 'hidden'` in inline styles, use Tailwind for positioning
   - Update className: `className="fixed inset-0 w-screen h-screen bg-background z-[10] overflow-hidden"`
   - Rationale: Reduces CSS conflicts by using a single source of truth (Tailwind classes)

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate navigation state changes and measure Canvas dimensions across different viewport sizes. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Navigation Return Test**: Navigate home → /about → home, measure Canvas dimensions (will fail on unfixed code - Canvas will have incorrect dimensions after return)
2. **Mobile Viewport Test**: Load home page on mobile viewport (375x667), measure Canvas coverage (will fail on unfixed code - gaps may appear due to address bar)
3. **Desktop Resize Test**: Load home page, resize window from 1920x1080 to 1024x768, measure Canvas dimensions (will fail on unfixed code - Canvas may not resize immediately)
4. **Multiple Remount Test**: Rapidly navigate between routes 5 times, measure Canvas dimensions on final home page load (may fail on unfixed code - dimensions may be stale)

**Expected Counterexamples**:
- Canvas dimensions do not match viewport dimensions (e.g., Canvas is 1918x1078 when viewport is 1920x1080)
- Possible causes: conflicting viewport units, multiple fixed positioning layers, missing Canvas positioning styles

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := renderSUSA3DScene_fixed(input)
  ASSERT canvasFullscreenCoverage(result) = 100%
  ASSERT canvasDimensions(result) = viewportDimensions(input)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT renderSUSA3DScene_original(input) = renderSUSA3DScene_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for letter interactions, animations, and theme changes, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Letter Interaction Preservation**: Observe that clicking letters triggers navigation correctly on unfixed code, then write test to verify this continues after fix
2. **Animation Preservation**: Observe that letter floating, fracture effects, and camera movements work correctly on unfixed code, then write test to verify this continues after fix
3. **Theme Change Preservation**: Observe that switching between dark/light mode updates colors correctly on unfixed code, then write test to verify this continues after fix
4. **Responsive Behavior Preservation**: Observe that letter positions and camera FOV adjust correctly on mobile vs desktop on unfixed code, then write test to verify this continues after fix

### Unit Tests

- Test Canvas dimensions match viewport dimensions on initial load
- Test Canvas dimensions remain correct after navigation return
- Test Canvas dimensions update correctly on window resize
- Test Canvas positioning styles are applied correctly (absolute, top: 0, left: 0)
- Test mobile-specific styles are applied (touchAction: none)

### Property-Based Tests

- Generate random viewport dimensions (width: 320-3840, height: 568-2160) and verify Canvas fills 100% of viewport
- Generate random navigation sequences (home → route → home) and verify Canvas dimensions remain correct
- Generate random device types (mobile, tablet, desktop) and verify Canvas coverage is 100% on all devices
- Generate random theme states (dark, light) and verify Canvas rendering is unaffected by theme changes

### Integration Tests

- Test full navigation flow: home → /about → home, verify Canvas is fullscreen on return
- Test window resize flow: load home, resize window 5 times, verify Canvas adapts correctly
- Test mobile address bar flow: scroll down (hide address bar), scroll up (show address bar), verify Canvas remains fullscreen
- Test rapid navigation flow: navigate between routes 10 times quickly, verify Canvas is stable on final home page load
