import React, { useState } from 'react';
import { Search, Filter, BookOpen, Scale, Heart, Baby, Home, DollarSign, Download, ExternalLink } from 'lucide-react';
import QuickExitButton from '../components/Common/QuickExitButton';

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'legal', name: 'Legal Aid', icon: Scale },
    { id: 'health', name: 'Health & Safety', icon: Heart },
    { id: 'mental-wellness', name: 'Mental Wellness', icon: Heart },
    { id: 'child-support', name: 'Child Support', icon: Baby },
    { id: 'housing', name: 'Housing', icon: Home },
    { id: 'financial', name: 'Financial', icon: DollarSign },
  ];

  const resources = [
    {
      id: 1,
      title: 'Creating Your Safety Plan',
      category: 'health',
      description: 'A comprehensive guide to developing a personalized safety plan for you and your family.',
      content: 'This resource covers identifying safe locations, gathering important documents, establishing emergency contacts, and creating escape routes.',
      tags: ['safety', 'planning', 'emergency'],
      downloadable: true,
      isPublic: true,
    },
    {
      id: 2,
      title: 'Understanding Your Legal Rights',
      category: 'legal',
      description: 'Learn about restraining orders, custody rights, and legal protections available to survivors.',
      content: 'Detailed information about legal options including protective orders, divorce proceedings, and custody arrangements.',
      tags: ['legal', 'rights', 'protection'],
      downloadable: true,
      isPublic: true,
    },
    {
      id: 3,
      title: 'Healing from Trauma',
      category: 'mental-wellness',
      description: 'Mental health resources and coping strategies for survivors of domestic violence.',
      content: 'Evidence-based approaches to trauma recovery including therapy options, self-care practices, and support groups.',
      tags: ['trauma', 'healing', 'therapy'],
      downloadable: false,
      isPublic: true,
    },
    {
      id: 4,
      title: 'Emergency Housing Options',
      category: 'housing',
      description: 'Information about shelters, transitional housing, and emergency accommodation.',
      content: 'Directory of local shelters, requirements for admission, and transitional housing programs.',
      tags: ['housing', 'shelter', 'emergency'],
      downloadable: true,
      isPublic: true,
    },
    {
      id: 5,
      title: 'Financial Independence Guide',
      category: 'financial',
      description: 'Steps to achieve financial independence and access emergency financial assistance.',
      content: 'Information about budgeting, credit repair, job training programs, and emergency financial aid.',
      tags: ['financial', 'independence', 'assistance'],
      downloadable: true,
      isPublic: true,
    },
    {
      id: 6,
      title: 'Protecting Your Children',
      category: 'child-support',
      description: 'Resources for keeping children safe during and after domestic violence situations.',
      content: 'Child safety planning, talking to children about violence, and accessing child support services.',
      tags: ['children', 'safety', 'support'],
      downloadable: true,
      isPublic: true,
    },
    {
      id: 7,
      title: 'Technology Safety',
      category: 'health',
      description: 'How to protect your digital privacy and stay safe online.',
      content: 'Digital safety tips, securing devices, and protecting online accounts from abusers.',
      tags: ['technology', 'privacy', 'digital'],
      downloadable: true,
      isPublic: true,
    },
    {
      id: 8,
      title: 'Workplace Rights for Survivors',
      category: 'legal',
      description: 'Understanding your rights at work and accessing workplace accommodations.',
      content: 'Information about time off for court proceedings, workplace safety, and legal protections.',
      tags: ['workplace', 'rights', 'employment'],
      downloadable: false,
      isPublic: true,
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (resource: any) => {
    // In a real app, this would trigger a file download
    alert(`Downloading: ${resource.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <QuickExitButton />
      
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Resource Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Access comprehensive guides, legal information, and support resources to help you 
              navigate your situation and plan for a safer future.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1 py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const categoryData = categories.find(cat => cat.id === resource.category);
                const CategoryIcon = categoryData?.icon || BookOpen;
                
                return (
                  <div
                    key={resource.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                            <CategoryIcon className="h-5 w-5 text-primary-600" />
                          </div>
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {categoryData?.name}
                          </span>
                        </div>
                        {resource.downloadable && (
                          <button
                            onClick={() => handleDownload(resource)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Download resource"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                          <span>Read more</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                        
                        {resource.downloadable && (
                          <button
                            onClick={() => handleDownload(resource)}
                            className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Emergency Resources Banner */}
      <section className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
              Need Immediate Help?
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-6 max-w-2xl mx-auto">
              If you're in immediate danger, don't wait. Contact emergency services or our crisis hotline right away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:911"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Call 911
              </a>
              <a
                href="tel:+2347032861486"
                className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 px-6 py-3 rounded-lg font-semibold border-2 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Call Safe Haven Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;