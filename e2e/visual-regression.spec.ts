import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
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
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Large Desktop', width: 2560, height: 1440 }
  ];

  pages.forEach(({ path, title }) => {
    viewports.forEach(({ name, width, height }) => {
      test(`Visual regression - ${title} page on ${name} (${width}x${height})`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto(path, { waitUntil: 'networkidle' });
        
        // Wait for all images to load
        await page.waitForLoadState('networkidle');
        
        // Take full page screenshot
        await expect(page).toHaveScreenshot(`${title.replace(/\s+/g, '-')}-${name.toLowerCase()}-full.png`, {
          fullPage: true,
          maxDiffPixels: 100
        });
      });
    });
  });

  // Test hero section visual consistency
  test('Hero section visual consistency across pages', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const heroSection = page.locator('.hero-section, .banner-section, .main-hero').first();
    if (await heroSection.isVisible()) {
      await expect(heroSection).toHaveScreenshot('hero-section.png', {
        maxDiffPixels: 50
      });
    }
  });

  // Test footer visual consistency
  test('Footer visual consistency across pages', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const footer = page.locator('.app-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveScreenshot('footer.png', {
      maxDiffPixels: 50
    });
  });

  // Test navigation bar visual consistency
  test('Navigation bar visual consistency', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const navbar = page.locator('.app-header, .navbar');
    await expect(navbar).toBeVisible();
    await expect(navbar).toHaveScreenshot('navbar.png', {
      maxDiffPixels: 50
    });
  });

  // Test mobile menu visual state
  test('Mobile menu open state visual', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const toggler = page.locator('.navbar-toggler');
    if (await toggler.isVisible()) {
      await toggler.click();
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('mobile-menu-open.png', {
        maxDiffPixels: 100
      });
    }
  });

  // Test CTA buttons visual consistency
  test('CTA buttons visual consistency', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const ctaButton = page.locator('.btn-cta-primary, .btn-primary').first();
    if (await ctaButton.isVisible()) {
      await expect(ctaButton).toHaveScreenshot('cta-button.png', {
        maxDiffPixels: 30
      });
    }
  });

  // Test form elements visual consistency
  test('Contact form visual consistency', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    
    const contactForm = page.locator('form').first();
    if (await contactForm.isVisible()) {
      await expect(contactForm).toHaveScreenshot('contact-form.png', {
        maxDiffPixels: 50
      });
    }
  });

  // Test pricing cards visual consistency
  test('Pricing cards visual consistency', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'networkidle' });
    
    const pricingCards = page.locator('.pricing-card, .price-card').first();
    if (await pricingCards.isVisible()) {
      await expect(pricingCards).toHaveScreenshot('pricing-card.png', {
        maxDiffPixels: 50
      });
    }
  });

  // Test dark/light mode if applicable
  test('Theme consistency check', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Check if theme toggle exists
    const themeToggle = page.locator('[data-theme-toggle], .theme-toggle, .dark-mode-toggle');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot('dark-mode.png', {
        fullPage: true,
        maxDiffPixels: 100
      });
    }
  });
});
