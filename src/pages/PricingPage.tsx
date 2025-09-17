import React from 'react';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Basic',
    price: '$19',
    description: 'Ideal for beginners.',
    features: [
      'Access to basic features',
      'Limited trade journaling',
      'Basic reporting',
    ],
    buttonVariant: 'primary',
    link: '/signup',
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For serious traders.',
    features: [
      'Access to all features',
      'Unlimited trade journaling',
      'Advanced reporting',
      'Playbooks',
    ],
    buttonVariant: 'gradient',
    recommended: true,
    link: '/signup',
  },
  {
    name: 'Premium',
    price: '$99',
    description: 'For professional traders.',
    features: [
      'Access to all features',
      'Unlimited trade journaling',
      'Advanced reporting',
      'Playbooks',
      'Backtesting',
      'Priority support',
    ],
    buttonVariant: 'primary',
    link: '/signup',
  },
];

export default function PricingPage() {
  return (
    <div className="py-24 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Pricing"
          description="Choose the plan that's right for you. We offer flexible subscription options to meet your needs."
          centered
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col transform hover:-translate-y-2 transition-transform duration-300 ${plan.recommended ? 'border-4 border-purple-600' : 'border border-gray-200 dark:border-gray-700'}`}
            >
              {plan.recommended && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-3 py-1 text-sm font-semibold tracking-wide rounded-full uppercase">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-center dark:text-white">{plan.name}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-center h-12">{plan.description}</p>
              <p className="mt-6 text-5xl font-bold text-center dark:text-white">
                {plan.price}<span className="text-lg font-medium text-gray-500 dark:text-gray-400">/month</span>
              </p>
              <ul className="mt-8 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                    <span className="ml-3 text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to={plan.link}>
                  <Button variant={plan.buttonVariant as 'primary' | 'gradient'} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
