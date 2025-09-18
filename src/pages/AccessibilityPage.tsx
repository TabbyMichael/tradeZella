import React from 'react';
import LegalPageLayout from '../components/common/LegalPageLayout';

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      title="Accessibility Statement"
      description="Last updated: September 18, 2025"
    >
      <p>
        TradeZella is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
      </p>

      <h2>1. Measures to support accessibility</h2>
      <p>
        TradeZella takes the following measures to ensure accessibility of our platform:
      </p>
      <ul>
        <li>Include accessibility as part of our mission statement.</li>
        <li>Integrate accessibility into our procurement practices.</li>
        <li>Provide continual accessibility training for our staff.</li>
        <li>Assign clear accessibility targets and responsibilities.</li>
      </ul>

      <h2>2. Conformance status</h2>
      <p>
        The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. TradeZella is partially conformant with WCAG 2.1 level AA.
      </p>

      <h2>3. Feedback</h2>
      <p>
        We welcome your feedback on the accessibility of TradeZella. Please let us know if you encounter accessibility barriers on our platform:
      </p>
      <ul>
        <li>E-mail: support@tradezella.com</li>
        <li>Postal address: 123 Main Street, San Francisco, CA 94105</li>
      </ul>

      <h2>4. Technical specifications</h2>
      <p>
        Accessibility of TradeZella relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
      </p>
      <ul>
        <li>HTML</li>
        <li>WAI-ARIA</li>
        <li>CSS</li>
        <li>JavaScript</li>
      </ul>

      <h2>5. Assessment approach</h2>
      <p>
        TradeZella assessed the accessibility of our platform by the following approaches:
      </p>
      <ul>
        <li>Self-evaluation</li>
        <li>External evaluation</li>
      </ul>
    </LegalPageLayout>
  );
}
