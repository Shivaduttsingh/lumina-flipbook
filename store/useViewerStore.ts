
import { create } from 'zustand';
import { ViewerStore, ViewMode, FlipAnimation, SearchResult } from '../types';

// Helper to get a storage key based on PDF URL
const getStorageKey = (url: string, suffix: string) => `lumina-${btoa(url).substring(0, 16)}-${suffix}`;

export const useViewerStore = create<ViewerStore>((set, get) => ({
  currentPage: 1,
  totalPages: 1,
  zoomLevel: 100,
  isSoundEnabled: true,
  isFullscreen: false,
  viewMode: 'flip',
  flipAnimation: 'smooth',
  documentTitle: 'Lumina Premium Showcase',
  pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  nextPageTrigger: 0,
  prevPageTrigger: 0,
  jumpToPageTrigger: null,

  // Search Initial State
  isSearchOpen: false,
  isIndexing: false,
  searchQuery: '',
  searchResults: [],
  searchIndex: [],

  // TOC Initial State
  isTOCOpen: false,
  outline: [],

  // Personalization Initial State
  bookmarks: [],
  isBookmarksOpen: false,
  resumePage: null,

  setCurrentPage: (page) => {
    const { pdfUrl } = get();
    set({ currentPage: page });
    // Persistence: Save progress
    localStorage.setItem(getStorageKey(pdfUrl, 'progress'), page.toString());
  },
  
  setTotalPages: (total) => set({ totalPages: total }),
  incrementZoom: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 25, 200) })),
  decrementZoom: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 25, 50) })),
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setFullscreen: (val) => set({ isFullscreen: val }),
  toggleViewMode: () => set((state) => ({ 
    viewMode: state.viewMode === 'flip' ? 'grid' : 'flip' 
  })),
  setFlipAnimation: (animation) => set({ flipAnimation: animation }),
  setDocumentTitle: (title) => set({ documentTitle: title }),
  
  setPdfUrl: (url) => {
    // Detect existing progress and bookmarks for the new URL
    const savedProgress = localStorage.getItem(getStorageKey(url, 'progress'));
    const savedBookmarks = localStorage.getItem(getStorageKey(url, 'bookmarks'));
    
    set({ 
      pdfUrl: url, 
      currentPage: 1, 
      searchIndex: [], 
      searchResults: [], 
      searchQuery: '',
      isIndexing: false,
      outline: [],
      isTOCOpen: false,
      isSearchOpen: false,
      isBookmarksOpen: false,
      bookmarks: savedBookmarks ? JSON.parse(savedBookmarks) : [],
      resumePage: savedProgress ? parseInt(savedProgress, 10) : null
    });
  },

  triggerNextPage: () => set((state) => ({ nextPageTrigger: state.nextPageTrigger + 1 })),
  triggerPrevPage: () => set((state) => ({ prevPageTrigger: state.prevPageTrigger + 1 })),
  jumpToPage: (page) => set({ jumpToPageTrigger: { page, timestamp: Date.now() } }),

  // Search Actions
  toggleSearch: () => set((state) => ({ 
    isSearchOpen: !state.isSearchOpen,
    isTOCOpen: false,
    isBookmarksOpen: false
  })),
  setSearchQuery: (query) => {
    const { searchIndex } = get();
    if (!query.trim()) {
      set({ searchQuery: query, searchResults: [] });
      return;
    }

    const results: SearchResult[] = searchIndex
      .filter(item => item.content.toLowerCase().includes(query.toLowerCase()))
      .map(item => {
        const index = item.content.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, index - 40);
        const end = Math.min(item.content.length, index + query.length + 40);
        let snippet = item.content.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < item.content.length) snippet = snippet + '...';
        
        return {
          pageNumber: item.pageNumber,
          snippet
        };
      });

    set({ searchQuery: query, searchResults: results });
  },
  setSearchIndex: (index) => set({ searchIndex: index }),
  setIsIndexing: (val) => set({ isIndexing: val }),

  // TOC Actions
  toggleTOC: () => set((state) => ({ 
    isTOCOpen: !state.isTOCOpen,
    isSearchOpen: false,
    isBookmarksOpen: false
  })),
  setOutline: (outline) => set({ outline }),

  // Personalization Actions
  toggleBookmark: (page) => {
    const { bookmarks, pdfUrl } = get();
    const newBookmarks = bookmarks.includes(page) 
      ? bookmarks.filter(p => p !== page)
      : [...bookmarks, page].sort((a, b) => a - b);
    
    set({ bookmarks: newBookmarks });
    localStorage.setItem(getStorageKey(pdfUrl, 'bookmarks'), JSON.stringify(newBookmarks));
  },
  toggleBookmarksSidebar: () => set((state) => ({ 
    isBookmarksOpen: !state.isBookmarksOpen,
    isTOCOpen: false,
    isSearchOpen: false
  })),
  clearResume: () => set({ resumePage: null }),
  setResumePage: (page) => set({ resumePage: page })
}));
