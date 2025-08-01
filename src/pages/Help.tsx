import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, FileText, Users, Phone, Heart, Download, MessageCircle } from 'lucide-react';
import QuickExitButton from '../components/Common/QuickExitButton';

type SafetyPlan = {
  emergencyContacts: { name: string; phone: string; relationship: string }[];
  safeLocations: string[];
  importantDocuments: string[];
  escapeRoutes: string[];
  warningSignals: string[];
  personalItems: string[];
};

const Help: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan>({
    emergencyContacts: [{ name: '', phone: '', relationship: '' }],
    safeLocations: [''],
    importantDocuments: [],
    escapeRoutes: [''],
    warningSignals: [''],
    personalItems: [''],
  });


  const safetySteps = [
    {
      title: 'Assess Your Safety',
      description: 'Understanding your current situation and immediate safety needs.',
      icon: Shield,
      questions: [
        'Are you currently in immediate physical danger?',
        'Do you have a safe place to go if you need to leave quickly?',
        'Are there weapons in your home?',
        'Has the violence been escalating?'
      ]
    },
    {
      title: 'Emergency Contacts',
      description: 'People you can call for help in an emergency.',
      icon: Phone,
      component: 'contacts'
    },
    {
      title: 'Safe Locations',
      description: 'Places where you can go to be safe.',
      icon: Shield,
      component: 'locations'
    },
    {
      title: 'Important Documents',
      description: 'Documents you should gather and keep safe.',
      icon: FileText,
      component: 'documents'
    },
    {
      title: 'Warning Signals',
      description: 'Signs that indicate violence may be about to occur.',
      icon: AlertTriangle,
      component: 'warnings'
    },
    {
      title: 'Your Safety Plan',
      description: 'Review and save your personalized safety plan.',
      icon: CheckCircle,
      component: 'review'
    }
  ];

  const importantDocuments = [
    'Driver\'s license or ID',
    'Social Security cards',
    'Birth certificates',
    'Passport',
    'Insurance papers',
    'Medical records',
    'Prescription medications',
    'Bank statements',
    'Credit cards',
    'Checkbook',
    'School records',
    'Immigration papers',
    'Lease/mortgage papers',
    'Car title/registration',
    'Protection orders',
    'Court documents'
  ];

  const handleDocumentToggle = (document: string) => {
    setSafetyPlan(prev => ({
      ...prev,
      importantDocuments: prev.importantDocuments.includes(document)
        ? prev.importantDocuments.filter(doc => doc !== document)
        : [...prev.importantDocuments, document]
    }));
  };

  const addEmergencyContact = () => {
    setSafetyPlan(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relationship: '' }]
    }));
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    setSafetyPlan(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const addField = (field: string) => {
    setSafetyPlan(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev] as string[], '']
    }));
  };

  const updateField = (field: string, index: number, value: string) => {
    setSafetyPlan(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) =>
        i === index ? value : item
      )
    }));
  };

  const downloadPlan = () => {
    const planText = `
PERSONAL SAFETY PLAN
Generated on: ${new Date().toLocaleDateString()}

EMERGENCY CONTACTS:
${safetyPlan.emergencyContacts.map(contact =>
      `${contact.name} - ${contact.phone} (${contact.relationship})`
    ).join('\n')}

SAFE LOCATIONS:
${safetyPlan.safeLocations.filter(loc => loc.trim()).join('\n')}

IMPORTANT DOCUMENTS:
${safetyPlan.importantDocuments.join('\n')}

ESCAPE ROUTES:
${safetyPlan.escapeRoutes.filter(route => route.trim()).join('\n')}

WARNING SIGNALS:
${safetyPlan.warningSignals.filter(signal => signal.trim()).join('\n')}

PERSONAL ITEMS TO TAKE:
${safetyPlan.personalItems.filter(item => item.trim()).join('\n')}

REMEMBER:
- Trust your instincts
- Your safety is the priority
- You are not alone
- Call 911 if in immediate danger
- National Domestic Violence Hotline: 1-800-799-7233
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safety-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    const step = safetySteps[currentStep];

    switch (step.component) {
      case 'contacts':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              List people you can contact in an emergency. Include trusted friends, family members,
              or professionals who can help you quickly.
            </p>
            {safetyPlan.emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Contact {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={contact.name}
                    onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={contact.phone}
                    onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Relationship"
                    value={contact.relationship}
                    onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEmergencyContact}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add another contact
            </button>
          </div>
        );

      case 'locations':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              Identify safe places you can go day or night. Consider police stations, fire departments,
              hospitals, or homes of trusted friends or family.
            </p>
            {safetyPlan.safeLocations.map((location, index) => (
              <input
                key={index}
                type="text"
                placeholder="Safe location (address or description)"
                value={location}
                onChange={(e) => updateField('safeLocations', index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ))}
            <button
              onClick={() => addField('safeLocations')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add another location
            </button>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              Check the documents you should gather and keep in a safe place (like with a trusted friend).
              Consider making copies and storing them separately.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {importantDocuments.map((document, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyPlan.importantDocuments.includes(document)}
                    onChange={() => handleDocumentToggle(document)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{document}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'warnings':
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              Think about the warning signs that violence may be about to occur.
              These might include changes in behavior, tone of voice, or specific phrases.
            </p>
            {safetyPlan.warningSignals.map((signal, index) => (
              <input
                key={index}
                type="text"
                placeholder="Warning signal or behavior"
                value={signal}
                onChange={(e) => updateField('warningSignals', index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ))}
            <button
              onClick={() => addField('warningSignals')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add another warning signal
            </button>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Your Safety Plan is Ready
                </h3>
              </div>
              <p className="text-green-700 dark:text-green-300 mb-4">
                You've created a comprehensive safety plan. Remember to review and update it regularly
                as your situation changes.
              </p>
              <button
                onClick={downloadPlan}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Your Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Emergency Contacts</h4>
                <div className="space-y-1">
                  {safetyPlan.emergencyContacts.filter(c => c.name && c.phone).map((contact, index) => (
                    <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.name} - {contact.phone}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Safe Locations</h4>
                <div className="space-y-1">
                  {safetyPlan.safeLocations.filter(loc => loc.trim()).map((location, index) => (
                    <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {location}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {step.description}
            </p>
            <div className="space-y-4">
              {step.questions?.map((question, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">
                    {question}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Take time to think about this question. Your honest assessment will help create a better safety plan.
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  // Get the current step's icon component
  const CurrentStepIcon = safetySteps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <QuickExitButton />

      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Help & Create Your Safety Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Take control of your safety with a personalized plan. We'll guide you through each step
              to help you prepare for various situations.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep + 1} of {safetySteps.length}
              </span>
              <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / safetySteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <CurrentStepIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {safetySteps[currentStep].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {safetySteps[currentStep].description}
                </p>
              </div>
            </div>

            {renderStepContent()}

            <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {safetySteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${index === currentStep
                        ? 'bg-primary-600'
                        : index < currentStep
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(Math.min(safetySteps.length - 1, currentStep + 1))}
                disabled={currentStep === safetySteps.length - 1}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentStep === safetySteps.length - 1 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="bg-primary-50 dark:bg-primary-900/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Additional Support
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              More resources to help you on your journey to safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Talk to SafeSpeak
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get personalized support from our AI assistant
              </p>
              <a
                href="/chat"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Start Chat
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Support Groups
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with others who understand your experience
              </p>
              <a
                href="/resources"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Find Groups
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Crisis Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                24/7 emergency support when you need it most
              </p>
              <a
                href="/emergency"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Get Help Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;