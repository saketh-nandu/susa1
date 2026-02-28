# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Canvas Fullscreen Coverage
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: navigation return, mobile viewport, desktop resize, and rapid remounting scenarios
  - Test that the Canvas fills exactly 100% of viewport width and height with no gaps or overflow
  - Test navigation return: home → /about → home, measure Canvas dimensions (expect mismatch with viewport)
  - Test mobile viewport: Load on 375x667, measure Canvas coverage (expect gaps due to address bar handling)
  - Test desktop resize: Resize from 1920x1080 to 1024x768, measure Canvas dimensions (expect delayed resize)
  - Test rapid navigation: Navigate between routes 5 times, measure Canvas on final home load (expect stale dimensions)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "Canvas is 1918x1078 when viewport is 1920x1080", "Canvas has 50px gap at bottom on mobile Safari")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - 3D Scene Functionality
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (letter interactions, animations, theme changes, responsive behavior)
  - Observe: Clicking letters triggers navigation correctly on unfixed code
  - Observe: Letter floating, fracture effects, and camera movements work correctly on unfixed code
  - Observe: Theme changes (dark/light mode) update colors correctly on unfixed code
  - Observe: Letter positions and camera FOV adjust correctly on mobile vs desktop on unfixed code
  - Write property-based tests capturing observed behavior patterns:
    - Letter interaction preservation: for all letter click events, navigation is triggered with proper animations
    - Animation preservation: for all animation frames, letter floating, fracture effects, and camera movements render correctly
    - Theme change preservation: for all theme state changes, colors and visual styling update appropriately
    - Responsive behavior preservation: for all viewport breakpoint changes, letter positions and camera FOV adjust correctly
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 3. Fix for 3D Scene Fullscreen Layout

  - [x] 3.1 Simplify SUSA3DScene container positioning
    - Remove redundant fixed positioning from SUSA3DScene container
    - Change from: `<div className="fixed inset-0 w-screen h-screen pointer-events-auto" style={{ top: 0, left: 0 }}>`
    - Change to: `<div className="absolute inset-0 pointer-events-auto">`
    - Parent SUSAHero3D already provides fixed positioning, so SUSA3DScene only needs absolute positioning
    - _Bug_Condition: isBugCondition(input) where input.hasMultipleFixedPositionLayers = true_
    - _Expected_Behavior: canvasFullscreenCoverage = 100% from design_
    - _Preservation: All 3D scene functionality (letter animations, fracture effects, camera controls, theme changes, responsive behavior) from design_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.2 Consolidate Canvas sizing with explicit positioning
    - Keep Canvas inline styles with percentage-based units
    - Add explicit positioning to Canvas: `style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0 }}`
    - Percentage units relative to parent container are more reliable than viewport units for nested components
    - _Bug_Condition: isBugCondition(input) where input.hasConflictingViewportUnits = true AND input.canvasStylePriority = "inline-only"_
    - _Expected_Behavior: canvasDimensions = viewportDimensions from design_
    - _Preservation: All 3D scene rendering and interactions from design_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.3 Add mobile-specific fixes for Canvas
    - Add to Canvas style: `touchAction: 'none'` to prevent scroll interference
    - Add to container: `style={{ WebkitOverflowScrolling: 'touch' }}` for iOS smoothness
    - Mobile browsers have unique viewport calculation quirks that need explicit handling
    - _Bug_Condition: isBugCondition(input) where input.browserViewportCalculationDiffers = true (mobile Safari, iOS)_
    - _Expected_Behavior: canvasFullscreenCoverage = 100% on mobile devices from design_
    - _Preservation: All mobile responsive behavior and touch interactions from design_
    - _Requirements: 2.2, 2.4, 3.5, 3.6_

  - [x] 3.4 Add stable key prop to Canvas
    - Add: `<Canvas key="susa-3d-canvas" ...>`
    - Stable key prevents unnecessary remounts during navigation state changes
    - _Bug_Condition: isBugCondition(input) where input.navigationStateChanged = true_
    - _Expected_Behavior: Canvas dimensions remain correct after navigation return from design_
    - _Preservation: All 3D scene state and animations persist correctly from design_
    - _Requirements: 2.3, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.5 Simplify SUSAHero3D container styling
    - Remove redundant inline styles that duplicate Tailwind classes
    - Change from: `style={{ position: 'fixed', inset: 0, top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}`
    - Change to: Keep only `overflow: 'hidden'` in inline styles, use Tailwind for positioning
    - Update className: `className="fixed inset-0 w-screen h-screen bg-background z-[10] overflow-hidden"`
    - Reduces CSS conflicts by using a single source of truth (Tailwind classes)
    - _Bug_Condition: isBugCondition(input) where input.hasConflictingViewportUnits = true_
    - _Expected_Behavior: Consistent viewport unit usage from design_
    - _Preservation: All UI overlay and background behavior from design_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Canvas Fullscreen Coverage
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify Canvas fills exactly 100% of viewport on navigation return, mobile viewport, desktop resize, and rapid navigation scenarios
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - 3D Scene Functionality
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix: letter interactions, animations, theme changes, responsive behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
