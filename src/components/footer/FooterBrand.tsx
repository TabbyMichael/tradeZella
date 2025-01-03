import React from 'react';
import { BookOpen } from 'lucide-react';

export default function FooterBrand() {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <BookOpen className="h-8 w-8 text-purple-600" />
        <span className="ml-2 text-xl font-bold text-white">TradeZella</span>
      </div>
      <p className="text-gray-400">
        Tools for futures, currency & options involves substantial risk &
        is not appropriate for everyone. Only risk capital should be
        used for trading.
      </p>
    </div>
  );
}
