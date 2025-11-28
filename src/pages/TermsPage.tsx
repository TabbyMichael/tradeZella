import React from 'react';
import LegalPageLayout from '../components/common/LegalPageLayout';

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="Last Updated: September 18, 2025"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using TradeZella ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Platform.</p>

      <h2>2. Eligibility</h2>
      <p>You must be at least 18 years old and have the legal authority to enter into this agreement.</p>

      <h2>3. User Accounts</h2>
      <p>You are responsible for:</p>
      <ul>
        <li>Maintaining the confidentiality of your login credentials</li>
        <li>All activity under your account</li>
      </ul>
      <p>We may suspend or terminate accounts that violate these Terms.</p>

      <h2>4. Services Provided</h2>
      <p>TradeZella provides trading journal, community forum, and analytics services. We may modify or discontinue features at any time.</p>

      <h2>5. User Responsibilities</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the platform for unlawful activities</li>
        <li>Attempt to access restricted systems</li>
        <li>Upload harmful or misleading content</li>
        <li>Reverse-engineer any part of the platform</li>
      </ul>

      <h2>6. Payments & Fees</h2>
      <p>Prices, taxes, and payment terms are displayed at checkout. All charges are final unless stated otherwise.</p>

      <h2>7. Intellectual Property</h2>
      <p>All content, branding, design, and software belong to TradeZella. You may not copy, redistribute, or modify without written approval.</p>

      <h2>8. Third-Party Services</h2>
      <p>We may integrate with third-party services. Their terms govern your use of those services.</p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>The platform is provided "as-is" and "as available." We do not guarantee uninterrupted or error-free service.</p>

      <h2>10. Limitation of Liability</h2>
      <p>TradeZella is not liable for:</p>
      <ul>
        <li>Loss of revenue</li>
        <li>Loss of data</li>
        <li>Indirect or consequential damages</li>
      </ul>
      <p>Maximum liability = amount you paid to us within the last 12 months.</p>

      <h2>11. Termination</h2>
      <p>We may suspend or terminate your access for any violation of these Terms.</p>

      <h2>12. Governing Law</h2>
      <p>These Terms are governed by the laws of the State of California, without regard to conflict-of-law rules.</p>

      <h2>13. Contact</h2>
      <p>For questions:<br />
      📩 support@tradezella.com</p>
    </LegalPageLayout>
  );
}