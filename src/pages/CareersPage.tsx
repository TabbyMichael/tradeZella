import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    import Button from '../components/common/Button';
    
    const openPositions = [
      {
        title: 'Senior Software Engineer',
        location: 'Remote',
        description: 'We are looking for a talented senior software engineer to join our team and help us build the next generation of trading tools.',
        link: '#',
        image: 'https://images.unsplash.com/photo-1517245386804-1111d2e49814?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Marketing Manager',
        location: 'New York, NY',
        description: 'We are seeking a creative and experienced marketing manager to lead our marketing efforts and grow our user base.',
        link: '#',
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Customer Support Specialist',
        location: 'Remote',
        description: 'We are hiring a customer support specialist to provide excellent support to our users and help them get the most out of our platform.',
        link: '#',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=400&q=80'
      }
    ];
    
    export default function CareersPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Join Our Team"
              description="We're looking for passionate and talented individuals to help us build the future of trading. If you're excited about the intersection of technology and finance, we'd love to hear from you."
              centered
            />
            
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {openPositions.map((position, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col">
                    <img src={position.image} alt={position.title} className="rounded-t-lg mb-4 h-48 w-full object-cover" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                      <p className="text-gray-600 mb-4">{position.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-gray-700 font-medium">{position.location}</span>
                      <Button variant="gradient">
                        <a href={position.link}>Apply Now &gt;</a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6">Benefits & Perks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold mb-2">Competitive Compensation</h4>
                  <p className="text-gray-600">We offer competitive salaries and benefits packages.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold mb-2">Flexible Work</h4>
                  <p className="text-gray-600">We offer flexible work hours and remote work options.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold mb-2">Professional Growth</h4>
                  <p className="text-gray-600">We provide opportunities for professional growth and development.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-bold mb-2">Supportive Environment</h4>
                  <p className="text-gray-600">We foster a collaborative and supportive work environment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
