import React from 'react';
import { Shield, Heart, Users, Award, CheckCircle } from 'lucide-react';
import QuickExitButton from '../components/Common/QuickExitButton';

const About: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety and privacy are our top priorities. All interactions are confidential and secure.'
    },
    {
      icon: Heart,
      title: 'Compassionate Support',
      description: 'We provide empathetic, non-judgmental support to help you through difficult times.'
    },
    {
      icon: Users,
      title: 'Community Connection',
      description: 'We connect you with local resources, support groups, and professional services.'
    },
    {
      icon: Award,
      title: 'Professional Excellence',
      description: 'Our team includes licensed professionals, counselors, and domestic violence experts.'
    }
  ];

  const services = [
    'Crisis intervention and safety planning',
    'Emotional support and counseling referrals',
    'Legal advocacy and court accompaniment',
    'Housing assistance and shelter referrals',
    'Financial resources and job training programs',
    'Childcare and parenting support',
    'Immigration assistance for survivors',
    'Technology safety and digital privacy help'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <QuickExitButton />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Safe Haven
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              We are dedicated to providing confidential support and resources for survivors of domestic violence, 
              helping them find safety, healing, and hope for the future.
            </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">
                Safe Haven exists to empower survivors of domestic violence by providing accessible, 
                confidential support services and resources. We believe that everyone deserves to live 
                free from violence and fear.
              </p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
                Through our innovative platform, we combine technology with human compassion to create 
                a safe space where survivors can access help discreetly, plan for their safety, and 
                connect with the support they need to rebuild their lives.
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
                  Our Promise
                </h3>
                <p className="text-primary-800 dark:text-primary-200">
                  We promise to provide judgment-free support, maintain your confidentiality, 
                  and respect your autonomy in making decisions about your safety and future.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Support and care"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <value.icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/5699479/pexels-photo-5699479.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Community support"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our comprehensive services are designed to support survivors at every stage of their journey, 
                from crisis intervention to long-term recovery and empowerment.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Since our founding, we've been making a meaningful difference in the lives of survivors and their families.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Lives Touched</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Safety Plans Successful</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Community Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Safe Haven is powered by a dedicated team of professionals, advocates, and volunteers 
              who are passionate about supporting survivors.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Licensed Counselors
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Mental health professionals specializing in trauma and domestic violence recovery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Legal Advocates
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Attorneys and paralegals who understand the legal complexities survivors face.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Community Partners
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Local organizations, shelters, and service providers working together for survivors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-ivory-50 dark:bg-gray-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Have questions about our services? Need help getting started? We're here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:obodolin@gmail.com"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/chat"
              className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              Start with SafeSpeak
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;