import React from 'react';

interface LinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const linkGroups: LinkGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Blog', href: '#blog' },
      { label: 'Broker Support', href: '#support' },
      { label: 'Become A Partner', href: '#partner' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms & Conditions', href: '#terms' }
    ]
  }
];

export default function FooterLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {linkGroups.map((group) => (
        <div key={group.title}>
          <h3 className="font-semibold text-white mb-4">{group.title}</h3>
          <ul className="space-y-2">
            {group.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
