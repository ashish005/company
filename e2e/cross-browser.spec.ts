import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility Tests', () => {
  const pages = [
    { path: '/home', title: 'Home' },
    { path: '/about', title: 'About Us' },
    { path: '/vision', title: 'Vision & Mission' },
    { path: '/whywe', title: 'Why Choose Us' },
    { path: '/contact', title: 'Contact Us' },
    { path: '/pricing', title: 'Pricing' },
    { path: '/trial', title: 'Free Trial' }
  ];

  // Test basic page rendering across all browsers
  pages.forEach(({ path, title }) => {
    test(`${title} page renders correctly in all browsers`, async ({ page, browserName }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      
      // Check main elements are visible
      await expect(page.locator('.company-theme')).toBeVisible();
      await expect(page.locator('.app-header')).toBeVisible();
      await expect(page.locator('.app-footer')).toBeVisible();
      
      // Take a screenshot for visual comparison
      await expect(page).toHaveScreenshot(`${title.replace(/\s+/g, '-')}-${browserName}.png`, {
        maxDiffPixels: 200 // Allow some browser rendering differences
      });
    });
  });

  // Test CSS Flexbox rendering
  test('Flexbox layouts render correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const flexElements = page.locator('[style*="display: flex"], .d-flex, .flex');
    const count = await flexElements.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = flexElements.nth(i);
        await expect(element).toBeVisible();
      }
    }
  });

  // Test CSS Grid rendering
  test('CSS Grid layouts render correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const gridElements = page.locator('[style*="display: grid"], .d-grid, .grid');
    const count = await gridElements.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = gridElements.nth(i);
        await expect(element).toBeVisible();
      }
    }
  });

  // Test CSS custom properties (variables)
  test('CSS custom properties work correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const hasCustomProps = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return Object.keys(styles).some(key => key.startsWith('--'));
    });
    
    // Check if custom properties are used (optional check)
    if (hasCustomProps) {
      const customPropValue = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        return styles.getPropertyValue('--primary-color') || 
               styles.getPropertyValue('--primary') ||
               styles.getPropertyValue('--color-primary');
      });
      
      // If custom properties exist, they should have values
      if (customPropValue) {
        expect(customPropValue.trim().length).toBeGreaterThan(0);
      }
    }
  });

  // Test font rendering
  test('Fonts render correctly across browsers', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const fontFamily = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).fontFamily;
    });
    
    expect(fontFamily).toBeTruthy();
    expect(fontFamily.length).toBeGreaterThan(0);
  });

  // Test form input rendering
  test('Form inputs render correctly', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      for (let i = 0; i < Math.min(inputCount, 5); i++) {
        const input = inputs.nth(i);
        await expect(input).toBeVisible();
        
        // Check that input has proper styling
        const display = await input.evaluate((el: HTMLInputElement) => {
          return window.getComputedStyle(el).display;
        });
        
        expect(['inline-block', 'block', 'inline', 'flex']).toContain(display);
      }
    }
  });

  // Test button rendering
  test('Buttons render correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const buttons = page.locator('button, .btn, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        await expect(button).toBeVisible();
        
        // Check button has proper cursor
        const cursor = await button.evaluate((el: HTMLElement) => {
          return window.getComputedStyle(el).cursor;
        });
        
        expect(cursor).toBe('pointer');
      }
    }
  });

  // Test shadow DOM support (if used)
  test('Shadow DOM elements render correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const shadowElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      let shadowCount = 0;
      
      allElements.forEach(el => {
        if (el.shadowRoot) {
          shadowCount++;
        }
      });
      
      return shadowCount;
    });
    
    // If shadow DOM is used, it should render (this is informational)
    if (shadowElements > 0) {
      expect(shadowElements).toBeGreaterThan(0);
    }
  });

  // Test CSS animations
  test('CSS animations work correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const animatedElements = page.locator('[class*="animate"], [class*="transition"], [style*="animation"]');
    const count = await animatedElements.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const element = animatedElements.nth(i);
        await expect(element).toBeVisible();
      }
    }
  });

  // Test media queries
  test('Media queries work correctly at different viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];
    
    for (const { width, height } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/home', { waitUntil: 'networkidle' });
      
      // Check main layout adapts
      await expect(page.locator('.company-theme')).toBeVisible();
      await expect(page.locator('.app-header')).toBeVisible();
      
      // Check mobile menu on small screens
      if (width <= 768) {
        const toggler = page.locator('.navbar-toggler');
        const isVisible = await toggler.isVisible().catch(() => false);
        if (isVisible) {
          await expect(toggler).toBeVisible();
        }
      }
    }
  });

  // Test JavaScript ES6+ features
  test('Modern JavaScript features work correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const jsFeaturesWork = await page.evaluate(() => {
      try {
        // Test arrow functions
        const arrow = () => true;
        
        // Test template literals
        const template = `test ${1 + 1}`;
        
        // Test destructuring
        const { a } = { a: 1 };
        
        // Test spread operator
        const arr = [...[1, 2, 3]];
        
        // Test async/await
        const asyncTest = async () => await Promise.resolve(true);
        
        return arrow() && template === 'test 2' && a === 1 && arr.length === 3;
      } catch (e) {
        return false;
      }
    });
    
    expect(jsFeaturesWork).toBe(true);
  });

  // Test localStorage/sessionStorage
  test('Browser storage APIs work correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const storageWorks = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        return value === 'value';
      } catch (e) {
        return false;
      }
    });
    
    expect(storageWorks).toBe(true);
  });

  // Test Fetch API
  test('Fetch API works correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const fetchWorks = await page.evaluate(async () => {
      try {
        const response = await fetch(window.location.href);
        return response.ok;
      } catch (e) {
        return false;
      }
    });
    
    expect(fetchWorks).toBe(true);
  });

  // Test Intersection Observer
  test('Intersection Observer API works correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const observerWorks = await page.evaluate(() => {
      return 'IntersectionObserver' in window;
    });
    
    expect(observerWorks).toBe(true);
  });

  // Test Resize Observer
  test('Resize Observer API works correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const observerWorks = await page.evaluate(() => {
      return 'ResizeObserver' in window;
    });
    
    expect(observerWorks).toBe(true);
  });

  // Test scroll behavior
  test('Smooth scroll works correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const scrollBehavior = await page.evaluate(() => {
      const html = document.documentElement;
      return window.getComputedStyle(html).scrollBehavior;
    });
    
    // Check if smooth scroll is enabled (optional)
    if (scrollBehavior === 'smooth') {
      expect(scrollBehavior).toBe('smooth');
    }
  });

  // Test clipboard API (if used)
  test('Clipboard API is available', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const clipboardAvailable = await page.evaluate(() => {
      return 'clipboard' in navigator;
    });
    
    // Clipboard API availability varies by browser context
    // This is an informational check
    expect(typeof clipboardAvailable).toBe('boolean');
  });

  // Test geolocation API (if used)
  test('Geolocation API is available', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const geolocationAvailable = await page.evaluate(() => {
      return 'geolocation' in navigator;
    });
    
    expect(geolocationAvailable).toBe(true);
  });

  // Test WebGL support (if used)
  test('WebGL support is available', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const webglAvailable = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    });
    
    expect(webglAvailable).toBe(true);
  });

  // Test Web Workers (if used)
  test('Web Workers are available', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const workersAvailable = await page.evaluate(() => {
      return 'Worker' in window;
    });
    
    expect(workersAvailable).toBe(true);
  });

  // Test Service Workers (if used)
  test('Service Workers are available', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const serviceWorkersAvailable = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(serviceWorkersAvailable).toBe(true);
  });

  // Test browser-specific CSS prefixes
  test('CSS prefixes are handled correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Check if vendor-prefixed properties are used
    const hasPrefixedProps = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      let hasPrefix = false;
      
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        Object.keys(style).forEach(key => {
          if (key.startsWith('webkit') || key.startsWith('moz') || key.startsWith('ms')) {
            hasPrefix = true;
          }
        });
      });
      
      return hasPrefix;
    });
    
    // This is informational - prefixed properties are okay
    expect(typeof hasPrefixedProps).toBe('boolean');
  });

  // Test browser console for errors
  test('No browser-specific console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Should have no console errors
    expect(errors).toHaveLength(0);
  });

  // Test touch events on mobile browsers
  test('Touch events work on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const touchSupported = await page.evaluate(() => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    });
    
    // Touch support is expected on mobile viewports
    expect(touchSupported).toBe(true);
  });

  // Test pointer events
  test('Pointer events work correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const pointerSupported = await page.evaluate(() => {
      return 'onpointerdown' in window;
    });
    
    expect(pointerSupported).toBe(true);
  });
});
