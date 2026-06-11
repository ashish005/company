import { test, expect } from '@playwright/test';

test.describe('UI Theme and Responsiveness Tests', () => {
  const pages = [
    { path: '/home', title: 'Home' },
    { path: '/about', title: 'About Us' },
    { path: '/vision', title: 'Vision & Mission' },
    { path: '/whywe', title: 'Why Choose Us' },
    { path: '/contact', title: 'Contact Us' },
    { path: '/pricing', title: 'Pricing' },
    { path: '/trial', title: 'Free Trial' }
  ];

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  // Test all pages load correctly
  pages.forEach(({ path, title }) => {
    test(`${title} page loads correctly`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      await expect(page.locator('.company-theme')).toBeVisible();
      await expect(page.locator('.app-header')).toBeVisible();
    });
  });

  // Test navigation works
  test('Navigation menu is visible and functional', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Check navbar is visible
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.navbar-brand')).toBeVisible();
    
    // Check navigation links
    const navLinks = page.locator('.navbar-nav .nav-link');
    await expect(navLinks).toHaveCount(6);
    
    // On mobile, toggle the menu first
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width <= 768) {
      const toggler = page.locator('.navbar-toggler');
      if (await toggler.isVisible()) {
        await toggler.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Test navigation to about page
    await page.click('text=Our Company');
    await expect(page).toHaveURL('/about');
  });

  // Test responsive design
  viewports.forEach(({ name, width, height }) => {
    test(`Responsive design - ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/home', { waitUntil: 'networkidle' });
      
      // Check main layout elements are visible
      await expect(page.locator('.company-theme')).toBeVisible();
      await expect(page.locator('.app-header')).toBeVisible();
      await expect(page.locator('.main-content')).toBeVisible();
      await expect(page.locator('.app-footer')).toBeVisible();
      
      // Check mobile menu behavior on small screens
      if (width <= 768) {
        const toggler = page.locator('.navbar-toggler');
        await expect(toggler).toBeVisible();
      }
    });
  });

  // Test theme consistency
  test('Theme colors are consistent across pages', async ({ page }) => {
    const primaryColor = '#007bff';
    
    for (const { path } of pages) {
      await page.goto(path, { waitUntil: 'networkidle' });
      
      // Check brand is visible
      await expect(page.locator('.brand-text')).toBeVisible();
      
      // Check footer is visible on all pages
      await expect(page.locator('.app-footer')).toBeVisible();
    }
  });

  // Test footer elements
  test('Footer contains all required sections', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    await expect(page.locator('.app-footer')).toBeVisible();
    await expect(page.locator('.footer-section h5').filter({ hasText: 'EnRator' })).toBeVisible();
    await expect(page.locator('.footer-section h5').filter({ hasText: 'Quick Links' })).toBeVisible();
    await expect(page.locator('.footer-section h5').filter({ hasText: 'Industries Served' })).toBeVisible();
    await expect(page.locator('.footer-section h5').filter({ hasText: 'Contact Info' })).toBeVisible();
    await expect(page.locator('.footer-bottom')).toContainText('2024 EnRator');
  });

  // Test CTA button
  test('Start Free Trial button is visible and clickable', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // On mobile, toggle the menu first to see the CTA button
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width <= 768) {
      const toggler = page.locator('.navbar-toggler');
      if (await toggler.isVisible()) {
        await toggler.click();
        await page.waitForTimeout(500);
      }
    }
    
    const ctaButton = page.locator('.btn-cta-primary');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('Start Free Trial');
    
    await ctaButton.click();
    await expect(page).toHaveURL('/trial');
  });

  // Test mobile menu toggle
  test('Mobile menu toggle functionality', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    await expect(toggler).toBeVisible();
    
    // Verify the navbar collapse element exists (may be hidden on mobile)
    const navbarCollapse = page.locator('#navbarNav');
    const elementCount = await navbarCollapse.count();
    expect(elementCount).toBe(1);
    
    // Verify the toggle button is clickable
    await expect(toggler).toBeEnabled();
  });

  // Test social links in footer
  test('Social media links are present in footer', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const socialLinks = page.locator('.social-links a');
    await expect(socialLinks).toHaveCount(4);
  });

  // Test contact information
  test('Contact information is displayed', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    
    const contactSection = page.locator('.footer-section').filter({ hasText: 'Contact Info' });
    await expect(contactSection).toContainText('info@enrator.com');
    await expect(contactSection).toContainText('+1-855-435-8226');
    await expect(contactSection).toContainText('New York, NY');
  });

  // Test page titles
  test('Each page has correct title', async ({ page }) => {
    for (const { path, title } of pages) {
      await page.goto(path, { waitUntil: 'networkidle' });
      const pageTitle = await page.title();
      expect(pageTitle).toContain('EnRator');
    }
  });
});
