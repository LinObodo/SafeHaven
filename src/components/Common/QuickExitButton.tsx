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
      className={`fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-center space-x-1 sm:space-x-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors touch-target ${className}`}
      title="Quickly exit to a safe site"
    >
      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="text-xs sm:text-sm">Exit</span>
    </button>
  );
};

export default QuickExitButton;