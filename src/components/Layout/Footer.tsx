import React from 'react';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">Safe Haven</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Providing confidential support, resources, and safety planning for survivors of domestic violence. 
              You are not alone, and help is available 24/7.
            </p>
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-300 font-semibold mb-2">Emergency Resources</p>
              <p className="text-sm text-red-200">
                National Domestic Violence Hotline: <br />
                <span className="font-mono text-lg">+234 80-6467-9774</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-300 hover:text-white transition-colors">Get Help</a></li>
              <li><a href="/resources" className="text-gray-300 hover:text-white transition-colors">Resources</a></li>
              <li><a href="/chat" className="text-gray-300 hover:text-white transition-colors">SafeSpeak</a></li>
              <li><a href="/emergency" className="text-gray-300 hover:text-white transition-colors">Emergency</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+2347032861486</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">obodolin@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary-400 mt-1" />
                <span className="text-gray-300">
                  Confidential location<br />
                  Available 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Safe Haven. All rights reserved. Your privacy and safety are our priority.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;