import React from 'react';
import Button from './common/Button';

export default function Newsletter() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Ready to become a{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              profitable trader?
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The one tool that lets you do everything you need to improve your
            trading strategy. Get started today.
          </p>
          
          <form className="mt-8 max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
              <Button variant="gradient" className="whitespace-nowrap">
                Get Started &gt;
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
