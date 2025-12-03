/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { KeyIcon } from './icons';

interface ApiKeyDialogProps {
  onContinue: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className="bg-blue-600/20 p-4 rounded-full mb-6">
          <KeyIcon className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Setup Your Workspace</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          To enable AI features like Smart Task Analysis and Productivity Insights, please connect your Gemini API key.
        </p>
        <button
          onClick={onContinue}
          className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          Select API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyDialog;
