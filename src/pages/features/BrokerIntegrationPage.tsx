import React, { useState, useEffect } from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import axios from 'axios';
import { 
  Shield, Zap, RefreshCw, Link, Unlock, Key, 
  CheckCircle, AlertTriangle, XCircle, Plus, Trash2
} from 'lucide-react';

interface BrokerConnection {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  syncStatus: 'success' | 'failed' | 'in-progress';
  isConnected: boolean;
}

const BrokerCard = ({ 
  broker, 
  onConnect, 
  onDisconnect, 
  onSync 
}: { 
  broker: BrokerConnection; 
  onConnect: (id: string) => void; 
  onDisconnect: (id: string) => void; 
  onSync: (id: string) => void; 
}) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{broker.name}</h3>
          <div className="flex items-center mt-1">
            {broker.status === 'connected' && (
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            )}
            {broker.status === 'disconnected' && (
              <XCircle className="h-4 w-4 text-gray-400 mr-1" />
            )}
            {broker.status === 'error' && (
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${
              broker.status === 'connected' ? 'text-green-600' : 
              broker.status === 'disconnected' ? 'text-gray-500' : 'text-red-600'
            }`}>
              {broker.status === 'connected' ? 'Connected' : 
               broker.status === 'disconnected' ? 'Disconnected' : 'Error'}
            </span>
          </div>
        </div>
        <div className={`h-3 w-3 rounded-full ${
          broker.status === 'connected' ? 'bg-green-500' : 
          broker.status === 'disconnected' ? 'bg-gray-300' : 'bg-red-500'
        }`}></div>
      </div>
      
      {broker.lastSync && (
        <div className="mt-4 text-sm text-gray-500">
          <p>Last sync: {broker.lastSync}</p>
          <div className="flex items-center mt-1">
            {broker.syncStatus === 'success' && (
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            )}
            {broker.syncStatus === 'failed' && (
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
            )}
            {broker.syncStatus === 'in-progress' && (
              <RefreshCw className="h-4 w-4 text-blue-500 mr-1 animate-spin" />
            )}
            <span>
              {broker.syncStatus === 'success' ? 'Sync successful' : 
               broker.syncStatus === 'failed' ? 'Sync failed' : 'Sync in progress'}
            </span>
          </div>
        </div>
      )}
    </div>
    
    <div className="bg-gray-50 px-5 py-3 flex justify-between">
      {broker.status === 'connected' ? (
        <>
          <button
            onClick={() => onSync(broker.id)}
            className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Sync Now
          </button>
          <button
            onClick={() => onDisconnect(broker.id)}
            className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={() => onConnect(broker.id)}
          className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center"
        >
          <Link className="h-4 w-4 mr-1" />
          Connect
        </button>
      )}
    </div>
  </div>
);

const SecurityFeature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-100 text-purple-600">
        {icon}
      </div>
    </div>
    <div className="ml-4">
      <h4 className="text-lg font-medium text-gray-900">{title}</h4>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  </div>
);

export default function BrokerIntegrationPage() {
  const [brokers, setBrokers] = useState<BrokerConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock brokers data
        const mockBrokers: BrokerConnection[] = [
          {
            id: '1',
            name: 'Interactive Brokers',
            status: 'connected',
            lastSync: '2023-04-15 14:30:00',
            syncStatus: 'success',
            isConnected: true
          },
          {
            id: '2',
            name: 'TD Ameritrade',
            status: 'disconnected',
            lastSync: '',
            syncStatus: 'failed',
            isConnected: false
          },
          {
            id: '3',
            name: 'E*TRADE',
            status: 'connected',
            lastSync: '2023-04-14 09:15:00',
            syncStatus: 'success',
            isConnected: true
          },
          {
            id: '4',
            name: 'Charles Schwab',
            status: 'error',
            lastSync: '2023-04-10 16:00:00',
            syncStatus: 'failed',
            isConnected: true
          },
          {
            id: '5',
            name: 'Fidelity',
            status: 'disconnected',
            lastSync: '',
            syncStatus: 'failed',
            isConnected: false
          },
          {
            id: '6',
            name: 'Robinhood',
            status: 'disconnected',
            lastSync: '',
            syncStatus: 'failed',
            isConnected: false
          }
        ];

        setBrokers(mockBrokers);
      } catch (err) {
        setError('Failed to load broker connections.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConnect = async (brokerId: string) => {
    try {
      // In a real implementation, this would be an API call
      setBrokers(brokers.map(broker => 
        broker.id === brokerId 
          ? { ...broker, status: 'connected', isConnected: true } 
          : broker
      ));
      alert(`Successfully connected to ${brokers.find(b => b.id === brokerId)?.name}`);
    } catch (err) {
      setError('Failed to connect to broker.');
      console.error(err);
    }
  };

  const handleDisconnect = async (brokerId: string) => {
    try {
      // In a real implementation, this would be an API call
      setBrokers(brokers.map(broker => 
        broker.id === brokerId 
          ? { ...broker, status: 'disconnected', isConnected: false } 
          : broker
      ));
      alert(`Successfully disconnected from ${brokers.find(b => b.id === brokerId)?.name}`);
    } catch (err) {
      setError('Failed to disconnect from broker.');
      console.error(err);
    }
  };

  const handleSync = async (brokerId: string) => {
    try {
      // In a real implementation, this would be an API call
      setBrokers(brokers.map(broker => 
        broker.id === brokerId 
          ? { ...broker, syncStatus: 'in-progress' } 
          : broker
      ));
      
      // Simulate sync process
      setTimeout(() => {
        setBrokers(brokers.map(broker => 
          broker.id === brokerId 
            ? { 
                ...broker, 
                syncStatus: 'success',
                lastSync: new Date().toLocaleString()
              } 
            : broker
        ));
        alert(`Successfully synced data from ${brokers.find(b => b.id === brokerId)?.name}`);
      }, 2000);
    } catch (err) {
      setBrokers(brokers.map(broker => 
        broker.id === brokerId 
          ? { ...broker, syncStatus: 'failed' } 
          : broker
      ));
      setError('Failed to sync data from broker.');
      console.error(err);
    }
  };

  const handleSubmitConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBroker || !apiKey || !apiSecret) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      // In a real implementation, this would be an API call
      const newConnection: BrokerConnection = {
        id: `${Date.now()}`,
        name: selectedBroker,
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        syncStatus: 'success',
        isConnected: true
      };
      
      setBrokers([newConnection, ...brokers]);
      setShowConnectForm(false);
      setSelectedBroker('');
      setApiKey('');
      setApiSecret('');
      alert(`Successfully connected to ${selectedBroker}`);
    } catch (err) {
      setError('Failed to establish broker connection.');
      console.error(err);
    }
  };

  const connectedBrokers = brokers.filter(b => b.status === 'connected');
  const disconnectedBrokers = brokers.filter(b => b.status !== 'connected');

  return (
    <FeaturePageLayout
      title="Broker Integration"
      description="Seamless and secure integration with a wide range of brokers for real-time data and direct trade execution."
      image="/assets/6.png"
    >
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Security Features */}
        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Bank-Level Security</h3>
            <p className="mt-2 text-gray-600 max-w-3xl mx-auto">
              Your broker credentials are encrypted and stored securely. We never store your passwords, 
              and all connections use industry-standard encryption protocols.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SecurityFeature 
              icon={<Shield className="h-6 w-6" />}
              title="Military-Grade Encryption"
              description="All data transmitted between your broker and our platform is encrypted with AES-256 encryption."
            />
            <SecurityFeature 
              icon={<Unlock className="h-6 w-6" />}
              title="Zero-Knowledge Architecture"
              description="We never store your broker passwords. API keys are encrypted and stored in secure vaults."
            />
            <SecurityFeature 
              icon={<Key className="h-6 w-6" />}
              title="Two-Factor Authentication"
              description="Protect your account with 2FA to add an extra layer of security to your broker connections."
            />
          </div>
        </div>
        
        {/* Connected Brokers */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Connected Brokers</h3>
            <button
              onClick={() => setShowConnectForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Broker
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <p className="mt-2 text-gray-500">Loading broker connections...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="text-red-500">{error}</div>
            </div>
          ) : connectedBrokers.length === 0 ? (
            <div className="text-center py-10">
              <Zap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No brokers connected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by connecting your first broker account.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowConnectForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Broker
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedBrokers.map((broker) => (
                <BrokerCard 
                  key={broker.id} 
                  broker={broker} 
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  onSync={handleSync}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Available Brokers */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-6">Available Brokers</h3>
          
          {disconnectedBrokers.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">All supported brokers are connected</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disconnectedBrokers.map((broker) => (
                <BrokerCard 
                  key={broker.id} 
                  broker={broker} 
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  onSync={handleSync}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Connect Broker Modal */}
        {showConnectForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Connect Broker Account</h3>
                  <button
                    onClick={() => setShowConnectForm(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <form className="mt-4 space-y-4" onSubmit={handleSubmitConnection}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Broker
                    </label>
                    <select
                      value={selectedBroker}
                      onChange={(e) => setSelectedBroker(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                      <option value="">Select a broker</option>
                      <option value="Interactive Brokers">Interactive Brokers</option>
                      <option value="TD Ameritrade">TD Ameritrade</option>
                      <option value="E*TRADE">E*TRADE</option>
                      <option value="Charles Schwab">Charles Schwab</option>
                      <option value="Fidelity">Fidelity</option>
                      <option value="Robinhood">Robinhood</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Enter your API key"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Enter your API secret"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the <a href="#" className="text-purple-600 hover:text-purple-800">terms and conditions</a>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowConnectForm(false)}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Connect
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </FeaturePageLayout>
  );
}