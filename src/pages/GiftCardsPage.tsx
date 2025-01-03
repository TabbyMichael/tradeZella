import React from 'react';
    import SectionHeading from '../components/common/SectionHeading';
    import Button from '../components/common/Button';
    
    export default function GiftCardsPage() {
      return (
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Gift Cards"
              description="Purchase or redeem TradeZella gift cards. Give the gift of trading success to your friends and family."
              centered
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Purchase Options</h2>
                <p className="text-gray-600 mb-4">
                  You can purchase TradeZella gift cards online or at any of our store locations.
                </p>
                <Button variant="gradient">
                  <a href="#">Purchase Gift Card &gt;</a>
                </Button>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80" 
                  alt="Gift Cards" 
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6">Redemption Process</h2>
              <p className="text-gray-600 mb-4">
                To redeem a gift card, enter the gift card code at checkout.
              </p>
              
              <h2 className="text-3xl font-bold mb-6">Terms and Conditions</h2>
              <p className="text-gray-600 mb-4">
                Gift cards are non-refundable and cannot be redeemed for cash.
              </p>
              
              <h2 className="text-3xl font-bold mb-6">Check Gift Card Balance</h2>
              <p className="text-gray-600 mb-4">
                You can check your gift card balance by entering your gift card code below.
              </p>
              <input type="text" placeholder="Enter gift card code" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-4" />
              <Button variant="gradient">
                <a href="#">Check Balance &gt;</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }
