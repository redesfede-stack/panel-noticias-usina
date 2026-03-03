
import React from 'react';
import { ToastMessage } from '../types';
import { X } from './icons';

interface ToastProps {
  message: ToastMessage;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const baseClasses = "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";
  const variantClasses = {
    success: 'border-l-4 border-green-500',
    destructive: 'border-l-4 border-red-500',
    info: 'border-l-4 border-blue-500',
  };

  const icons = {
    success: '✅',
    destructive: '❌',
    info: 'ℹ️'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className={`${baseClasses} ${variantClasses[message.variant]}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-xl">{icons[message.variant]}</span>
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{message.title}</p>
              <p className="mt-1 text-sm text-gray-500">{message.description}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={onClose}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
