import React, { useState, useEffect } from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import axios from 'axios';
import { 
  BookOpen, Plus, Search, Filter, Heart, MessageCircle, 
  Share2, Download, Star, User, Lock, Globe, Edit, Trash2, Copy, Save
} from 'lucide-react';

interface Playbook {
  id: string;
  name: string;
  description: string;
  strategy: string;
  author: {
    name: string;
    avatar: string;
  };
  rating: number;
  reviews: number;
  downloads: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: string;
  playbookId: string;
  author: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const PlaybookCard = ({ playbook, onView }: { playbook: Playbook; onView: (playbook: Playbook) => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="p-5">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-gray-900">{playbook.name}</h3>
        {playbook.isPublic ? (
          <Globe className="h-5 w-5 text-green-500" />
        ) : (
          <Lock className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{playbook.description}</p>
      
      <div className="mt-4 flex items-center">
        <div className="flex-shrink-0">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{playbook.author.name}</p>
          <p className="text-xs text-gray-500">Updated {playbook.updatedAt}</p>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {playbook.tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {tag}
          </span>
        ))}
        {playbook.tags.length > 3 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            +{playbook.tags.length - 3}
          </span>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(playbook.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-500">
            {playbook.rating} ({playbook.reviews})
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Download className="h-4 w-4 mr-1" />
          {playbook.downloads}
        </div>
      </div>
    </div>
    <div className="bg-gray-50 px-5 py-3 flex justify-between">
      <button
        onClick={() => onView(playbook)}
        className="text-sm font-medium text-purple-600 hover:text-purple-800"
      >
        View Details
      </button>
      <div className="flex space-x-2">
        <button className="text-gray-400 hover:text-red-500">
          <Heart className="h-4 w-4" />
        </button>
        <button className="text-gray-400 hover:text-blue-500">
          <MessageCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

const ReviewItem = ({ review }: { review: Review }) => (
  <div className="py-4">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">{review.author.name}</p>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-xs text-gray-500">{review.createdAt}</span>
        </div>
      </div>
    </div>
    <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
  </div>
);

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'my-playbooks' | 'editor'>('library');
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock playbooks data
        const mockPlaybooks: Playbook[] = [
          {
            id: '1',
            name: 'Swing Trading Playbook',
            description: 'A comprehensive guide to swing trading strategies focusing on momentum and mean reversion setups.',
            strategy: 'Identify stocks with strong momentum, enter on pullbacks, and exit on reversal signals.',
            author: {
              name: 'Alex Johnson',
              avatar: ''
            },
            rating: 4.7,
            reviews: 24,
            downloads: 128,
            isPublic: true,
            tags: ['swing-trading', 'momentum', 'technical-analysis'],
            createdAt: '2023-01-15',
            updatedAt: '2023-03-22'
          },
          {
            id: '2',
            name: 'Options Income Strategy',
            description: 'Generate consistent income through selling covered calls and cash-secured puts.',
            strategy: 'Sell options with 30-45 days to expiration, targeting 1-2% monthly returns.',
            author: {
              name: 'Sarah Miller',
              avatar: ''
            },
            rating: 4.5,
            reviews: 18,
            downloads: 96,
            isPublic: true,
            tags: ['options', 'income', 'covered-calls'],
            createdAt: '2023-02-10',
            updatedAt: '2023-04-05'
          },
          {
            id: '3',
            name: 'Day Trading Patterns',
            description: 'Master common day trading patterns including breakouts, reversals, and continuation patterns.',
            strategy: 'Trade high-volume stocks during the first hour, focusing on established patterns.',
            author: {
              name: 'Mike Chen',
              avatar: ''
            },
            rating: 4.2,
            reviews: 31,
            downloads: 210,
            isPublic: true,
            tags: ['day-trading', 'patterns', 'volume'],
            createdAt: '2023-01-28',
            updatedAt: '2023-03-15'
          },
          {
            id: '4',
            name: 'Value Investing Framework',
            description: 'Long-term investing approach focusing on fundamentally strong companies trading below intrinsic value.',
            strategy: 'Screen for companies with strong balance sheets, consistent earnings growth, and low valuations.',
            author: {
              name: 'David Wilson',
              avatar: ''
            },
            rating: 4.8,
            reviews: 42,
            downloads: 187,
            isPublic: true,
            tags: ['value-investing', 'fundamental-analysis', 'long-term'],
            createdAt: '2022-11-15',
            updatedAt: '2023-02-20'
          }
        ];

        // Mock reviews data
        const mockReviews: Review[] = [
          {
            id: '1',
            playbookId: '1',
            author: {
              name: 'TraderPro',
              avatar: ''
            },
            rating: 5,
            comment: 'This playbook completely transformed my swing trading approach. The momentum setups are incredibly reliable!',
            createdAt: '2023-04-01'
          },
          {
            id: '2',
            playbookId: '1',
            author: {
              name: 'MarketMaster',
              avatar: ''
            },
            rating: 4,
            comment: 'Great resource with practical examples. Would love to see more detailed risk management guidelines.',
            createdAt: '2023-03-15'
          }
        ];

        setPlaybooks(mockPlaybooks);
        setReviews(mockReviews);
      } catch (err) {
        setError('Failed to load playbooks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const viewPlaybook = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setActiveTab('library');
  };

  const filteredPlaybooks = playbooks.filter(playbook => {
    const matchesSearch = playbook.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          playbook.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = filterTag === 'all' || playbook.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
  });

  const uniqueTags = Array.from(new Set(playbooks.flatMap(p => p.tags)));

  const createNewPlaybook = () => {
    setActiveTab('editor');
    setSelectedPlaybook(null);
  };

  return (
    <FeaturePageLayout
      title="Playbooks"
      description="Library of pre-built strategies from experts, powerful playbook editor, and community features for sharing and discussion."
      image="/assets/4.png"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('library');
                setSelectedPlaybook(null);
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'library'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Strategy Library
            </button>
            <button
              onClick={() => {
                setActiveTab('my-playbooks');
                setSelectedPlaybook(null);
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-playbooks'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Playbooks
            </button>
            <button
              onClick={createNewPlaybook}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'editor'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Playbook Editor
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-500">Loading playbooks...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-red-500">{error}</div>
          </div>
        ) : activeTab === 'library' || activeTab === 'my-playbooks' ? (
          selectedPlaybook ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedPlaybook.name}</h3>
                    {selectedPlaybook.isPublic ? (
                      <Globe className="h-5 w-5 text-green-500 ml-2" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400 ml-2" />
                    )}
                  </div>
                  <p className="mt-2 text-gray-600">{selectedPlaybook.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Copy className="h-4 w-4 mr-1" />
                    Clone
                  </button>
                  <button 
                    onClick={() => setSelectedPlaybook(null)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-5 mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Strategy Overview</h4>
                    <p className="text-gray-700">{selectedPlaybook.strategy}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-5">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Community Discussion</h4>
                    <div className="space-y-4">
                      {reviews.filter(r => r.playbookId === selectedPlaybook.id).length > 0 ? (
                        reviews
                          .filter(r => r.playbookId === selectedPlaybook.id)
                          .map(review => (
                            <ReviewItem key={review.id} review={review} />
                          ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to share your thoughts!</p>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <h5 className="text-md font-medium text-gray-900 mb-3">Add Your Review</h5>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} className="text-gray-300 hover:text-yellow-400 focus:outline-none">
                            <Star className="h-6 w-6" />
                          </button>
                        ))}
                      </div>
                      <textarea
                        placeholder="Share your experience with this playbook..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        rows={3}
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                          Post Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{selectedPlaybook.author.name}</p>
                        <p className="text-xs text-gray-500">Published {selectedPlaybook.createdAt}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(selectedPlaybook.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">{selectedPlaybook.rating}</p>
                        <p className="text-xs text-gray-500">{selectedPlaybook.reviews} reviews</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Download className="h-5 w-5 text-gray-400 mx-auto" />
                        <p className="mt-1 text-sm font-medium text-gray-900">{selectedPlaybook.downloads}</p>
                        <p className="text-xs text-gray-500">downloads</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Tags</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPlaybook.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Similar Playbooks</h4>
                    <div className="space-y-3">
                      {playbooks
                        .filter(p => p.id !== selectedPlaybook.id)
                        .slice(0, 3)
                        .map(playbook => (
                          <div 
                            key={playbook.id} 
                            className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                            onClick={() => setSelectedPlaybook(playbook)}
                          >
                            <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{playbook.name}</p>
                              <p className="text-xs text-gray-500">{playbook.author.name}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex-1">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search playbooks..."
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <div className="relative">
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md sm:text-sm"
                    >
                      <option value="all">All Tags</option>
                      {uniqueTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                  
                  {activeTab === 'my-playbooks' && (
                    <button
                      onClick={createNewPlaybook}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Playbook
                    </button>
                  )}
                </div>
              </div>
              
              {filteredPlaybooks.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No playbooks found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === 'my-playbooks' 
                      ? "Get started by creating a new playbook." 
                      : "Try adjusting your search or filter criteria."}
                  </p>
                  {activeTab === 'my-playbooks' && (
                    <div className="mt-6">
                      <button
                        onClick={createNewPlaybook}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Playbook
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlaybooks.map((playbook) => (
                    <PlaybookCard 
                      key={playbook.id} 
                      playbook={playbook} 
                      onView={viewPlaybook} 
                    />
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedPlaybook ? 'Edit Playbook' : 'Create New Playbook'}
              </h3>
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                  Publish
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Playbook Name
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="e.g., Swing Trading Strategy"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Briefly describe what this playbook is about..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strategy Details
                    </label>
                    <textarea
                      rows={10}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Describe your trading strategy in detail. Include entry rules, exit rules, risk management, position sizing, etc."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Settings</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visibility
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            name="visibility"
                            defaultChecked
                          />
                          <span className="ml-2 text-sm text-gray-700">Private</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            name="visibility"
                          />
                          <span className="ml-2 text-sm text-gray-700">Public</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <input
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="e.g., swing-trading, technical-analysis"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Separate tags with commas
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Preview</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Your Name</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-900">Untitled Playbook</h5>
                      <p className="text-sm text-gray-500 mt-1">
                        Brief description will appear here...
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          draft
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FeaturePageLayout>
  );
}