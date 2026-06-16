import { test, expect } from '@playwright/test';

test.describe('Mobile Menu Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
  });

  test('Mobile menu toggle button is visible on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    await expect(toggler).toBeVisible();
  });

  test('Mobile menu toggle button is hidden on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    await expect(toggler).not.toBeVisible();
  });

  test('Mobile menu is collapsed by default on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const navbarCollapse = page.locator('#navbarNav');
    await expect(navbarCollapse).not.toHaveClass(/show/);
  });

  test('Mobile menu expands when toggle button is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    const navbarCollapse = page.locator('#navbarNav');
    
    // Menu should be collapsed initially
    await expect(navbarCollapse).not.toHaveClass(/show/);
    
    // Click toggle button
    await toggler.click();
    
    // Menu should now be expanded
    await expect(navbarCollapse).toHaveClass(/show/);
  });

  test('Mobile menu collapses when toggle button is clicked twice', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    const navbarCollapse = page.locator('#navbarNav');
    
    // Click to expand
    await toggler.click();
    await expect(navbarCollapse).toHaveClass(/show/);
    
    // Click to collapse
    await toggler.click();
    await expect(navbarCollapse).not.toHaveClass(/show/);
  });

  test('Mobile menu navigation links are visible when expanded', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    const navbarCollapse = page.locator('#navbarNav');
    
    // Expand menu
    await toggler.click();
    await expect(navbarCollapse).toHaveClass(/show/);
    
    // Check navigation links are visible
    const navLinks = page.locator('.navbar-nav .nav-link');
    await expect(navLinks).toHaveCount(6);
    
    // Check specific links
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Our Company')).toBeVisible();
    await expect(page.locator('text=Vision & Mission')).toBeVisible();
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
    await expect(page.locator('text=Why We')).toBeVisible();
  });

  test('Mobile menu CTA button is visible when expanded', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    const navbarCollapse = page.locator('#navbarNav');
    
    // Expand menu
    await toggler.click();
    await expect(navbarCollapse).toHaveClass(/show/);
    
    // Check CTA button is visible
    const ctaButton = page.locator('.btn-cta-primary');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('Start Free Trial');
  });

  test('Mobile menu collapses when navigation link is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    const navbarCollapse = page.locator('#navbarNav');
    
    // Expand menu
    await toggler.click();
    await expect(navbarCollapse).toHaveClass(/show/);
    
    // Click on a navigation link
    await page.click('text=Our Company');
    
    // Wait for navigation
    await page.waitForURL('/about');
    
    // Menu should be collapsed after navigation
    await expect(navbarCollapse).not.toHaveClass(/show/);
  });

  test('Mobile menu works on tablet size', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    const navbarCollapse = page.locator('#navbarNav');
    
    // Check if toggler is visible (may vary based on breakpoint)
    const togglerVisible = await toggler.isVisible();
    
    if (togglerVisible) {
      // If toggler is visible, test the toggle functionality
      await toggler.click();
      await expect(navbarCollapse).toHaveClass(/show/);
      
      await toggler.click();
      await expect(navbarCollapse).not.toHaveClass(/show/);
    } else {
      // If toggler is not visible, menu should always be visible
      await expect(navbarCollapse).toBeVisible();
    }
  });

  test('Mobile menu toggle button has correct accessibility attributes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    
    // Check for required accessibility attributes
    await expect(toggler).toHaveAttribute('type', 'button');
    await expect(toggler).toHaveAttribute('aria-controls', 'navbarNav');
    await expect(toggler).toHaveAttribute('aria-label', 'Toggle navigation');
  });

  test('Mobile menu maintains state across page navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    const navbarCollapse = page.locator('#navbarNav');
    
    // Expand menu
    await toggler.click();
    await expect(navbarCollapse).toHaveClass(/show/);
    
    // Navigate to another page
    await page.goto('/about', { waitUntil: 'networkidle' });
    
    // Menu should be collapsed on new page
    await expect(navbarCollapse).not.toHaveClass(/show/);
  });
});
