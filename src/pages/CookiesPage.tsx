import React from 'react';
import LegalPageLayout from '../components/common/LegalPageLayout';

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="Last Updated: September 18, 2025"
    >
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device to improve functionality, performance, and personalization.</p>

      <h2>2. Types of Cookies We Use</h2>
      <h3>a) Essential Cookies</h3>
      <p>Required for the site to function (authentication, security, navigation).</p>

      <h3>b) Performance Cookies</h3>
      <p>Collect anonymous data on how users interact with our platform.</p>

      <h3>c) Functional Cookies</h3>
      <p>Remember user preferences such as language and settings.</p>

      <h3>d) Advertising & Tracking Cookies</h3>
      <p>Used for personalized ads and marketing.</p>

      <h2>3. Third-Party Cookies</h2>
      <p>We use cookies from:</p>
      <ul>
        <li>Google Analytics</li>
        <li>Facebook Pixel</li>
        <li>Payment providers</li>
        <li>Marketing platforms</li>
      </ul>

      <h2>4. How to Control Cookies</h2>
      <p>You may:</p>
      <ul>
        <li>Adjust browser settings</li>
        <li>Disable certain cookies</li>
        <li>Withdraw consent from the cookie banner</li>
      </ul>
      <p>Note: Blocking cookies may impact functionality.</p>

      <h2>5. Contact</h2>
      <p>For cookie concerns: cookies@tradezella.com</p>
    </LegalPageLayout>
  );
}