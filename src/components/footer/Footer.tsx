import React from 'react';
    import FooterBrand from './FooterBrand';
    import FooterSocial from './FooterSocial';
    import FooterNewsletter from './FooterNewsletter';
    import FooterLinkColumn from './FooterLinkColumn';
    import FooterBottom from './FooterBottom';
    import { footerLinks } from './data/footerLinks';
    
    export default function Footer() {
      return (
        <footer className="bg-navy-900 py-16" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12">
              {/* Main Footer Content */}
              <div className="grid gap-12 lg:grid-cols-5">
                {/* Brand Section */}
                <div className="lg:col-span-2 space-y-8">
                  <FooterBrand />
                  <FooterNewsletter />
                  <FooterSocial />
                </div>
    
                {/* Link Columns */}
                <nav className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8" aria-label="Footer Navigation">
                  {footerLinks.map((group) => (
                    <FooterLinkColumn key={group.title} {...group} />
                  ))}
                </nav>
              </div>
    
              {/* Bottom Section */}
              <FooterBottom />
            </div>
          </div>
        </footer>
      );
    }
