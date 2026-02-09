
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { Document, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { useViewerStore } from '../store/useViewerStore';
import PDFPage from './PDFPage';
import { motion } from 'framer-motion';
import { useSound } from '../hooks/useSound';
import { SearchIndexItem, TOCItem } from '../types';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FlipBookViewer: React.FC = () => {
  const { 
    pdfUrl, 
    setTotalPages, 
    setCurrentPage, 
    zoomLevel,
    viewMode,
    flipAnimation,
    nextPageTrigger,
    prevPageTrigger,
    jumpToPageTrigger,
    isFullscreen,
    setIsIndexing,
    setSearchIndex,
    setOutline
  } = useViewerStore();
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1.414);
  const [isMobile, setIsMobile] = useState(false);
  
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialJumpRef = useRef(false);
  const { playFlip } = useSound();

  useEffect(() => {
    setIsLoaded(false);
    setNumPages(null);
    setError(null);
    isInitialJumpRef.current = false;
  }, [pdfUrl]);

  const flippingTime = flipAnimation === 'instant' ? 100 : flipAnimation === 'quick' ? 400 : 800;

  const updateDimensions = useCallback((width: number, height: number, mobile: boolean, currentRatio: number, full: boolean) => {
    // Ensure we don't calculate with zero or negative container dimensions
    if (width <= 0 || height <= 0) return;

    const padding = mobile ? 40 : (full ? 80 : 120);
    const availableWidth = Math.max(100, width - padding);
    const availableHeight = Math.max(100, height - padding);

    const targetPageWidth = mobile ? availableWidth : availableWidth / 2;
    const calculatedHeight = targetPageWidth * currentRatio; 

    let finalPageWidth = targetPageWidth;
    let finalHeight = calculatedHeight;

    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalPageWidth = finalHeight / currentRatio;
    }

    // React-pageflip requires positive integers for dimensions
    setDimensions({ 
      width: Math.max(1, Math.floor(finalPageWidth)), 
      height: Math.max(1, Math.floor(finalHeight)) 
    });
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        const mobile = width < 768;
        setIsMobile(mobile);
        updateDimensions(width, height, mobile, aspectRatio, isFullscreen);
      }
    });

    observer.observe(containerRef.current);
    
    if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const mobile = clientWidth < 768;
        setIsMobile(mobile);
        updateDimensions(clientWidth, clientHeight, mobile, aspectRatio, isFullscreen);
    }

    return () => observer.disconnect();
  }, [aspectRatio, updateDimensions, isFullscreen]);

  const onDocumentLoadSuccess = async (pdf: any) => {
    setNumPages(pdf.numPages);
    setTotalPages(pdf.numPages);
    
    try {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const newRatio = viewport.height / viewport.width;
      setAspectRatio(newRatio);
      
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        updateDimensions(clientWidth, clientHeight, clientWidth < 768, newRatio, isFullscreen);
      }

      const rawOutline = await pdf.getOutline();
      if (rawOutline) {
        const processOutline = async (items: any[]): Promise<TOCItem[]> => {
          return Promise.all(items.map(async (item) => {
            let pageNum: number | null = null;
            if (item.dest) {
              try {
                const dest = typeof item.dest === 'string' 
                  ? await pdf.getDestination(item.dest) 
                  : item.dest;
                if (dest && dest[0]) {
                  pageNum = (await pdf.getPageIndex(dest[0])) + 1;
                }
              } catch (e) {
                console.warn("Could not resolve TOC destination", e);
              }
            }
            return {
              title: item.title,
              pageNumber: pageNum,
              items: item.items ? await processOutline(item.items) : []
            };
          }));
        };
        const processed = await processOutline(rawOutline);
        setOutline(processed);
      }

      setIsIndexing(true);
      const index: SearchIndexItem[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const p = await pdf.getPage(i);
        const textContent = await p.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(' ');
        index.push({ pageNumber: i, content: text });
        if (i % 15 === 0) await new Promise(r => setTimeout(r, 0));
      }
      setSearchIndex(index);
      setIsIndexing(false);

    } catch (e) {
      console.warn("Error processing PDF", e);
      setIsIndexing(false);
    }
    
    setIsLoaded(true);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('PDF Load Error:', err);
    setError(err.message);
    setIsLoaded(false);
  };

  const onFlip = (e: any) => {
    const newPageNum = e.data + 1;
    setCurrentPage(newPageNum);
    playFlip();

    // Deep Linking: Update URL with current page
    // Wrapped in try-catch to avoid SecurityError in blob: environments
    try {
      const url = new URL(window.location.href);
      if (url.protocol !== 'blob:') {
        url.searchParams.set('page', newPageNum.toString());
        window.history.replaceState({}, '', url.toString());
      }
    } catch (err) {
      console.debug('Failed to update history state:', err);
    }
  };

  // Deep Link Initial Jump
  useEffect(() => {
    if (isLoaded && numPages && bookRef.current && !isInitialJumpRef.current) {
      try {
        const params = new URLSearchParams(window.location.search);
        const pageParam = params.get('page');
        if (pageParam) {
          const page = parseInt(pageParam, 10);
          if (!isNaN(page) && page >= 1 && page <= numPages) {
            isInitialJumpRef.current = true;
            setTimeout(() => {
              if (bookRef.current) {
                bookRef.current.pageFlip().turnToPage(page - 1);
              }
            }, 300);
          }
        }
      } catch (err) {
        console.debug('Failed to parse deep link params:', err);
      }
    }
  }, [isLoaded, numPages]);

  useEffect(() => {
    if (nextPageTrigger > 0 && bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  }, [nextPageTrigger]);

  useEffect(() => {
    if (prevPageTrigger > 0 && bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  }, [prevPageTrigger]);

  useEffect(() => {
    if (jumpToPageTrigger && bookRef.current) {
      bookRef.current.pageFlip().turnToPage(jumpToPageTrigger.page - 1);
    }
  }, [jumpToPageTrigger]);

  const zoomStyle = {
    transform: `scale(${zoomLevel / 100})`,
    transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
  };

  if (viewMode === 'grid') {
    return (
      <div className="w-full h-full overflow-y-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 scroll-smooth custom-scrollbar">
        <Document 
          file={pdfUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
        >
          {Array.from(new Array(numPages || 0), (el, index) => (
            <motion.div 
              key={`grid-page-${index + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index * 0.02, 0.5) }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="cursor-pointer group flex flex-col"
              onClick={() => {
                setCurrentPage(index + 1);
                useViewerStore.getState().toggleViewMode();
                try {
                  const url = new URL(window.location.href);
                  if (url.protocol !== 'blob:') {
                    url.searchParams.set('page', (index + 1).toString());
                    window.history.replaceState({}, '', url.toString());
                  }
                } catch (err) {
                  console.debug('Failed to update history state:', err);
                }
              }}
            >
              <div className="rounded-xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border border-white/5 bg-neutral-900 aspect-[1/1.414] relative ring-1 ring-white/5 group-hover:ring-indigo-500/50 transition-all">
                <PDFPage pageNumber={index + 1} width={220} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                 <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold group-hover:text-white/80 transition-colors">Page {index + 1}</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 scale-0 group-hover:scale-100 transition-transform shadow-[0_0_8px_rgba(99,102,241,1)]" />
              </div>
            </motion.div>
          ))}
        </Document>
      </div>
    );
  }

  const overhang = 10;
  const coverWidth = isMobile ? dimensions.width + (overhang * 2) : (dimensions.width * 2) + (overhang * 2);
  const coverHeight = dimensions.height + (overhang * 2);

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-4 bg-[#0a0a0a]/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">Rendering Document</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 space-y-4 bg-[#0a0a0a]">
          <div className="text-red-500/80 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-white font-medium">Failed to load document</p>
          <p className="text-white/40 text-xs max-w-xs text-center">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-all">Retry</button>
        </div>
      )}

      <div style={zoomStyle} className="relative flex items-center justify-center">
        {/* Only render cover and flipbook if dimensions are valid */}
        {dimensions.width > 0 && dimensions.height > 0 && (
          <>
            {/* Hardcover Back Simulation */}
            <div 
              className="absolute z-0 texture-leather rounded-lg transition-all duration-500 ease-out"
              style={{
                width: coverWidth,
                height: coverHeight,
                boxShadow: '0 50px 100px -20px rgba(0,0,0,1), inset 0 0 40px rgba(0,0,0,0.5)'
              }}
            >
              {/* Spine Crease on Cover */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 bg-black/40 blur-[2px]" />
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
            </div>

            <div className="relative z-10">
              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={null}>
                {isLoaded && numPages && (
                  <HTMLFlipBook
                    key={`${aspectRatio}-${isMobile}-${isFullscreen}-${dimensions.width}-${dimensions.height}`}
                    ref={bookRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    size="fixed"
                    minWidth={dimensions.width}
                    maxWidth={2000}
                    minHeight={dimensions.height}
                    maxHeight={2000}
                    maxShadowOpacity={0.7}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onFlip}
                    className="flipbook-container"
                    style={{ background: 'transparent' }}
                    startPage={useViewerStore.getState().currentPage - 1}
                    drawShadow={true}
                    flippingTime={flippingTime}
                    usePortrait={isMobile} 
                    startZIndex={0}
                    autoSize={true}
                    clickEventForward={true}
                    useMouseEvents={true}
                    swipeDistance={30}
                    showPageCorners={true}
                    disableFlipByClick={false}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <PDFPage key={`page-${index + 1}`} pageNumber={index + 1} width={dimensions.width} />
                    ))}
                  </HTMLFlipBook>
                )}
              </Document>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlipBookViewer;
