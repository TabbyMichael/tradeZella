import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    import Button from '../components/common/Button';
    
    export default function ContactPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Contact Us"
              description="We'd love to hear from you! Please fill out the form below or use the contact information provided."
              centered
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <input type="text" id="name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input type="email" id="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" required />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <input type="text" id="subject" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea id="message" rows={5} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent" required></textarea>
                  </div>
                  <Button variant="gradient">Send Message &gt;</Button>
                </form>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                <p className="text-gray-600 mb-4">
                  <strong>Email:</strong> <a href="mailto:support@tradezella.com" className="text-purple-600 hover:text-purple-700">support@tradezella.com</a>
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Address:</strong> 123 Main Street, Anytown, USA
                </p>
                <div className="mt-6">
                  <h4 className="text-xl font-bold mb-2">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C16.68 4.3 15.6 3.5 14.4 3.5c-2.3 0-4.17 1.87-4.17 4.17 0 .33.04.65.12.95-3.47-.17-6.55-1.84-8.58-4.36-.36.62-.57 1.34-.57 2.1 0 1.45.74 2.73 1.86 3.48-.69-.02-1.34-.21-1.91-.53v.05c0 2.02 1.43 3.7 3.33 4.07-.34.1-.7.16-1.07.16-.27 0-.53-.03-.79-.08.55 1.66 2.14 2.88 4.02 2.92-1.42 1.11-3.21 1.77-5.18 1.77-.33 0-.65-.02-.97-.06 1.8 1.16 3.95 1.84 6.26 1.84 7.51 0 11.65-6.21 11.65-11.65 0-.18 0-.36-.01-.54.8-.57 1.49-1.28 2.04-2.05z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h8.68v-6.88H9.41V11.1h3.27V8.84c0-3.2 1.96-4.96 4.88-4.96 1.4 0 2.6.1 2.95.14v3.29h-2.02c-1.57 0-1.87.78-1.87 1.9v2.2h3.17l-.41 3.2h-2.76V21H20a1 1 0 001-1V4a1 1 0 00-1-1z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
