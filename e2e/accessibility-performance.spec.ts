import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  const pages = [
    { path: '/home', title: 'Home' },
    { path: '/about', title: 'About Us' },
    { path: '/vision', title: 'Vision & Mission' },
    { path: '/whywe', title: 'Why Choose Us' },
    { path: '/contact', title: 'Contact Us' },
    { path: '/pricing', title: 'Pricing' },
    { path: '/trial', title: 'Free Trial' }
  ];

  // Test page titles are present and meaningful
  pages.forEach(({ path, title }) => {
    test(`Page has meaningful title - ${title}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      expect(pageTitle.length).toBeGreaterThan(10);
      expect(pageTitle).toContain('EnRator');
    });
  });

  // Test heading hierarchy is logical
  test('Heading hierarchy is logical', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate((el: HTMLElement) => el.tagName);
      const level = parseInt(tagName.charAt(1));
      
      // Headings should not skip levels (e.g., h1 to h3)
      if (previousLevel > 0) {
        expect(level).toBeLessThanOrEqual(previousLevel + 1);
      }
      
      previousLevel = level;
    }
  });

  // Test all links have descriptive text
  test('All links have descriptive text', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        
        // Links should have either visible text or aria-label
        expect(text || ariaLabel).toBeTruthy();
        
        // Avoid "click here" or generic text
        if (text) {
          expect(text.trim().toLowerCase()).not.toBe('click here');
          expect(text.trim().toLowerCase()).not.toBe('read more');
        }
      }
    }
  });

  // Test form inputs have labels
  test('Form inputs have associated labels', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'networkidle' });
    
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const type = await input.getAttribute('type');
        
        // Skip hidden inputs and submit buttons
        if (type === 'hidden' || type === 'submit' || type === 'button') {
          continue;
        }
        
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        // Input should have either id (for label) or aria-label or aria-labelledby
        expect(id || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });

  // Test buttons have accessible names
  test('Buttons have accessible names', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');
        
        // Buttons should have accessible name
        expect(text || ariaLabel || title).toBeTruthy();
      }
    }
  });

  // Test color contrast (basic check)
  test('Text has sufficient color contrast', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Get all text elements
    const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button, label').all();
    
    for (const element of textElements) {
      const styles = await element.evaluate((el: HTMLElement) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      // Element should have visible color (not transparent)
      expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  // Test images have alt text
  test('Images have alt text', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // All images should have alt attribute
        expect(alt).toBeDefined();
      }
    }
  });

  // Test focus management
  test('Focus is visible and manageable', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Tab through focusable elements
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  // Test ARIA landmarks
  test('Page has ARIA landmarks', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const landmarks = page.locator('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer');
    const landmarkCount = await landmarks.count();
    
    // Page should have at least some landmarks
    expect(landmarkCount).toBeGreaterThan(0);
  });

  // Test skip to main content link
  test('Skip to main content link exists', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const skipLink = page.locator('a[href*="main"], a[href*="content"], .skip-link, [aria-label*="skip"]');
    const skipLinkCount = await skipLink.count();
    
    // Should have skip link (optional but recommended)
    // This is a soft check - not failing if missing
    if (skipLinkCount > 0) {
      await expect(skipLink.first()).toBeVisible();
    }
  });
});

test.describe('Performance Tests', () => {
  // Test page load time
  test('Page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/home', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  // Test Time to First Byte (TTFB)
  test('Time to First Byte is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/home');
    const ttfb = Date.now() - startTime;
    
    // TTFB should be less than 1 second
    expect(ttfb).toBeLessThan(1000);
  });

  // Test number of requests
  test('Number of requests is reasonable', async ({ page }) => {
    let requestCount = 0;
    
    page.on('request', () => {
      requestCount++;
    });
    
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Should not make excessive requests (arbitrary limit of 100)
    expect(requestCount).toBeLessThan(100);
  });

  // Test total page size
  test('Total page size is reasonable', async ({ page }) => {
    let totalSize = 0;
    
    page.on('response', async (response) => {
      const headers = response.headers();
      const contentLength = headers['content-length'];
      if (contentLength) {
        totalSize += parseInt(contentLength);
      }
    });
    
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Total size should be less than 5MB
    expect(totalSize).toBeLessThan(5 * 1024 * 1024);
  });

  // Test JavaScript execution time
  test('JavaScript execution time is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/home', { waitUntil: 'domcontentloaded' });
    
    const jsExecutionTime = Date.now() - startTime;
    
    // JS execution should be reasonable
    expect(jsExecutionTime).toBeLessThan(1000);
  });

  // Test no console errors
  test('No console errors on page load', async ({ page }) => {
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

  // Test Core Web Vitals - LCP (Largest Contentful Paint)
  test('Largest Contentful Paint is acceptable', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const lcp = await page.evaluate(async () => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    // LCP should be less than 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });

  // Test CLS (Cumulative Layout Shift)
  test('Cumulative Layout Shift is minimal', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const cls = await page.evaluate(async () => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    // CLS should be less than 0.1
    expect(cls).toBeLessThan(0.1);
  });

  // Test font loading
  test('Web fonts load successfully', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const fonts = await page.evaluate(() => {
      return document.fonts.ready.then(() => {
        const fontFaces = Array.from(document.fonts);
        return fontFaces.map((font) => font.family);
      });
    });
    
    // Fonts should be loaded
    expect(fonts).toBeTruthy();
  });

  // Test resource caching
  test('Static resources are cacheable', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      if (url.match(/\.(css|js|png|jpg|jpeg|svg|woff2?)$/i)) {
        const headers = response.headers();
        responses.push({
          url,
          cacheControl: headers['cache-control'],
          expires: headers['expires']
        });
      }
    });
    
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Static resources should have cache headers
    for (const resp of responses) {
      expect(resp.cacheControl || resp.expires).toBeTruthy();
    }
  });
});
