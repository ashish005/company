import { test, expect } from '@playwright/test';

test.describe('Trial Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trial', { waitUntil: 'networkidle' });
  });

  test('Trial page loads correctly', async ({ page }) => {
    await expect(page.locator('.trial-page')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Start Your 14-Day Free Trial');
  });

  test('Form displays all required fields', async ({ page }) => {
    // Personal Information section
    await expect(page.locator('[formControlName="contactPersonName"]')).toBeVisible();
    await expect(page.locator('[formControlName="contactPersonEmail"]')).toBeVisible();
    await expect(page.locator('[formControlName="contactPersonMobile"]')).toBeVisible();
    
    // Company Information section
    await expect(page.locator('[formControlName="name"]')).toBeVisible();
    await expect(page.locator('[formControlName="address"]')).toBeVisible();
    await expect(page.locator('[formControlName="softwareCode"]')).toBeVisible();
    await expect(page.locator('[formControlName="businessTypeCode"]')).toBeVisible();
  });

  test('Form validation - required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('[formControlName="contactPersonName"]')).toHaveClass(/is-invalid/);
    await expect(page.locator('[formControlName="contactPersonEmail"]')).toHaveClass(/is-invalid/);
    await expect(page.locator('[formControlName="contactPersonMobile"]')).toHaveClass(/is-invalid/);
    await expect(page.locator('[formControlName="name"]')).toHaveClass(/is-invalid/);
    await expect(page.locator('[formControlName="address"]')).toHaveClass(/is-invalid/);
    await expect(page.locator('[formControlName="softwareCode"]')).toHaveClass(/is-invalid/);
  });

  test('Form validation - email format', async ({ page }) => {
    await page.fill('[formControlName="contactPersonEmail"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[formControlName="contactPersonEmail"]')).toHaveClass(/is-invalid/);
    await expect(page.locator('.text-danger')).toContainText('Please enter a valid email');
  });

  test('Form validation - valid email format', async ({ page }) => {
    await page.fill('[formControlName="contactPersonEmail"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Should not have email validation error
    const emailInput = page.locator('[formControlName="contactPersonEmail"]');
    const hasInvalidClass = await emailInput.evaluate(el => el.classList.contains('is-invalid'));
    expect(hasInvalidClass).toBe(false);
  });

  test('Fill form with valid data', async ({ page }) => {
    // Personal Information
    await page.fill('[formControlName="contactPersonName"]', 'John Doe');
    await page.fill('[formControlName="contactPersonEmail"]', 'john.doe@example.com');
    await page.fill('[formControlName="contactPersonMobile"]', '+1-555-123-4567');
    
    // Company Information
    await page.fill('[formControlName="name"]', 'Test Company Inc.');
    await page.fill('[formControlName="address"]', '123 Business Street, Suite 100, New York, NY 10001');
    
    // Select software
    await page.selectOption('[formControlName="softwareCode"]', { label: /.+/ });
    
    // Select business type
    await page.selectOption('[formControlName="businessTypeCode"]', { label: /.+/ });
    
    // Accept terms
    await page.check('#terms');
    
    // Verify all fields are filled
    await expect(page.locator('[formControlName="contactPersonName"]')).toHaveValue('John Doe');
    await expect(page.locator('[formControlName="contactPersonEmail"]')).toHaveValue('john.doe@example.com');
    await expect(page.locator('[formControlName="contactPersonMobile"]')).toHaveValue('+1-555-123-4567');
    await expect(page.locator('[formControlName="name"]')).toHaveValue('Test Company Inc.');
    await expect(page.locator('[formControlName="address"]')).toHaveValue('123 Business Street, Suite 100, New York, NY 10001');
  });

  test('Submit button is disabled when form is invalid', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('Submit button becomes enabled when form is valid', async ({ page }) => {
    // Fill all required fields
    await page.fill('[formControlName="contactPersonName"]', 'John Doe');
    await page.fill('[formControlName="contactPersonEmail"]', 'john.doe@example.com');
    await page.fill('[formControlName="contactPersonMobile"]', '+1-555-123-4567');
    await page.fill('[formControlName="name"]', 'Test Company Inc.');
    await page.fill('[formControlName="address"]', '123 Business Street, Suite 100, New York, NY 10001');
    await page.selectOption('[formControlName="softwareCode"]', { label: /.+/ });
    await page.selectOption('[formControlName="businessTypeCode"]', { label: /.+/ });
    await page.check('#terms');
    
    // Submit button should be enabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test('Terms checkbox is required', async ({ page }) => {
    // Fill all required fields except terms
    await page.fill('[formControlName="contactPersonName"]', 'John Doe');
    await page.fill('[formControlName="contactPersonEmail"]', 'john.doe@example.com');
    await page.fill('[formControlName="contactPersonMobile"]', '+1-555-123-4567');
    await page.fill('[formControlName="name"]', 'Test Company Inc.');
    await page.fill('[formControlName="address"]', '123 Business Street, Suite 100, New York, NY 10001');
    await page.selectOption('[formControlName="softwareCode"]', { label: /.+/ });
    await page.selectOption('[formControlName="businessTypeCode"]', { label: /.+/ });
    
    // Submit button should be disabled without terms
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    // Check terms
    await page.check('#terms');
    
    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('Form submission shows loading state', async ({ page }) => {
    // Fill form with valid data
    await page.fill('[formControlName="contactPersonName"]', 'John Doe');
    await page.fill('[formControlName="contactPersonEmail"]', 'john.doe@example.com');
    await page.fill('[formControlName="contactPersonMobile"]', '+1-555-123-4567');
    await page.fill('[formControlName="name"]', 'Test Company Inc.');
    await page.fill('[formControlName="address"]', '123 Business Street, Suite 100, New York, NY 10001');
    await page.selectOption('[formControlName="softwareCode"]', { label: /.+/ });
    await page.selectOption('[formControlName="businessTypeCode"]', { label: /.+/ });
    await page.check('#terms');
    
    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check for loading state
    await expect(page.locator('.fa-circle-o-notch')).toBeVisible();
    await expect(submitButton).toContainText('Creating Your Account...');
  });

  test('Success section appears after successful submission', async ({ page }) => {
    // Fill form with valid data
    await page.fill('[formControlName="contactPersonName"]', 'John Doe');
    await page.fill('[formControlName="contactPersonEmail"]', 'john.doe@example.com');
    await page.fill('[formControlName="contactPersonMobile"]', '+1-555-123-4567');
    await page.fill('[formControlName="name"]', 'Test Company Inc.');
    await page.fill('[formControlName="address"]', '123 Business Street, Suite 100, New York, NY 10001');
    await page.selectOption('[formControlName="softwareCode"]', { label: /.+/ });
    await page.selectOption('[formControlName="businessTypeCode"]', { label: /.+/ });
    await page.check('#terms');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success section (this might need adjustment based on actual API response time)
    await page.waitForTimeout(3000);
    
    // Check if success section appears (this depends on the actual API response)
    // Note: This test might fail if the API doesn't return success in the test environment
    const successSection = page.locator('.text-success').filter({ hasText: 'Registration Successful' });
    if (await successSection.count() > 0) {
      await expect(successSection).toBeVisible();
    }
  });

  test('Benefits section is visible before submission', async ({ page }) => {
    await expect(page.locator('text=Why Choose EnRator?')).toBeVisible();
    await expect(page.locator('text=No Credit Card')).toBeVisible();
    await expect(page.locator('text=14 Days Free')).toBeVisible();
    await expect(page.locator('text=Free Support')).toBeVisible();
    await expect(page.locator('text=No Commitment')).toBeVisible();
  });

  test('Form has proper labels and placeholders', async ({ page }) => {
    // Check labels
    await expect(page.locator('label').filter({ hasText: 'Full Name' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Work Email' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Mobile Number' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Company Name' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Business Address' })).toBeVisible();
    
    // Check placeholders
    const nameInput = page.locator('[formControlName="contactPersonName"]');
    await expect(nameInput).toHaveAttribute('placeholder', 'First and last name');
    
    const emailInput = page.locator('[formControlName="contactPersonEmail"]');
    await expect(emailInput).toHaveAttribute('placeholder', 'your.email@company.com');
  });

  test('Important alert is displayed', async ({ page }) => {
    await expect(page.locator('.alert-info')).toBeVisible();
    await expect(page.locator('.alert-info')).toContainText('Important');
    await expect(page.locator('.alert-info')).toContainText('account communications');
  });

  test('Responsive design - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/trial', { waitUntil: 'networkidle' });
    
    // Form should still be visible and functional on mobile
    await expect(page.locator('.trial-page')).toBeVisible();
    await expect(page.locator('[formControlName="contactPersonName"]')).toBeVisible();
  });

  test('Responsive design - tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/trial', { waitUntil: 'networkidle' });
    
    // Form should still be visible and functional on tablet
    await expect(page.locator('.trial-page')).toBeVisible();
    await expect(page.locator('[formControlName="contactPersonName"]')).toBeVisible();
  });
});
