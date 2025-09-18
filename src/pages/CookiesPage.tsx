import React from 'react';
import LegalPageLayout from '../components/common/LegalPageLayout';

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="Last updated: September 18, 2025"
    >
      <p>
        This Cookie Policy explains how TradeZella uses cookies and similar technologies to recognize you when you visit our websites. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        A cookie is a small file containing a string of characters that is sent to your computer when you visit a website. When you visit the site again, the cookie allows that site to recognize your browser.
      </p>

      <h2>2. Why do we use cookies?</h2>
      <p>
        We use cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
      </p>

      <h2>3. How can I control cookies?</h2>
      <p>
        You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject.
      </p>

      <h2>4. Changes to this Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
      </p>

      <h2>5. Where can I get further information?</h2>
      <p>
        If you have any questions about our use of cookies or other technologies, please email us at support@tradezella.com.
      </p>
    </LegalPageLayout>
  );
}
