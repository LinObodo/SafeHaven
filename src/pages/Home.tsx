import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Users, Phone, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import QuickExitButton from '../components/Common/QuickExitButton';

const Home: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'SafeSpeak AI Assistant',
      description: 'Talk to our confidential AI assistant for immediate support and guidance.',
      link: '/chat'
    },
    {
      icon: FileText,
      title: 'Safety Planning',
      description: 'Create a personalized safety plan with emergency contacts and safe locations.',
      link: '/help'
    },
    {
      icon: Users,
      title: 'Support Resources',
      description: 'Access legal aid, counseling services, and community support programs.',
      link: '/resources'
    },
    {
      icon: Phone,
      title: '24/7 Emergency Help',
      description: 'Get immediate assistance when you need it most.',
      link: '/emergency'
    }
  ];

  const testimonials = [
    {
      text: "Safe Haven helped me create a safety plan and connected me with local resources. I finally felt like I had a way forward.",
      author: "Anonymous survivor"
    },
    {
      text: "The SafeSpeak assistant was there for me when I needed someone to talk to at 3 AM. It helped me feel less alone.",
      author: "M.R."
    },
    {
      text: "Thanks to Safe Haven's resources, I was able to find legal help and housing assistance. They saved my life.",
      author: "Anonymous survivor"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-50 to-white dark:from-gray-900 dark:to-gray-800">
      <QuickExitButton />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                <Shield className="h-12 w-12 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              You Are Not <span className="text-primary-600">Alone</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Safe Haven provides confidential support, resources, and safety planning for survivors of domestic violence. 
              Get help discreetly, access resources, and connect with support services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chat"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Talk to SafeSpeak</span>
              </Link>
              <Link
                to="/help"
                className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                Get Help Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-50 dark:bg-red-900/20 border-y border-red-200 dark:border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-4 text-center">
            <Phone className="h-6 w-6 text-red-600" />
            <p className="text-red-800 dark:text-red-200">
              <span className="font-semibold">Emergency?</span> Call Emergency line or the National Domestic Violence Hotline: 
              <span className="font-mono ml-2 text-lg">+234 80-6467-9774</span>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Safe Haven Can Help
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform offers multiple ways to get support, all designed with your safety and privacy in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/30 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center justify-center text-primary-600 group-hover:text-primary-700 transition-colors">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-primary-50 dark:bg-primary-900/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Making a Difference
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our impact in supporting survivors and their families
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg">People helped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg">Support available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300 text-lg">Resources provided</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Stories of Hope
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real experiences from survivors who found help through Safe Haven
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-2 w-2 bg-primary-400 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take the First Step?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Your safety matters. Start with a confidential conversation with SafeSpeak, 
            or browse our resources to learn more about your options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Chat with SafeSpeak
            </Link>
            <Link
              to="/resources"
              className="bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-primary-500"
            >
              Browse Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;