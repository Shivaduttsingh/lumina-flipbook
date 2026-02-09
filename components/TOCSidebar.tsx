
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X, ChevronRight, ChevronDown, Bookmark, Hash } from 'lucide-react';
import { useViewerStore } from '../store/useViewerStore';
import { TOCItem } from '../types';

const TOCNode: React.FC<{ item: TOCItem; level: number }> = ({ item, level }) => {
  const [isOpen, setIsOpen] = useState(true);
  const jumpToPage = useViewerStore(state => state.jumpToPage);
  const toggleTOC = useViewerStore(state => state.toggleTOC);

  const hasItems = item.items && item.items.length > 0;

  const handleClick = () => {
    if (item.pageNumber !== null) {
      jumpToPage(item.pageNumber);
      // Close sidebar on mobile, keep on desktop? 
      // For now let's just jump.
    }
  };

  return (
    <div className="mb-1">
      <div 
        className={`flex items-center group rounded-lg transition-all cursor-pointer py-2 px-3
          ${item.pageNumber !== null ? 'hover:bg-white/10' : ''}
        `}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasItems ? (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="mr-2 text-white/20 hover:text-white/60 transition-colors"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-4 h-4 mr-2" />
        )}
        
        <span 
          onClick={handleClick}
          className={`flex-1 text-sm truncate transition-colors
            ${item.pageNumber !== null ? 'text-white/80 group-hover:text-white' : 'text-white/40 font-medium'}
          `}
        >
          {item.title}
        </span>

        {item.pageNumber !== null && (
          <span className="text-[10px] font-bold text-white/20 group-hover:text-indigo-400 ml-2 transition-colors tabular-nums">
            {item.pageNumber}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {item.items.map((subItem, idx) => (
              <TOCNode key={`${subItem.title}-${idx}`} item={subItem} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TOCSidebar: React.FC = () => {
  const { isTOCOpen, toggleTOC, outline } = useViewerStore();

  return (
    <AnimatePresence>
      {isTOCOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleTOC}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-sm glass z-[70] border-r border-white/10 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-indigo-400" />
                  Outline
                </h2>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1">
                  Document Chapters
                </p>
              </div>
              <button 
                onClick={toggleTOC}
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {outline && outline.length > 0 ? (
                outline.map((item, idx) => (
                  <TOCNode key={`${item.title}-${idx}`} item={item} level={0} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <List className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-sm text-white/40">No outline found in this document.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TOCSidebar;
