
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Hash, ChevronRight, Loader2, FileText } from 'lucide-react';
import { useViewerStore } from '../store/useViewerStore';

const SearchSidebar: React.FC = () => {
  const { 
    isSearchOpen, 
    toggleSearch, 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isIndexing, 
    jumpToPage,
    totalPages
  } = useViewerStore();
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSearch}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm glass z-[70] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-400" />
                  Smart Search
                </h2>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1">
                  {isIndexing ? 'Indexing Document...' : `${totalPages} Pages Indexed`}
                </p>
              </div>
              <button 
                onClick={toggleSearch}
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input */}
            <div className="p-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  ref={inputRef}
                  type="text"
                  placeholder="Find in document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
                {isIndexing && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin" />
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 custom-scrollbar">
              {searchQuery && searchQuery.length > 0 ? (
                searchResults && searchResults.length > 0 ? (
                  searchResults.map((result, idx) => (
                    <motion.button
                      key={`${result.pageNumber}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        jumpToPage(result.pageNumber);
                        toggleSearch();
                      }}
                      className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          <Hash className="w-3 h-3" />
                          Page {result.pageNumber}
                        </span>
                        <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors" />
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed line-clamp-2 italic">
                        {result.snippet}
                      </p>
                    </motion.button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-sm text-white/40">No matches found for "{searchQuery}"</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-xs text-white/20 uppercase tracking-[0.2em] font-bold">Start typing to search</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchSidebar;
