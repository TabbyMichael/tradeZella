import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    question: 'How do I connect my broker account?',
    answer: 'You can connect your broker account by navigating to the "Integrations" section in your account settings. From there, select your broker and follow the on-screen instructions.'
  },
  {
    question: 'What if my broker is not on the list?',
    answer: 'If your broker is not on our list of supported brokers, you can request an integration. We are constantly working to add support for new brokers.'
  },
  {
    question: 'How long does it take to sync my trading data?',
    answer: 'The initial sync can take up to 24 hours, depending on the amount of data. Subsequent syncs are much faster and usually happen in near real-time.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security very seriously. All your data is encrypted both in transit and at rest. We do not have access to your trading credentials.'
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              className="w-full flex justify-between items-center p-4 focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-medium">{faq.question}</span>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-50">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
