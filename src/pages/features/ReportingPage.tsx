import React, { useState, useEffect } from 'react';
import FeaturePageLayout from './FeaturePageLayout';
import SEO from '../../components/common/SEO';
import axios from 'axios';
import { 
  BarChart, PieChart, TrendingUp, Calendar, Download, Share2, 
  Plus, Save, Edit, Trash2, Copy, Eye, Clock
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  components: string[];
  isPublic: boolean;
  createdAt: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  nextRun: string;
  recipients: string[];
}

const ReportComponent = ({ component, onRemove }: { component: string; onRemove: () => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center">
    <div className="flex items-center">
      {component === 'performance-summary' && <BarChart className="h-5 w-5 text-purple-600 mr-2" />}
      {component === 'win-loss-chart' && <PieChart className="h-5 w-5 text-green-600 mr-2" />}
      {component === 'equity-curve' && <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />}
      {component === 'monthly-performance' && <Calendar className="h-5 w-5 text-yellow-600 mr-2" />}
      <span className="text-sm font-medium">{component.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
    </div>
    <button 
      onClick={onRemove}
      className="text-gray-400 hover:text-red-500"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  </div>
);

export default function ReportingPage() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'scheduled'>('builder');
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [availableComponents] = useState([
    'performance-summary',
    'win-loss-chart',
    'equity-curve',
    'monthly-performance',
    'trade-list',
    'strategy-performance',
    'risk-metrics',
    'correlation-analysis'
  ]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(['performance-summary', 'win-loss-chart']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access reports.');
          return;
        }

        // In a real implementation, these would be separate API calls
        const mockTemplates: ReportTemplate[] = [
          {
            id: '1',
            name: 'Monthly Performance Report',
            description: 'Comprehensive monthly trading performance summary',
            components: ['performance-summary', 'win-loss-chart', 'monthly-performance'],
            isPublic: true,
            createdAt: '2023-01-15'
          },
          {
            id: '2',
            name: 'Strategy Analysis Report',
            description: 'Detailed analysis of strategy performance',
            components: ['strategy-performance', 'risk-metrics', 'equity-curve'],
            isPublic: false,
            createdAt: '2023-02-20'
          }
        ];

        const mockScheduled: ScheduledReport[] = [
          {
            id: '1',
            name: 'Weekly Performance Summary',
            frequency: 'weekly',
            nextRun: '2023-04-10',
            recipients: ['trader@example.com']
          },
          {
            id: '2',
            name: 'Monthly Strategy Report',
            frequency: 'monthly',
            nextRun: '2023-05-01',
            recipients: ['trader@example.com', 'manager@example.com']
          }
        ];

        setTemplates(mockTemplates);
        setScheduledReports(mockScheduled);
      } catch (err) {
        setError('Failed to load report data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addComponent = (component: string) => {
    if (!selectedComponents.includes(component)) {
      setSelectedComponents([...selectedComponents, component]);
    }
  };

  const removeComponent = (component: string) => {
    setSelectedComponents(selectedComponents.filter(c => c !== component));
  };

  const moveComponent = (fromIndex: number, toIndex: number) => {
    const updatedComponents = [...selectedComponents];
    const [movedItem] = updatedComponents.splice(fromIndex, 1);
    updatedComponents.splice(toIndex, 0, movedItem);
    setSelectedComponents(updatedComponents);
  };

  const saveTemplate = async () => {
    if (!reportName.trim()) {
      alert('Please enter a report name');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // In a real implementation, this would be an API call
      const newTemplate: ReportTemplate = {
        id: `${Date.now()}`,
        name: reportName,
        description: reportDescription,
        components: selectedComponents,
        isPublic: false,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setTemplates([newTemplate, ...templates]);
      setReportName('');
      setReportDescription('');
      setSelectedComponents(['performance-summary', 'win-loss-chart']);
      alert('Report template saved successfully!');
    } catch (err) {
      setError('Failed to save report template.');
      console.error(err);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report template?')) return;
    
    try {
      // In a real implementation, this would be an API call
      setTemplates(templates.filter(template => template.id !== id));
      alert('Report template deleted successfully!');
    } catch (err) {
      setError('Failed to delete report template.');
      console.error(err);
    }
  };

  const duplicateTemplate = (template: ReportTemplate) => {
    const duplicated: ReportTemplate = {
      ...template,
      id: `${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTemplates([duplicated, ...templates]);
  };

  const scheduleReport = () => {
    alert('Report scheduling feature would open here');
  };

  const exportReport = () => {
    alert('Report export feature would open here');
  };

  const shareReport = () => {
    alert('Report sharing feature would open here');
  };

  return (
    <>
      <SEO 
        title="Reporting"
        description="Drag-and-drop report builder, scheduled reports, and shareable, presentation-ready report templates for your trading performance."
        keywords="trading reports, report builder, scheduled reports, performance reporting, trading analytics, drag and drop reports"
        url="https://tradezella.com/features/reporting"
      />
      <FeaturePageLayout
        title="Reporting"
        description="Drag-and-drop report builder, scheduled reports, and shareable, presentation-ready report templates."
        image="/assets/3.png"
      >
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('builder')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'builder'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Report Builder
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Templates
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'scheduled'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Scheduled Reports
              </button>
            </nav>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <p className="mt-2 text-gray-500">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="text-red-500">{error}</div>
            </div>
          ) : activeTab === 'builder' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Available Components */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Report Components</h3>
                <div className="space-y-3">
                  {availableComponents.map((component) => (
                    <div 
                      key={component}
                      onClick={() => addComponent(component)}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        {component === 'performance-summary' && <BarChart className="h-5 w-5 text-purple-600 mr-2" />}
                        {component === 'win-loss-chart' && <PieChart className="h-5 w-5 text-green-600 mr-2" />}
                        {component === 'equity-curve' && <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />}
                        {component === 'monthly-performance' && <Calendar className="h-5 w-5 text-yellow-600 mr-2" />}
                        <span className="text-sm font-medium">{component.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {component === 'performance-summary' && 'Key performance metrics and statistics'}
                        {component === 'win-loss-chart' && 'Visual representation of winning vs losing trades'}
                        {component === 'equity-curve' && 'Cumulative profit/loss over time'}
                        {component === 'monthly-performance' && 'Performance breakdown by month'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Builder */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <input
                        type="text"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        placeholder="Report Name"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                      <textarea
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        placeholder="Report Description (optional)"
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        rows={2}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={saveTemplate}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Template
                      </button>
                      <button
                        onClick={exportReport}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-4">Report Preview</h3>
                <div className="space-y-4">
                  {selectedComponents.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">Drag components here to build your report</p>
                    </div>
                  ) : (
                    selectedComponents.map((component, index) => (
                      <ReportComponent 
                        key={component} 
                        component={component} 
                        onRemove={() => removeComponent(component)} 
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'templates' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Saved Report Templates</h3>
                <button
                  onClick={() => setActiveTab('builder')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Template
                </button>
              </div>

              {templates.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No saved report templates yet</p>
                  <button
                    onClick={() => setActiveTab('builder')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Create Your First Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-5">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                          {template.isPublic && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Public
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{template.description}</p>
                        <div className="mt-4">
                          <p className="text-xs text-gray-400">Components:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.components.slice(0, 3).map((component) => (
                              <span key={component} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {component.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            ))}
                            {template.components.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{template.components.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3 flex justify-between">
                        <div className="text-xs text-gray-500">
                          Created {template.createdAt}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => duplicateTemplate(template)}
                            className="text-gray-400 hover:text-gray-500"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={shareReport}
                            className="text-gray-400 hover:text-purple-500"
                            title="Share"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={scheduleReport}
                            className="text-gray-400 hover:text-blue-500"
                            title="Schedule"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Scheduled Reports</h3>
                <button
                  onClick={scheduleReport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Report
                </button>
              </div>

              {scheduledReports.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No scheduled reports yet</p>
                  <button
                    onClick={scheduleReport}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Schedule Your First Report
                  </button>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {scheduledReports.map((report) => (
                      <li key={report.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-purple-600 truncate">{report.name}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {report.frequency}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Eye className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>
                                Next run: {report.nextRun}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </FeaturePageLayout>
    </>
  );
}