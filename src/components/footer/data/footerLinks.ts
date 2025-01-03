import { LinkGroup } from '../types';
    
    export const footerLinks: LinkGroup[] = [
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Careers', href: '/careers' },
          { label: 'Press & Media', href: '/press' },
          { label: 'Blog', href: '/blog' }
        ]
      },
      {
        title: 'Support',
        links: [
          { label: 'Contact Us', href: '/contact' },
          { label: 'FAQ', href: '/faq' },
          { label: 'Help Center', href: '/help' },
          { label: 'Return Policy', href: '/returns' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Cookie Policy', href: '/cookies' },
          { label: 'Accessibility', href: '/accessibility' }
        ]
      },
      {
        title: 'Resources',
        links: [
          { label: 'Community Forum', href: '/community' },
          { label: 'Partner Program', href: '/partners' },
          { label: 'Store Locator', href: '/stores' },
          { label: 'Gift Cards', href: '/gift-cards' }
        ]
      }
    ];
