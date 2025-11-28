import React from 'react';
import LegalPageLayout from '../components/common/LegalPageLayout';

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="Last Updated: September 18, 2025"
    >
      <h2>1. Introduction</h2>
      <p>TradeZella ("we", "our", "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data.</p>

      <h2>2. Information We Collect</h2>
      <h3>a) Information You Provide</h3>
      <ul>
        <li>Name, email, phone number</li>
        <li>Account login details</li>
        <li>Billing and payment information</li>
        <li>Customer support messages</li>
      </ul>

      <h3>b) Automatically Collected</h3>
      <ul>
        <li>IP address</li>
        <li>Device information</li>
        <li>Browser type</li>
        <li>Usage patterns</li>
        <li>Cookies and tracking identifiers</li>
      </ul>

      <h3>c) Third-Party Data</h3>
      <ul>
        <li>Payment processors</li>
        <li>Authentication providers</li>
        <li>Analytics tools</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use your data to:</p>
      <ul>
        <li>Operate and secure the platform</li>
        <li>Process bookings and payments</li>
        <li>Improve performance and user experience</li>
        <li>Provide customer support</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>4. Legal Basis (GDPR)</h2>
      <p>We process your data under:</p>
      <ul>
        <li>Contractual necessity</li>
        <li>Legitimate interest</li>
        <li>Consent</li>
        <li>Legal requirement</li>
      </ul>

      <h2>5. How We Share Your Information</h2>
      <p>We share data only with trusted partners:</p>
      <ul>
        <li>Payment gateways</li>
        <li>Cloud hosting providers</li>
        <li>Analytics vendors</li>
        <li>Customer support tools</li>
      </ul>
      <p>We do not sell your personal data.</p>

      <h2>6. Data Retention</h2>
      <p>We retain data only as long as necessary to fulfill the purposes outlined in this policy.</p>

      <h2>7. Your Rights</h2>
      <p>Depending on your location, you may have rights to:</p>
      <ul>
        <li>Access your data</li>
        <li>Correct your data</li>
        <li>Delete your data</li>
        <li>Export your data</li>
        <li>Object to processing</li>
        <li>Withdraw consent</li>
      </ul>
      <p>Email: privacy@tradezella.com</p>

      <h2>8. Data Security</h2>
      <p>We use encryption, secure servers, access controls, and monitoring to protect your information.</p>

      <h2>9. International Transfers</h2>
      <p>Your data may be stored or processed outside your country. Safeguards are applied to ensure lawful transfers.</p>

      <h2>10. Updates</h2>
      <p>We may update this policy periodically. The new version will be posted on this page.</p>
    </LegalPageLayout>
  );
}