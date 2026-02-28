import { test, expect, Page } from '@playwright/test';
import * as fc from 'fast-check';

/**
 * Bug Condition Exploration Test for 3D Scene Canvas Fullscreen Coverage
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 * 
 * Property 1: Fault Condition - Canvas Fullscreen Coverage
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * DO NOT attempt to fix the test or the code when it fails.
 * 
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation.
 * 
 * GOAL: Surface counterexamples that demonstrate the bug exists.
 * 
 * Scoped PBT Approach: Test concrete failing cases:
 * - Navigation return (home → /about → home)
 * - Mobile viewport (375x667)
 * - Desktop resize (1920x1080 → 1024x768)
 * - Rapid navigation (5 times between routes)
 */

// Helper function to get Canvas dimensions
async function getCanvasDimensions(page: Page) {
  return await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      throw new Error('Canvas element not found');
    }
    
    const rect = canvas.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
    };
  });
}

// Helper function to get viewport dimensions
async function getViewportDimensions(page: Page) {
  return await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
}

// Helper function to check if Canvas fills viewport exactly
async function checkCanvasFullscreenCoverage(page: Page) {
  const canvas = await getCanvasDimensions(page);
  const viewport = await getViewportDimensions(page);
  
  // Allow 1px tolerance for rounding differences
  const tolerance = 1;
  
  const widthMatch = Math.abs(canvas.width - viewport.width) <= tolerance;
  const heightMatch = Math.abs(canvas.height - viewport.height) <= tolerance;
  const topMatch = Math.abs(canvas.top) <= tolerance;
  const leftMatch = Math.abs(canvas.left) <= tolerance;
  
  return {
    isFullscreen: widthMatch && heightMatch && topMatch && leftMatch,
    canvas,
    viewport,
    gaps: {
      width: viewport.width - canvas.width,
      height: viewport.height - canvas.height,
      top: canvas.top,
      left: canvas.left,
    },
  };
}

test.describe('Canvas Fullscreen Bug Exploration', () => {
  
  test('Navigation Return: Canvas dimensions after home → /about → home', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(1000); // Wait for 3D scene to initialize
    
    // Measure initial Canvas dimensions
    const initialCheck = await checkCanvasFullscreenCoverage(page);
    console.log('Initial Canvas:', initialCheck.canvas);
    console.log('Initial Viewport:', initialCheck.viewport);
    console.log('Initial Gaps:', initialCheck.gaps);
    
    // Navigate to /about
    await page.goto('/about');
    await page.waitForTimeout(500);
    
    // Navigate back to home
    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(1000); // Wait for remount and resize
    
    // Measure Canvas dimensions after navigation return
    const afterNavCheck = await checkCanvasFullscreenCoverage(page);
    console.log('After Navigation Canvas:', afterNavCheck.canvas);
    console.log('After Navigation Viewport:', afterNavCheck.viewport);
    console.log('After Navigation Gaps:', afterNavCheck.gaps);
    
    // EXPECTED TO FAIL: Canvas should NOT fill viewport correctly after navigation
    // This failure confirms the bug exists
    expect(afterNavCheck.isFullscreen, 
      `Canvas should fill 100% of viewport after navigation return. ` +
      `Canvas: ${afterNavCheck.canvas.width}x${afterNavCheck.canvas.height}, ` +
      `Viewport: ${afterNavCheck.viewport.width}x${afterNavCheck.viewport.height}, ` +
      `Gaps: width=${afterNavCheck.gaps.width}px, height=${afterNavCheck.gaps.height}px, ` +
      `top=${afterNavCheck.gaps.top}px, left=${afterNavCheck.gaps.left}px`
    ).toBe(true);
  });
  
  test('Mobile Viewport: Canvas coverage on 375x667 (iPhone SE)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to home page
    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(1000); // Wait for 3D scene to initialize
    
    // Measure Canvas dimensions
    const check = await checkCanvasFullscreenCoverage(page);
    console.log('Mobile Canvas:', check.canvas);
    console.log('Mobile Viewport:', check.viewport);
    console.log('Mobile Gaps:', check.gaps);
    
    // EXPECTED TO FAIL: Canvas may have gaps on mobile due to address bar handling
    // This failure confirms the bug exists
    expect(check.isFullscreen,
      `Canvas should fill 100% of mobile viewport. ` +
      `Canvas: ${check.canvas.width}x${check.canvas.height}, ` +
      `Viewport: ${check.viewport.width}x${check.viewport.height}, ` +
      `Gaps: width=${check.gaps.width}px, height=${check.gaps.height}px, ` +
      `top=${check.gaps.top}px, left=${check.gaps.left}px`
    ).toBe(true);
  });
  
  test('Desktop Resize: Canvas dimensions after resize from 1920x1080 to 1024x768', async ({ page }) => {
    // Set initial desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate to home page
    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(1000); // Wait for 3D scene to initialize
    
    // Measure initial Canvas dimensions
    const initialCheck = await checkCanvasFullscreenCoverage(page);
    console.log('Initial Desktop Canvas:', initialCheck.canvas);
    console.log('Initial Desktop Viewport:', initialCheck.viewport);
    
    // Resize viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500); // Wait for resize to complete
    
    // Measure Canvas dimensions after resize
    const afterResizeCheck = await checkCanvasFullscreenCoverage(page);
    console.log('After Resize Canvas:', afterResizeCheck.canvas);
    console.log('After Resize Viewport:', afterResizeCheck.viewport);
    console.log('After Resize Gaps:', afterResizeCheck.gaps);
    
    // EXPECTED TO FAIL: Canvas may not resize immediately or correctly
    // This failure confirms the bug exists
    expect(afterResizeCheck.isFullscreen,
      `Canvas should fill 100% of viewport after resize. ` +
      `Canvas: ${afterResizeCheck.canvas.width}x${afterResizeCheck.canvas.height}, ` +
      `Viewport: ${afterResizeCheck.viewport.width}x${afterResizeCheck.viewport.height}, ` +
      `Gaps: width=${afterResizeCheck.gaps.width}px, height=${afterResizeCheck.gaps.height}px, ` +
      `top=${afterResizeCheck.gaps.top}px, left=${afterResizeCheck.gaps.left}px`
    ).toBe(true);
  });
  
  test('Rapid Navigation: Canvas dimensions after 5 rapid navigations', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(1000); // Wait for initial load
    
    // Perform rapid navigation between routes
    for (let i = 0; i < 5; i++) {
      await page.goto('/about');
      await page.waitForTimeout(200);
      await page.goto('/');
      await page.waitForSelector('canvas', { timeout: 10000 });
      await page.waitForTimeout(200);
    }
    
    // Wait for final render
    await page.waitForTimeout(1000);
    
    // Measure Canvas dimensions after rapid navigation
    const check = await checkCanvasFullscreenCoverage(page);
    console.log('After Rapid Navigation Canvas:', check.canvas);
    console.log('After Rapid Navigation Viewport:', check.viewport);
    console.log('After Rapid Navigation Gaps:', check.gaps);
    
    // EXPECTED TO FAIL: Canvas may have stale dimensions after rapid remounting
    // This failure confirms the bug exists
    expect(check.isFullscreen,
      `Canvas should fill 100% of viewport after rapid navigation. ` +
      `Canvas: ${check.canvas.width}x${check.canvas.height}, ` +
      `Viewport: ${check.viewport.width}x${check.viewport.height}, ` +
      `Gaps: width=${check.gaps.width}px, height=${check.gaps.height}px, ` +
      `top=${check.gaps.top}px, left=${check.gaps.left}px`
    ).toBe(true);
  });
  
  test('Property-Based: Canvas fills viewport across random viewport sizes', async ({ page }) => {
    // Property-based test using fast-check
    // Generate random viewport dimensions and verify Canvas coverage
    
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 320, max: 1920 }), // width
        fc.integer({ min: 568, max: 1080 }), // height
        async (width, height) => {
          // Set viewport size
          await page.setViewportSize({ width, height });
          
          // Navigate to home page
          await page.goto('/');
          await page.waitForSelector('canvas', { timeout: 10000 });
          await page.waitForTimeout(1000); // Wait for 3D scene to initialize
          
          // Check Canvas coverage
          const check = await checkCanvasFullscreenCoverage(page);
          
          // Log for debugging
          if (!check.isFullscreen) {
            console.log(`COUNTEREXAMPLE FOUND: Viewport ${width}x${height}`);
            console.log('Canvas:', check.canvas);
            console.log('Gaps:', check.gaps);
          }
          
          // EXPECTED TO FAIL: Canvas should fill viewport for all sizes
          // Failures will surface counterexamples demonstrating the bug
          return check.isFullscreen;
        }
      ),
      { 
        numRuns: 10, // Run 10 random test cases
        verbose: true,
      }
    );
  });
});
