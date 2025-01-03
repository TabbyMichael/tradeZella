import React, { useState } from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    
    const faqData = [
      {
        category: 'Account',
        questions: [
          {
            question: 'How do I create an account?',
            answer: 'To create an account, click on the "Sign Up" button on the top right corner of the page and follow the instructions.'
          },
          {
            question: 'How do I reset my password?',
            answer: 'To reset your password, click on the "Forgot Password" link on the login page and follow the instructions.'
          }
        ]
      },
      {
        category: 'Billing',
        questions: [
          {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, debit cards, and PayPal.'
          },
          {
            question: 'How do I cancel my subscription?',
            answer: 'To cancel your subscription, go to your account settings and click on the "Cancel Subscription" button.'
          }
        ]
      },
      {
        category: 'Features',
        questions: [
          {
            question: 'How do I use the journaling feature?',
            answer: 'To use the journaling feature, go to the "Journal" section of the platform and click on the "Add New Entry" button.'
          },
          {
            question: 'How do I analyze my trading data?',
            answer: 'To analyze your trading data, go to the "Analysis" section of the platform and select the data you want to analyze.'
          }
        ]
      },
      {
        category: 'Technical',
        questions: [
          {
            question: 'What are the system requirements?',
            answer: 'The system requirements are a modern web browser and a stable internet connection.'
          },
          {
            question: 'What if I encounter a bug?',
            answer: 'If you encounter a bug, please contact our support team with details about the issue.'
          }
        ]
      }
    ];
    
    export default function FAQPage() {
      const [activeCategory, setActiveCategory] = useState(faqData[0].category);
    
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Frequently Asked Questions"
              description="Find answers to common questions about TradeZella. If you can't find what you're looking for, please contact our support team."
              centered
            />
            
            <div className="mt-12">
              <div className="flex space-x-4 mb-8">
                {faqData.map((item) => (
                  <button
                    key={item.category}
                    className={`px-4 py-2 rounded-lg font-medium ${activeCategory === item.category ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setActiveCategory(item.category)}
                  >
                    {item.category}
                  </button>
                ))}
              </div>
              
              {faqData.map((item) => (
                item.category === activeCategory && (
                  <div key={item.category}>
                    {item.questions.map((faq, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md mb-4">
                        <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      );
    }
