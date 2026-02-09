
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, X, Hash, ChevronRight, Trash2, Heart } from 'lucide-react';
import { useViewerStore } from '../store/useViewerStore';

const BookmarksSidebar: React.FC = () => {
  const { 
    isBookmarksOpen, 
    toggleBookmarksSidebar, 
    bookmarks, 
    toggleBookmark, 
    jumpToPage 
  } = useViewerStore();

  return (
    <AnimatePresence>
      {isBookmarksOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleBookmarksSidebar}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm glass z-[70] border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  My Library
                </h2>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1">
                  {bookmarks.length} Bookmarks Saved
                </p>
              </div>
              <button 
                onClick={toggleBookmarksSidebar}
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {bookmarks.length > 0 ? (
                bookmarks.map((pageNum, idx) => (
                  <motion.div
                    key={`bookmark-${pageNum}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => {
                        jumpToPage(pageNum);
                        toggleBookmarksSidebar();
                      }}
                      className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Bookmarked Page</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Page {pageNum}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(pageNum);
                      }}
                      className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Bookmark className="w-8 h-8 text-white/10" />
                  </div>
                  <h3 className="text-white font-medium mb-2">No bookmarks yet</h3>
                  <p className="text-sm text-white/40 max-w-[200px]">
                    Click the bookmark icon on any page to save it for later.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookmarksSidebar;
