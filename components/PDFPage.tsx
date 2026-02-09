
import React from 'react';
import { Page } from 'react-pdf';
import { Bookmark } from 'lucide-react';
import { useViewerStore } from '../store/useViewerStore';

interface PDFPageProps {
  pageNumber: number;
  width: number;
}

const PDFPage = React.forwardRef<HTMLDivElement, PDFPageProps>((props, ref) => {
  const { pageNumber, width } = props;
  const isEven = pageNumber % 2 === 0;
  const { bookmarks, toggleBookmark } = useViewerStore();
  const isBookmarked = bookmarks.includes(pageNumber);
  
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  return (
    <div 
      ref={ref} 
      className="texture-paper shadow-2xl overflow-hidden relative group/page"
      data-density="hard"
    >
      {/* Background Lighting Layer - Subtle vertical gradient across the whole page */}
      <div className={`absolute inset-0 z-0 pointer-events-none
        ${isEven 
          ? 'bg-gradient-to-l from-black/5 via-transparent to-white/5' 
          : 'bg-gradient-to-r from-black/5 via-transparent to-white/5'}
      `} />

      <Page 
        pageNumber={pageNumber} 
        width={width}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        devicePixelRatio={dpr}
        className="flex items-center justify-center relative z-0"
        loading={<div className="texture-paper animate-pulse" />}
      />
      
      {/* Bookmark Ribbon */}
      {isBookmarked && (
        <div className="absolute top-0 right-8 z-40 animate-in fade-in slide-in-from-top-4 duration-500">
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            <path d="M0 0H24V36L12 30L0 36V0Z" fill="#ef4444" />
            <path d="M12 30L0 36V38L12 32L24 38V36L12 30Z" fill="#991b1b" />
          </svg>
        </div>
      )}

      {/* Bookmark Toggle Button (Visible on Hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(pageNumber);
        }}
        className={`absolute top-4 right-4 z-40 p-2 rounded-full backdrop-blur-md transition-all duration-300
          ${isBookmarked 
            ? 'bg-red-500 text-white opacity-100' 
            : 'bg-black/20 text-white/40 opacity-0 group-hover/page:opacity-100 hover:bg-black/40 hover:text-white'}
        `}
      >
        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
      </button>
      
      {/* Dynamic Spine Lighting - Mimics the depth of the center fold */}
      <div className={`absolute top-0 bottom-0 w-[20%] pointer-events-none z-10
        ${isEven 
          ? 'right-0 bg-gradient-to-l from-black/40 via-black/10 to-transparent' 
          : 'left-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent'}
      `} />

      {/* Extreme Spine Crease - The very center line */}
      <div className={`absolute top-0 bottom-0 w-[2px] z-20
        ${isEven ? 'right-0 bg-black/60 shadow-[-1px_0_4px_rgba(0,0,0,0.5)]' : 'left-0 bg-black/60 shadow-[1px_0_4px_rgba(0,0,0,0.5)]'}
      `} />

      {/* Page Surface Highlight - Outer edge lighting */}
      <div className={`absolute top-0 bottom-0 w-[40%] pointer-events-none z-10
        ${isEven 
          ? 'left-0 bg-gradient-to-r from-white/10 via-transparent to-transparent' 
          : 'right-0 bg-gradient-to-l from-white/10 via-transparent to-transparent'}
      `} />
      
      {/* Page Edge Trim - Subtle white line at the outer edge for thickness simulation */}
      <div className={`absolute top-0 bottom-0 w-[1px] bg-white/20 z-20
        ${isEven ? 'left-0' : 'right-0'}
      `} />

      {/* Subtle Bottom Page Shadow for weight */}
      <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10" />
      
      {/* Page Number Overlay */}
      <div className={`absolute bottom-4 ${isEven ? 'left-6' : 'right-6'} text-[10px] text-black/30 font-bold select-none tracking-widest bg-black/5 px-2 py-0.5 rounded-sm z-30`}>
        {pageNumber}
      </div>
    </div>
  );
});

PDFPage.displayName = 'PDFPage';

export default PDFPage;
