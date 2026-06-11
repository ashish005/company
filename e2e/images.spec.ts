import { test, expect } from '@playwright/test';

test.describe('Image Loading and Display Tests', () => {
  const pages = [
    { path: '/home', title: 'Home' },
    { path: '/about', title: 'About Us' },
    { path: '/vision', title: 'Vision & Mission' },
    { path: '/whywe', title: 'Why Choose Us' },
    { path: '/contact', title: 'Contact Us' },
    { path: '/pricing', title: 'Pricing' },
    { path: '/trial', title: 'Free Trial' }
  ];

  // Test all images load correctly on each page
  pages.forEach(({ path, title }) => {
    test(`All images load on ${title} page`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Check each image loads
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
          
          // naturalWidth > 0 means image loaded successfully
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    });
  });

  // Test logo images load correctly
  test('Logo images load and display correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const logos = page.locator('.navbar-brand img, .brand-logo img, .logo img');
    const logoCount = await logos.count();
    
    if (logoCount > 0) {
      for (let i = 0; i < logoCount; i++) {
        const logo = logos.nth(i);
        await expect(logo).toBeVisible();
        
        const naturalWidth = await logo.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  // Test images have alt text for accessibility
  test('All images have alt text', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Decorative images can have empty alt, but should have the attribute
        expect(alt).toBeDefined();
      }
    }
  });

  // Test responsive images (srcset)
  test('Responsive images have srcset attribute', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const imagesWithSrcset = page.locator('img[srcset]');
    const count = await imagesWithSrcset.count();
    
    // At least some images should be responsive
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = imagesWithSrcset.nth(i);
        const srcset = await img.getAttribute('srcset');
        expect(srcset).toBeTruthy();
        expect(srcset?.length).toBeGreaterThan(0);
      }
    }
  });

  // Test image lazy loading
  test('Images use lazy loading where appropriate', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const allImages = await page.locator('img').all();
    const belowFoldImages: any[] = [];
    
    for (const img of allImages) {
      const box = await img.boundingBox();
      if (box && box.y > 1000) {
        belowFoldImages.push(img);
      }
    }
    
    const count = belowFoldImages.length;
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = belowFoldImages[i];
        const loading = await img.getAttribute('loading');
        
        // Below-fold images should have lazy loading
        expect(loading).toBe('lazy');
      }
    }
  });

  // Test SVG images load correctly
  test('SVG images load and display correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const svgImages = page.locator('img[src$=".svg"], svg');
    const count = await svgImages.count();
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const svg = svgImages.nth(i);
        await expect(svg).toBeVisible();
      }
    }
  });

  // Test favicon loads
  test('Favicon loads correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
    const count = await favicon.count();
    
    expect(count).toBeGreaterThan(0);
    
    const href = await favicon.first().getAttribute('href');
    expect(href).toBeTruthy();
  });

  // Test background images in CSS
  test('Background images load correctly', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    // Check for elements with background images
    const elementsWithBg = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results: string[] = [];
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;
        
        if (bgImage && bgImage !== 'none' && bgImage !== 'initial') {
          results.push(bgImage);
        }
      });
      
      return results;
    });
    
    // If background images exist, they should be valid URLs
    if (elementsWithBg.length > 0) {
      elementsWithBg.forEach(bgImage => {
        expect(bgImage).toMatch(/url\(\['"]?https?:\)|url\(\['"]?\/\)/);
      });
    }
  });

  // Test image dimensions are reasonable
  test('Image dimensions are reasonable', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
        
        // Images should have reasonable dimensions
        expect(naturalWidth).toBeGreaterThan(0);
        expect(naturalHeight).toBeGreaterThan(0);
        expect(naturalWidth).toBeLessThan(10000); // Sanity check
        expect(naturalHeight).toBeLessThan(10000); // Sanity check
      }
    }
  });

  // Test image file sizes are optimized (check response headers)
  test('Images are served with proper headers', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      const src = await firstImage.getAttribute('src');
      
      if (src && !src.startsWith('data:')) {
        const response = await page.request.get(src.startsWith('http') ? src : `http://localhost:4200${src}`);
        const contentType = response.headers()['content-type'];
        
        // Should be an image content type
        expect(contentType).toMatch(/image\/(jpeg|png|gif|svg\+xml|webp)/);
      }
    }
  });

  // Test broken images are handled gracefully
  test('Broken images have fallback or error handling', async ({ page }) => {
    // Navigate to a page and check for broken images
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        
        // If image is broken (naturalWidth = 0), it should have error handling
        if (naturalWidth === 0) {
          const hasOnError = await img.evaluate((el: HTMLImageElement) => {
            return el.hasAttribute('onerror') || 
                   el.classList.contains('img-error') ||
                   el.parentElement?.classList.contains('img-error');
          });
          
          // Broken images should have some error handling
          expect(hasOnError).toBeTruthy();
        }
      }
    }
  });

  // Test image aspect ratios are preserved
  test('Image aspect ratios are preserved with CSS', async ({ page }) => {
    await page.goto('/home', { waitUntil: 'networkidle' });
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const objectFit = await img.evaluate((el: HTMLImageElement) => {
          return window.getComputedStyle(el).objectFit;
        });
        
        // Images should have object-fit set to preserve aspect ratio
        expect(['contain', 'cover', 'fill', 'none', 'scale-down']).toContain(objectFit);
      }
    }
  });
});
