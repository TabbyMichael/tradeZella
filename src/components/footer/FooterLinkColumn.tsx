import React from 'react';
    import { LinkGroup } from './types';
    import { Link } from 'react-router-dom';
    
    export default function FooterLinkColumn({ title, links }: LinkGroup) {
      return (
        <div>
          <h3 className="font-semibold text-white mb-4">{title}</h3>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }
