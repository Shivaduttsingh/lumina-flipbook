
import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Volume2, 
  VolumeX,
  BookOpen,
  Zap,
  Wind,
  Layers,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useViewerStore } from '../store/useViewerStore';
import { FlipAnimation } from '../types';

const ControlButton: React.FC<{ 
  onClick?: () => void; 
  icon: React.ReactNode; 
  label?: string;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
}> = ({ onClick, icon, label, active, disabled, tooltip }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    title={tooltip}
    className={`p-3 flex flex-col items-center justify-center rounded-xl transition-all duration-200 group
      ${active ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/5'}
      ${disabled ? 'opacity-20 cursor-not-allowed' : 'active:scale-90'}
    `}
  >
    {icon}
    {label && <span className="text-[10px] mt-1 uppercase tracking-widest font-bold opacity-60 group-hover:opacity-100">{label}</span>}
  </button>
);

const ViewerControls: React.FC = () => {
  const { 
    currentPage, 
    totalPages, 
    isSoundEnabled, 
    isFullscreen,
    viewMode,
    flipAnimation,
    incrementZoom,
    decrementZoom,
    toggleSound,
    toggleFullscreen,
    toggleViewMode,
    setFlipAnimation,
    triggerNextPage,
    triggerPrevPage
  } = useViewerStore();

  const cycleAnimation = () => {
    const modes: FlipAnimation[] = ['smooth', 'quick', 'instant'];
    const currentIndex = modes.indexOf(flipAnimation);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlipAnimation(modes[nextIndex]);
  };

  const getAnimationIcon = () => {
    switch (flipAnimation) {
      case 'instant': return <Zap className="w-5 h-5" />;
      case 'quick': return <Wind className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4"
    >
      <div className="glass px-2 py-2 rounded-2xl flex items-center space-x-1 shadow-2xl ring-1 ring-white/10">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 border-r border-white/10 pr-2 hidden sm:flex">
          <ControlButton icon={<ZoomOut className="w-5 h-5" />} onClick={decrementZoom} />
          <div className="px-2 text-[10px] font-bold text-white/40 tabular-nums">
            {useViewerStore.getState().zoomLevel}%
          </div>
          <ControlButton icon={<ZoomIn className="w-5 h-5" />} onClick={incrementZoom} />
        </div>

        {/* Main Navigation */}
        <div className="flex items-center space-x-3 px-4">
          <button 
            onClick={triggerPrevPage}
            disabled={currentPage <= 1 || viewMode === 'grid'}
            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-10 text-white transition-all active:scale-75"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center min-w-[100px] select-none">
            <div className="flex items-baseline space-x-1">
              <span className="text-white text-sm font-bold">{currentPage}</span>
              <span className="text-white/40 text-[10px] font-medium uppercase tracking-tighter">of</span>
              <span className="text-white/60 text-sm font-medium">{totalPages}</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1.5 relative">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                initial={false}
                animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          <button 
            onClick={triggerNextPage}
            disabled={currentPage >= totalPages || viewMode === 'grid'}
            className="p-2 rounded-full hover:bg-white/10 disabled:opacity-10 text-white transition-all active:scale-75"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* View & Utility */}
        <div className="flex items-center space-x-1 border-l border-white/10 pl-2">
          <ControlButton 
            icon={getAnimationIcon()} 
            onClick={cycleAnimation}
            tooltip={`Animation: ${flipAnimation}`}
          />
          <ControlButton 
            icon={viewMode === 'flip' ? <LayoutGrid className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />} 
            onClick={toggleViewMode} 
            active={viewMode === 'grid'}
          />
          <ControlButton 
            icon={isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />} 
            onClick={toggleSound} 
            active={!isSoundEnabled}
          />
          <ControlButton 
            icon={isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />} 
            onClick={toggleFullscreen} 
            tooltip={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ViewerControls;
