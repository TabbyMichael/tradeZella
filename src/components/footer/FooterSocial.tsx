import React from 'react';
import { Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';

const socialLinks = [
  { Icon: Twitter, href: '#twitter', label: 'Twitter' },
  { Icon: Instagram, href: '#instagram', label: 'Instagram' },
  { Icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
  { Icon: Facebook, href: '#facebook', label: 'Facebook' }
];

export default function FooterSocial() {
  return (
    <div className="flex space-x-4">
      {socialLinks.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          className="bg-navy-900 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label={label}
        >
          <Icon className="h-5 w-5 text-gray-400" />
        </a>
      ))}
    </div>
  );
}
