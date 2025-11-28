import React from 'react';
import LegalPageLayout from '../components/common/LegalPageLayout';

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      title="Accessibility Statement"
      description="Last Updated: September 18, 2025"
    >
      <h2>1. Commitment</h2>
      <p>TradeZella is committed to ensuring digital accessibility for all users, including people with disabilities. We aim to meet WCAG 2.2 AA standards.</p>

      <h2>2. Measures We Implement</h2>
      <ul>
        <li>Semantic HTML and ARIA roles</li>
        <li>Keyboard-friendly navigation</li>
        <li>Screen reader compatibility</li>
        <li>High-contrast UI options</li>
        <li>Image alt-text support</li>
        <li>Logical tab order</li>
        <li>Responsive layout across devices</li>
      </ul>

      <h2>3. Ongoing Improvements</h2>
      <p>We perform:</p>
      <ul>
        <li>Regular accessibility audits</li>
        <li>Automated and manual testing</li>
        <li>Continuous design improvements</li>
      </ul>

      <h2>4. Known Limitations</h2>
      <p>Some third-party components may not be fully optimized. We are actively improving them.</p>

      <h2>5. Feedback</h2>
      <p>If you experience accessibility barriers, contact us:<br />
      📩 accessibility@tradezella.com</p>
      <p>We aim to respond within 48 hours.</p>

      <h2>6. Enforcement</h2>
      <p>We comply with applicable digital accessibility guidelines and global WCAG standards.</p>
    </LegalPageLayout>
  );
}