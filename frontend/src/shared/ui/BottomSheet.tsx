import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  isDraggable?: boolean;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
  height = 'md',
  showCloseButton = true,
  isDraggable = true,
}: BottomSheetProps) => {
  // State to track current sheet height
  const [currentHeight, setCurrentHeight] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>(height);
  
  // Map height values to tailwind classes
  const heightClasses = {
    sm: 'h-1/4',
    md: 'h-1/2',
    lg: 'h-3/4',
    xl: 'h-5/6',
    full: 'h-full',
  };

  // Handle drag end to determine new height
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { y: number }, velocity: { y: number } }) => {
    const { offset, velocity } = info;
    
    // Threshold for considering a swipe
    const swipeThreshold = 500;
    
    // Close if swiped down fast or dragged down significantly
    if (velocity.y > swipeThreshold || offset.y > 100) {
      onClose();
      return;
    }
    
    // Expand to full if dragged up significantly
    if (offset.y < -50) {
      setCurrentHeight('full');
    }
  };

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Reset height when sheet is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentHeight(height);
    }
  }, [isOpen, height]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop/Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            className={`fixed bottom-0 left-0 right-0 ${heightClasses[currentHeight]} bg-white dark:bg-gray-800 rounded-t-2xl z-50 flex flex-col overflow-hidden`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag={isDraggable ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Drag Handle */}
            {isDraggable && (
              <div className="w-full flex justify-center pt-2 cursor-grab active:cursor-grabbing" aria-hidden="true">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
