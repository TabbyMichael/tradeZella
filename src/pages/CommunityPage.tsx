import React from 'react';
import { ShieldCheckIcon, StarIcon, FireIcon, RssIcon, ChatBubbleLeftRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import SectionHeading from '../components/common/SectionHeading';
import './Forum.css';

const categories = [
  {
    name: 'Trade Journals',
    description: 'Share your trades and track your progress with the community.',
    icon: <StarIcon className="h-8 w-8 text-yellow-500" />,
    link: '#',
  },
  {
    name: 'Market Discussions',
    description: 'Discuss market trends, news, and general analysis.',
    icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-sky-500" />,
    link: '#',
  },
  {
    name: 'Strategies & Playbooks',
    description: 'Share and dissect trading strategies and playbooks.',
    icon: <FireIcon className="h-8 w-8 text-red-500" />,
    link: '#',
  },
  {
    name: 'Trader Psychology',
    description: 'Discuss the mental game of trading, discipline, and risk.',
    icon: <UserGroupIcon className="h-8 w-8 text-green-500" />,
    link: '#',
  },
  {
    name: 'Tools & Resources',
    description: 'Talk about brokers, software, and other trading tools.',
    icon: <RssIcon className="h-8 w-8 text-orange-500" />,
    link: '#',
  },
  {
    name: 'Platform Feedback',
    description: 'Help us improve by providing feedback and suggestions.',
    icon: <ShieldCheckIcon className="h-8 w-8 text-indigo-500" />,
    link: '#',
  },
];

const LeaderboardItem = ({ user, stat, rank }) => (
  <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-navy-800/50 rounded-lg">
    <div className="flex items-center">
      <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-6">{rank}.</span>
      <img className="h-8 w-8 rounded-full mr-3" src={`https://i.pravatar.cc/40?u=${user}`} alt={user} />
      <span className="font-medium text-slate-800 dark:text-white">{user}</span>
    </div>
    <span className="font-semibold text-purple-600 dark:text-purple-400">{stat}</span>
  </div>
);

export default function CommunityPage() {
  return (
    <div className="bg-gray-50 dark:forum-bg min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Community Hub"
          description="Connect, share, and learn with thousands of traders. Dive into discussions, share your journal, and grow together."
          centered
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Categories */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <a href={category.link} key={category.name} className="bg-white dark:category-card-3d group p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-gray-100 dark:bg-navy-800 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{category.description}</p>
                  <span className="font-semibold text-purple-600 dark:text-purple-400 group-hover:underline">
                    View Discussions &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Sidebar: Leaderboards & Stats */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Weekly Leaderboard</h3>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Most Helpful</h4>
                <LeaderboardItem user="CryptoGraph" stat="1,204 Upvotes" rank={1} />
                <LeaderboardItem user="SwingKing" stat="987 Upvotes" rank={2} />
                <LeaderboardItem user="Anna.T" stat="850 Upvotes" rank={3} />
              </div>
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Journals</h4>
                <LeaderboardItem user="RiskManager_01" stat="95% Win Rate" rank={1} />
                <LeaderboardItem user="ScalperX" stat="12 streak" rank={2} />
                <LeaderboardItem user="MomentumM" stat="4.5 R:R" rank={3} />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-navy-800/50 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Community Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700 dark:text-gray-300"><span>Threads:</span><span className="font-semibold">4,821</span></div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300"><span>Posts:</span><span className="font-semibold">62,194</span></div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300"><span>Members:</span><span className="font-semibold">12,345</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
