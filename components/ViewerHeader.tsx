
import React, { useRef, useState } from 'react';
import { Download, Share2, MoreVertical, FileUp, Search, List, Bookmark, Check } from 'lucide-react';
import { useViewerStore } from '../store/useViewerStore';

const ViewerHeader: React.FC = () => {
  const { 
    documentTitle, 
    setPdfUrl, 
    setDocumentTitle, 
    toggleSearch, 
    toggleTOC, 
    toggleBookmarksSidebar,
    bookmarks,
    currentPage
  } = useViewerStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setDocumentTitle(file.name.replace(/\.pdf$/i, ''));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 glass border-b border-white/10">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-indigo-500/20">
          LP
        </div>
        <h1 className="text-sm font-medium text-white/90 tracking-tight truncate max-w-[150px] md:max-w-md">
          {documentTitle}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="application/pdf" 
          className="hidden" 
        />
        
        <button 
          onClick={triggerFileInput}
          className="flex items-center space-x-2 px-4 py-1.5 bg-white/5 text-white text-xs font-semibold rounded-full hover:bg-white/10 transition-all active:scale-95 border border-white/10"
        >
          <FileUp className="w-4 h-4" />
          <span className="hidden sm:inline">Open PDF</span>
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />

        <button 
          onClick={toggleTOC}
          className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
          title="Table of Contents"
        >
          <List className="w-5 h-5" />
        </button>

        <button 
          onClick={toggleSearch}
          className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
          title="Search in document"
        >
          <Search className="w-5 h-5" />
        </button>

        <button 
          onClick={toggleBookmarksSidebar}
          className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5 relative"
          title="My Bookmarks"
        >
          <Bookmark className="w-5 h-5" />
          {bookmarks.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-black shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          )}
        </button>

        <button 
          onClick={handleShare}
          className={`p-2 transition-all rounded-full hover:bg-white/5 flex items-center gap-2 group
            ${copied ? 'text-green-400' : 'text-white/60 hover:text-white'}
          `}
          title="Share deep link to this page"
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          {copied && <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline animate-in fade-in slide-in-from-right-2">Link Copied</span>}
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-white/5">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
        
        <button className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default ViewerHeader;
