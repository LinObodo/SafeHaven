import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Clock, AlertTriangle, Shield, Heart, UserPlus, Trash2, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useEmergencyContactsStore } from '../store/emergencyContactsStore';
import QuickExitButton from '../components/Common/QuickExitButton';

const Emergency: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { contacts, loading: contactsLoading, saving, error, loadContacts, addContact, deleteContact } =
    useEmergencyContactsStore();
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadContacts();
    }
  }, [isAuthenticated, loadContacts]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const result = await addContact(newContact);
    if (result.error) {
      setFormError(result.error);
    } else {
      setNewContact({ name: '', phone: '', relationship: '' });
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const emergencyContacts = [
    {
      id: 'police',
      name: 'Emergency Services',
      number: '199',
      description: 'For immediate life-threatening emergencies',
      icon: Phone,
      color: 'bg-red-600',
      available: '24/7'
    },
    {
      id: 'hotline',
      name: 'National Domestic Violence Hotline',
      number: '+234 80-6467-9774',
      description: 'Confidential support and resources',
      icon: Heart,
      color: 'bg-purple-600',
      available: '24/7'
    },
    // {
    //   id: 'crisis',
    //   name: 'Crisis Text Line',
    //   number: 'Text HOME to 741741',
    //   description: 'Free, confidential crisis support via text',
    //   icon: MessageCircle,
    //   color: 'bg-blue-600',
    //   available: '24/7'
    // },
    {
      id: 'shelter',
      name: 'Safe Haven Support',
      number: '+2347032861486',
      description: 'Direct support and emergency assistance',
      icon: Shield,
      color: 'bg-green-600',
      available: '24/7'
    }
  ];

  const safetyTips = [
    {
      icon: Phone,
      title: 'Keep Your Phone Charged',
      description: 'Always keep your phone charged and easily accessible for emergency calls.'
    },
    {
      icon: MapPin,
      title: 'Know Safe Locations',
      description: 'Identify safe places you can go: police stations, fire departments, hospitals, or trusted friends/family.'
    },
    {
      icon: Clock,
      title: 'Plan Your Timing',
      description: 'If possible, plan to leave when the abuser is not home or is sleeping.'
    },
    {
      icon: Shield,
      title: 'Trust Your Instincts',
      description: 'If you feel you are in immediate danger, trust your instincts and seek help immediately.'
    }
  ];

  const codeWords = [
    {
      word: 'Plan',
      meaning: 'I need help creating a safety plan'
    },
    {
      word: 'Ready',
      meaning: 'I am prepared to leave and need support'
    },
    {
      word: 'Rescue',
      meaning: 'I need immediate help to get out safely'
    },
    {
      word: 'Order issue',
      meaning: 'There is a problem and I need assistance'
    },
    {
      word: 'Help now',
      meaning: 'I need immediate emergency assistance'
    }
  ];

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <QuickExitButton />
      
      {/* Header */}
      <section className="bg-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Emergency Resources
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              If you are in immediate danger, use these resources to get help right away. 
              Your safety is the most important thing.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Warning */}
      <section className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-semibold text-lg">
                If you are in immediate physical danger, call 199 now.
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                Do not hesitate - your life is more important than anything else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Emergency Contacts
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              These numbers are available 24/7 for immediate assistance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${contact.color}`}>
                    <contact.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {contact.name}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {contact.number}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {contact.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Available {contact.available}
                      </span>
                      <button
                        onClick={() => handleCall(contact.number)}
                        className={`px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity ${contact.color}`}
                      >
                        Call Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Trusted Contacts */}
      <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Users className="h-10 w-10 text-primary-600 mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Trusted Contacts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Save people you trust so you can reach them with one tap in an emergency.
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Saved contacts */}
          <div className="max-w-3xl mx-auto">
            {contactsLoading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading your contacts...</p>
            ) : contacts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                You haven't added any trusted contacts yet. Add one below.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 flex items-start justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {contact.phone}
                      </p>
                      {contact.relationship && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {contact.relationship}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                      <button
                        onClick={() => handleCall(contact.phone)}
                        className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center space-x-1"
                        title={`Call ${contact.name}`}
                      >
                        <Phone className="h-4 w-4" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title={`Delete ${contact.name}`}
                        aria-label={`Delete ${contact.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add contact form */}
            <form
              onSubmit={handleAddContact}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-primary-600" />
                <span>Add a trusted contact</span>
              </h3>

              {formError && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">{formError}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Relationship (optional)"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, relationship: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Add Contact'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Safety Code Words */}
      <section className="bg-primary-50 dark:bg-primary-900/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Emergency Code Words
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Use these code words in SafeSpeak chat to quickly get appropriate help
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeWords.map((code, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg font-mono text-lg font-semibold mb-3">
                    "{code.word}"
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {code.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a
              href="/chat"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Talk to SafeSpeak</span>
            </a>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Emergency Safety Tips
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Important reminders to help keep you safe in emergency situations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyTips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                  <tip.icon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Additional Support
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              More resources and support options are available to help you
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/resources"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
            >
              Browse All Resources
            </a>
            <a
              href="/help"
              className="bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 px-6 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center"
            >
              Create Safety Plan
            </a>
            <a
              href="/about"
              className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-center"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Emergency;