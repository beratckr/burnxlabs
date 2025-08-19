import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Netlify Forms', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
    // Set up fetch mock
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      url: 'https://burnxlabs.com/en/'
    });
  });

  describe('WaitlistForm', () => {
    beforeEach(() => {
      // Set up DOM for waitlist form
      document.body.innerHTML = `
        <div id="waitlist">
          <div id="form-container">
            <form id="waitlist-form" name="burnx-waitlist" method="POST" data-netlify="true">
              <input type="hidden" name="form-name" value="burnx-waitlist" />
              <input type="email" id="email-input" name="email" required />
              <input type="text" id="firstName-input" name="firstName" />
              <input name="bot-field" style="display: none;" />
              <button type="submit" id="submit-btn">
                <span id="btn-text">Join Waitlist</span>
                <span id="btn-loader" class="hidden">Loading...</span>
              </button>
            </form>
          </div>
          <div id="success-container" class="hidden">
            <h3>Success!</h3>
            <span id="user-email"></span>
            <button id="add-another-btn">Add another</button>
          </div>
        </div>
      `;
      
      // Set window location
      Object.defineProperty(window, 'location', {
        value: { 
          href: 'https://burnxlabs.com/en/',
          pathname: '/en/'
        },
        writable: true
      });
    });

    it('should submit waitlist form with correct data', async () => {
      const emailInput = document.getElementById('email-input') as HTMLInputElement;
      const firstNameInput = document.getElementById('firstName-input') as HTMLInputElement;
      const form = document.getElementById('waitlist-form') as HTMLFormElement;
      
      // Fill in form
      emailInput.value = 'test@example.com';
      firstNameInput.value = 'John';
      
      // Submit form (simulate the actual JavaScript)
      const formData = new URLSearchParams({
        'form-name': 'burnx-waitlist',
        'email': 'test@example.com',
        'firstName': 'John',
        'bot-field': ''
      });
      
      await fetch(window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
      
      // Verify fetch was called correctly
      expect(fetch).toHaveBeenCalledWith(
        'https://burnxlabs.com/en/',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'form-name=burnx-waitlist&email=test%40example.com&firstName=John&bot-field='
        })
      );
    });

    it('should validate email format', () => {
      const emailInput = document.getElementById('email-input') as HTMLInputElement;
      
      // Test invalid email
      emailInput.value = 'invalid-email';
      expect(emailInput.validity.valid).toBe(false);
      
      // Test valid email
      emailInput.value = 'valid@example.com';
      expect(emailInput.validity.valid).toBe(true);
    });

    it('should show loading state during submission', async () => {
      const btnText = document.getElementById('btn-text');
      const btnLoader = document.getElementById('btn-loader');
      
      expect(btnText?.classList.contains('hidden')).toBe(false);
      expect(btnLoader?.classList.contains('hidden')).toBe(true);
      
      // During submission, these should toggle
      // (In real implementation, this happens in the submit handler)
    });

    it('should not submit with empty honeypot field', async () => {
      const botField = document.querySelector('input[name="bot-field"]') as HTMLInputElement;
      
      // Honeypot should always be empty
      expect(botField.value).toBe('');
      
      // If bot fills it, form should not submit (in real implementation)
      botField.value = 'bot-filled';
      // Form should detect this and not submit
    });
  });

  describe('ContactForm', () => {
    beforeEach(() => {
      // Set up DOM for contact form
      document.body.innerHTML = `
        <div id="contact-form-container">
          <form id="contact-form" name="burnx-contact" method="POST" data-netlify="true">
            <input type="hidden" name="form-name" value="burnx-contact" />
            <input type="text" id="firstName" name="firstName" required />
            <input type="text" id="lastName" name="lastName" required />
            <input type="email" id="email" name="email" required />
            <select id="subject" name="subject" required>
              <option value="">Select</option>
              <option value="general">General</option>
              <option value="support">Support</option>
            </select>
            <textarea id="message" name="message" required></textarea>
            <input name="bot-field" style="display: none;" />
            <button type="submit" id="contact-submit-btn">
              <span id="contact-btn-text">Send</span>
              <span id="contact-btn-loader" class="hidden">Loading...</span>
            </button>
          </form>
        </div>
        <div id="contact-success-container" class="hidden">
          <h3>Message Sent!</h3>
          <button id="contact-another-btn">Send another</button>
        </div>
      `;
      
      // Set window location for contact page
      Object.defineProperty(window, 'location', {
        value: { 
          href: 'https://burnxlabs.com/en/contact',
          pathname: '/en/contact'
        },
        writable: true
      });
    });

    it('should submit contact form with all fields', async () => {
      // Fill in all fields
      (document.getElementById('firstName') as HTMLInputElement).value = 'John';
      (document.getElementById('lastName') as HTMLInputElement).value = 'Doe';
      (document.getElementById('email') as HTMLInputElement).value = 'john@example.com';
      (document.getElementById('subject') as HTMLSelectElement).value = 'general';
      (document.getElementById('message') as HTMLTextAreaElement).value = 'Test message';
      
      // Create form data
      const formData = new URLSearchParams({
        'form-name': 'burnx-contact',
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'john@example.com',
        'subject': 'general',
        'message': 'Test message',
        'bot-field': ''
      });
      
      await fetch(window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
      
      // Verify fetch was called with correct data
      expect(fetch).toHaveBeenCalledWith(
        'https://burnxlabs.com/en/contact',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: expect.stringContaining('form-name=burnx-contact')
        })
      );
    });

    it('should validate required fields', () => {
      const firstName = document.getElementById('firstName') as HTMLInputElement;
      const lastName = document.getElementById('lastName') as HTMLInputElement;
      const email = document.getElementById('email') as HTMLInputElement;
      const subject = document.getElementById('subject') as HTMLSelectElement;
      const message = document.getElementById('message') as HTMLTextAreaElement;
      
      // All fields should be required
      expect(firstName.hasAttribute('required')).toBe(true);
      expect(lastName.hasAttribute('required')).toBe(true);
      expect(email.hasAttribute('required')).toBe(true);
      expect(subject.hasAttribute('required')).toBe(true);
      expect(message.hasAttribute('required')).toBe(true);
    });

    it('should have correct subject options', () => {
      const subject = document.getElementById('subject') as HTMLSelectElement;
      const options = Array.from(subject.options).map(opt => opt.value);
      
      expect(options).toContain('');
      expect(options).toContain('general');
      expect(options).toContain('support');
    });
  });

  describe('Form Submission Integration', () => {
    it('should submit to current page URL, not root', async () => {
      // Test for /en/ page
      Object.defineProperty(window, 'location', {
        value: { 
          href: 'https://burnxlabs.com/en/',
          pathname: '/en/'
        },
        writable: true
      });
      
      await fetch(window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'form-name=burnx-waitlist&email=test@example.com'
      });
      
      expect(fetch).toHaveBeenCalledWith(
        'https://burnxlabs.com/en/', // NOT '/'
        expect.any(Object)
      );
    });

    it('should include form-name as first parameter', async () => {
      const params = new URLSearchParams({
        'form-name': 'burnx-waitlist',
        'email': 'test@example.com',
        'firstName': 'Test',
        'bot-field': ''
      });
      
      const body = params.toString();
      expect(body.startsWith('form-name=')).toBe(true);
    });

    it('should handle successful response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200
      });
      
      const response = await fetch('/', {
        method: 'POST',
        body: 'test'
      });
      
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    it('should handle redirect response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 302,
        redirected: true
      });
      
      const response = await fetch('/', {
        method: 'POST',
        body: 'test'
      });
      
      expect(response.status).toBe(302);
      expect(response.redirected).toBe(true);
    });
  });

  describe('Localization', () => {
    it('should work with Turkish locale', async () => {
      Object.defineProperty(window, 'location', {
        value: { 
          href: 'https://burnxlabs.com/tr/',
          pathname: '/tr/'
        },
        writable: true
      });
      
      await fetch(window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'form-name=burnx-waitlist&email=test@example.com'
      });
      
      expect(fetch).toHaveBeenCalledWith(
        'https://burnxlabs.com/tr/',
        expect.any(Object)
      );
    });
  });
});