
export type ViewMode = 'flip' | 'grid';
export type FlipAnimation = 'smooth' | 'quick' | 'instant';

export interface SearchIndexItem {
  pageNumber: number;
  content: string;
}

export interface SearchResult {
  pageNumber: number;
  snippet: string;
}

export interface TOCItem {
  title: string;
  pageNumber: number | null;
  items: TOCItem[];
}

export interface ViewerState {
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  isSoundEnabled: boolean;
  isFullscreen: boolean;
  viewMode: ViewMode;
  flipAnimation: FlipAnimation;
  documentTitle: string;
  nextPageTrigger: number;
  prevPageTrigger: number;
  jumpToPageTrigger: { page: number; timestamp: number } | null;
  pdfUrl: string;
  // Search State
  isSearchOpen: boolean;
  isIndexing: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  searchIndex: SearchIndexItem[];
  // TOC State
  isTOCOpen: boolean;
  outline: TOCItem[];
  // Personalization State
  bookmarks: number[];
  isBookmarksOpen: boolean;
  resumePage: number | null;
}

export interface ViewerActions {
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  incrementZoom: () => void;
  decrementZoom: () => void;
  toggleSound: () => void;
  toggleFullscreen: () => void;
  setFullscreen: (val: boolean) => void;
  toggleViewMode: () => void;
  setFlipAnimation: (animation: FlipAnimation) => void;
  setDocumentTitle: (title: string) => void;
  setPdfUrl: (url: string) => void;
  triggerNextPage: () => void;
  triggerPrevPage: () => void;
  jumpToPage: (page: number) => void;
  // Search Actions
  toggleSearch: () => void;
  setSearchQuery: (query: string) => void;
  setSearchIndex: (index: SearchIndexItem[]) => void;
  setIsIndexing: (val: boolean) => void;
  // TOC Actions
  toggleTOC: () => void;
  setOutline: (outline: TOCItem[]) => void;
  // Personalization Actions
  toggleBookmark: (page: number) => void;
  toggleBookmarksSidebar: () => void;
  clearResume: () => void;
  setResumePage: (page: number | null) => void;
}

export type ViewerStore = ViewerState & ViewerActions;
