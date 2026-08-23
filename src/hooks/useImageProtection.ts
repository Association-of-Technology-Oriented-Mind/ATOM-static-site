import { useEffect } from 'react';

interface UseImageProtectionOptions {
  disableRightClick?: boolean;
  disableDrag?: boolean;
  disableSelect?: boolean;
  disablePrintScreen?: boolean;
  disableDevTools?: boolean;
  showWarningOnRightClick?: boolean;
}

export const useImageProtection = (options: UseImageProtectionOptions = {}) => {
  const isDev = import.meta.env.DEV;

  const {
    disableRightClick = true,
    disableDrag = true,
    disableSelect = true,
    disablePrintScreen = true,
    disableDevTools = true,
    showWarningOnRightClick = true,
  } = options;

  const activeRightClick = isDev ? false : disableRightClick;
  const activeDrag = isDev ? false : disableDrag;
  const activeSelect = isDev ? false : disableSelect;
  const activePrintScreen = isDev ? false : disablePrintScreen;
  const activeDevTools = isDev ? false : disableDevTools;
  const activeWarning = isDev ? false : showWarningOnRightClick;

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (activeRightClick) {
        e.preventDefault();
        if (activeWarning) {
          console.warn('Right-click is disabled to protect content');
        }
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (activeDrag) {
        e.preventDefault();
        return false;
      }
    };

    const handleSelectStart = (e: Event) => {
      if (activeSelect) {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePrintScreen) {
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          return false;
        }
      }

      if (activeDevTools) {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
          return false;
        }
      }

      if (!isDev && e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG' || target.tagName === 'CANVAS') {
          e.preventDefault();
          return false;
        }
      }
    };

    const handleDrop = (e: DragEvent) => {
      if (!isDev) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('drop', handleDrop);

    const images = document.querySelectorAll('img');
    if (!isDev) {
      images.forEach((img) => {
        img.draggable = false;
        img.addEventListener('dragstart', handleDragStart);
      });
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('drop', handleDrop);

      if (!isDev) {
        images.forEach((img) => {
          img.removeEventListener('dragstart', handleDragStart);
        });
      }
    };
  }, [activeRightClick, activeDrag, activeSelect, activePrintScreen, activeDevTools, activeWarning, isDev]);

  useEffect(() => {
    if (activeDevTools) {
      console.clear();
      console.warn('🚫 STOP! This is a browser feature intended for developers. Content on this site is protected by copyright. Unauthorized downloading or copying is prohibited.');
      
      const devtools = { open: false, orientation: null };
      const threshold = 160;

      const interval = setInterval(() => {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (!devtools.open) {
            devtools.open = true;
            console.clear();
            console.warn('🚫 Developer tools detected! Please respect our content protection.');
          }
        } else {
          devtools.open = false;
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [activeDevTools]);

  return {
    protectedProps: {
      onContextMenu: (e: React.MouseEvent) => {
        if (!isDev) e.preventDefault();
      },
      onDragStart: (e: React.DragEvent) => {
        if (!isDev) e.preventDefault();
      },
      draggable: !isDev,
      className: isDev ? '' : 'protected-content no-drag no-context-menu',
      style: isDev ? {} : {
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as const,
        MozUserSelect: 'none' as const,
        msUserSelect: 'none' as const,
      },
    },
  };
};