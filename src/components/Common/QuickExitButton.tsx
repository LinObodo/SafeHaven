import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface QuickExitButtonProps {
  className?: string;
}

const QuickExitButton: React.FC<QuickExitButtonProps> = ({ className = '' }) => {
  const { quickExit } = useAuthStore();

  return (
    <button
      onClick={quickExit}
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors ${className}`}
      title="Quickly exit to a safe site"
    >
      <ExternalLink className="h-4 w-4" />
      <span className="hidden sm:inline">Quick Exit</span>
    </button>
  );
};

export default QuickExitButton;