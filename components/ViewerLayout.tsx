
import React, { useEffect, useRef, useState } from 'react';
import ViewerHeader from './ViewerHeader';
import ViewerControls from './ViewerControls';
import SearchSidebar from './SearchSidebar';
import TOCSidebar from './TOCSidebar';
import BookmarksSidebar from './BookmarksSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewerStore } from '../store/useViewerStore';
import { Clock, Check, X as CloseIcon } from 'lucide-react';

interface ViewerLayoutProps {
  children: React.ReactNode;
}

const ViewerLayout: React.FC<ViewerLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    isFullscreen, 
    setFullscreen, 
    resumePage, 
    clearResume, 
    jumpToPage,
    pdfUrl
  } = useViewerStore();

  const [hasPageParam, setHasPageParam] = useState(false);

  // Initialize store state on mount/url change
  useEffect(() => {
    useViewerStore.getState().setPdfUrl(pdfUrl);
    
    // Check if deep linking is active
    const params = new URLSearchParams(window.location.search);
    setHasPageParam(params.has('page'));
  }, [pdfUrl]);

  // Sync isFullscreen store state with browser Fullscreen API
  useEffect(() => {
    if (!containerRef.current) return;

    const handleFullscreenChange = () => {
      const isActuallyFullscreen = !!document.fullscreenElement;
      if (isActuallyFullscreen !== isFullscreen) {
        setFullscreen(isActuallyFullscreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    if (isFullscreen && !document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
        setFullscreen(false);
      });
    } else if (!isFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen, setFullscreen]);

  // Only show resume if there's no page param in the URL (which would override resume)
  const showResumeToast = resumePage && resumePage > 1 && !hasPageParam;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0c0c0c] text-neutral-100 flex flex-col"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <ViewerHeader />
      <SearchSidebar />
      <TOCSidebar />
      <BookmarksSidebar />

      {/* Resume Progress Toast */}
      <AnimatePresence>
        {showResumeToast && (
          <motion.div
            initial={{ y: -50, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: -50, opacity: 0, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none"
          >
            <div className="glass p-4 rounded-2xl flex items-center justify-between shadow-2xl ring-1 ring-white/10 pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Resume Progress?</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">You were on Page {resumePage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    jumpToPage(resumePage);
                    clearResume();
                  }}
                  className="p-2 bg-white text-black rounded-full hover:bg-neutral-200 transition-all active:scale-90"
                  title="Resume"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={clearResume}
                  className="p-2 bg-white/5 text-white/40 rounded-full hover:bg-white/10 hover:text-white transition-all"
                  title="Dismiss"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative flex-1 w-full flex items-center justify-center p-4 md:p-8 z-10 pt-20 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key="viewer-content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <ViewerControls />
    </div>
  );
};

export default ViewerLayout;
