import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Download, Upload, Copy, Check, Share, FileJson } from 'lucide-react';

export const ExportImport: React.FC = () => {
  const { getCurrentDeviceCards, exportData, importData } = useStore();
  const [copied, setCopied] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const cards = getCurrentDeviceCards();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bento-grid-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    const data = exportData();
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImporting(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importData(data);
          setImporting(false);
        } catch (error) {
          console.error('Import failed:', error);
          setImporting(false);
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const generateShareableLink = () => {
    const data = exportData();
    const encoded = btoa(data);
    const url = `${window.location.origin}${window.location.pathname}#import=${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Export & Import</h3>
        <p className="text-sm text-gray-400 mb-4">
          Save your Bento Grid configuration or share it with others.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-indigo-400">{cards.length}</div>
          <div className="text-sm text-gray-400">Total Cards</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-purple-400">
            {new Date().toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-400">Last Modified</div>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-white">Export Options</h4>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 hover:from-indigo-500/30 hover:to-purple-600/30 transition-all"
        >
          <Download size={20} />
          <div className="text-left">
            <div className="font-medium">Download JSON File</div>
            <div className="text-sm text-gray-400">Save your configuration locally</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyToClipboard}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
          <div className="text-left">
            <div className="font-medium">Copy to Clipboard</div>
            <div className="text-sm text-gray-400">
              {copied ? 'Copied!' : 'Copy JSON data to clipboard'}
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateShareableLink}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <Share size={20} />
          <div className="text-left">
            <div className="font-medium">Generate Share Link</div>
            <div className="text-sm text-gray-400">
              {copied ? 'Link copied!' : 'Create shareable URL'}
            </div>
          </div>
        </motion.button>
      </div>

      {/* Import Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-white">Import Options</h4>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={20} />
          <div className="text-left">
            <div className="font-medium">
              {importing ? 'Importing...' : 'Import JSON File'}
            </div>
            <div className="text-sm text-gray-400">
              Load configuration from file
            </div>
          </div>
        </motion.button>
      </div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
      >
        <div className="flex items-start gap-3">
          <FileJson size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-400 mb-1">Import Warning</h4>
            <p className="text-sm text-gray-400">
              Importing will replace your current configuration. Make sure to export your current setup first if you want to keep it.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};