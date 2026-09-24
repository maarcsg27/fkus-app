import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface SwipeDeckSliderProps<T> {
  title: string;
  icon?: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  className?: string;
  autoSlideIntervalMs?: number; // e.g. 10000 for 10 seconds auto-advance
}

export function SwipeDeckSlider<T>({
  title,
  icon,
  badge,
  badgeColor = 'text-red-400 bg-red-500/10 border border-red-500/20',
  items,
  renderItem,
  emptyState,
  onAdd,
  addLabel = 'Añadir',
  className = '',
  autoSlideIntervalMs
}: SwipeDeckSliderProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchMoveX, setTouchMoveX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Keep currentIndex in bounds if items change
  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(items.length - 1);
    }
  }, [items.length, currentIndex]);

  // Auto-slide timer (every 10s if enabled and > 1 item)
  useEffect(() => {
    if (!autoSlideIntervalMs || items.length <= 1 || isPaused || isSwiping) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, autoSlideIntervalMs);

    return () => clearInterval(timer);
  }, [autoSlideIntervalMs, items.length, isPaused, isSwiping]);

  const hasItems = items.length > 0;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < items.length - 1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    } else if (items.length > 1) {
      setCurrentIndex(items.length - 1); // Loop to end
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    } else if (items.length > 1) {
      setCurrentIndex(0); // Loop to start
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchMoveX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    setTouchMoveX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchMoveX !== null) {
      const diffX = touchStartX - touchMoveX;
      const threshold = 40; // min swipe distance in px

      if (diffX > threshold && canGoNext) {
        // Swiped Left -> Next
        handleNext();
      } else if (diffX < -threshold && canGoPrev) {
        // Swiped Right -> Prev
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchMoveX(null);
    setIsSwiping(false);
  };

  if (!hasItems && !emptyState) {
    return null;
  }

  return (
    <section className={`space-y-2.5 select-none ${className}`}>
      {/* Header bar: Title, Count Badge, Pagination controls, Add button */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-red-500 shrink-0">{icon}</span>}
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-200 flex items-center gap-2">
            <span>{title}</span>
            {badge !== undefined && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Item Counter if > 1 items */}
          {items.length > 1 && (
            <span className="text-[10.5px] font-mono font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg mr-1">
              {currentIndex + 1} / {items.length}
            </span>
          )}

          {/* Prev / Next navigation arrows */}
          {items.length > 1 && (
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoPrev}
                aria-label="Anterior"
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all border ${
                  canGoPrev
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800 hover:border-red-500/40 active:scale-95'
                    : 'bg-neutral-950 text-neutral-700 border-neutral-900 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                aria-label="Siguiente"
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all border ${
                  canGoNext
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800 hover:border-red-500/40 active:scale-95'
                    : 'bg-neutral-950 text-neutral-700 border-neutral-900 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Quick Add Button */}
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1 ml-1"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span className="hidden xs:inline">{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Sliding View Container */}
      {!hasItems ? (
        emptyState
      ) : (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative group"
        >
          {/* Active Single Item Render */}
          <div className="transition-all duration-200 ease-out">
            {renderItem(items[currentIndex], currentIndex)}
          </div>

          {/* Floating Subtle Side Click Zones / Indicators for Desktop */}
          {items.length > 1 && (
            <>
              {canGoPrev && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white items-center justify-center border border-neutral-700/80 shadow-lg opacity-0 group-hover:opacity-90 hover:opacity-100 hover:scale-110 transition-all z-10"
                  title="Anterior (desliza o pulsa flecha)"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              {canGoNext && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white items-center justify-center border border-neutral-700/80 shadow-lg opacity-0 group-hover:opacity-90 hover:opacity-100 hover:scale-110 transition-all z-10"
                  title="Siguiente (desliza o pulsa flecha)"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </>
          )}

          {/* Dots Indicator for multiple items */}
          {items.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    currentIndex === idx 
                      ? 'w-5 bg-red-500 shadow-sm shadow-red-500/50' 
                      : 'w-1.5 bg-neutral-800 hover:bg-neutral-600'
                  }`}
                  title={`Ir al elemento ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
