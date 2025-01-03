import React from 'react';
import Button from '../common/Button';

export default function FooterNewsletter() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-white">Stay Updated</h3>
      <p className="text-gray-400">Get the latest trading insights and updates.</p>
      <form className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg bg-navy-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          required
        />
        <Button variant="gradient" className="whitespace-nowrap">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
