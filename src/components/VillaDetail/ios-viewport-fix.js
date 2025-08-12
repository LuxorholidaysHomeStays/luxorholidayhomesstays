// iOS Viewport Fix for All iOS Browsers
// This script helps with iOS viewport issues when showing modals in all iOS browsers

// Helper to detect iOS
export function isIOSDevice() {
  // Check for iOS devices including iPad with iPadOS
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // Check for iOS browsers that aren't Safari
  const isIOSChrome = iOS && /CriOS/.test(navigator.userAgent);
  const isIOSFirefox = iOS && /FxiOS/.test(navigator.userAgent);
  const isIOSEdge = iOS && /EdgiOS/.test(navigator.userAgent);
  
  return {
    isIOS: iOS,
    isSafari: iOS && !isIOSChrome && !isIOSFirefox && !isIOSEdge,
    isChrome: isIOSChrome,
    isFirefox: isIOSFirefox,
    isEdge: isIOSEdge,
    isAnyIOSBrowser: iOS
  };
}

// Add global CSS styles needed for iOS fixes
function addIOSStyles() {
  if (!document.getElementById('ios-fixes-css')) {
    const style = document.createElement('style');
    style.id = 'ios-fixes-css';
    style.innerHTML = `
      :root {
        --vh: 1vh;
        --safe-area-inset-top: env(safe-area-inset-top, 0px);
        --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
      }
      .calendar-modal-open {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .ios-modal-container::-webkit-scrollbar {
        display: none;
      }
      @supports (-webkit-touch-callout: none) {
        .ios-force-repaint {
          transform: translate3d(0, 0, 0);
          will-change: transform;
          backface-visibility: hidden;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Add special meta viewport tag for iOS
function fixIOSViewport() {
  const metaViewport = document.querySelector('meta[name="viewport"]');
  if (metaViewport) {
    metaViewport.setAttribute('content', 
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  } else {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);
  }
}

// Update viewport height CSS variable
function updateIOSViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Add Safe Area insets
function addIOSSafeAreaInsets() {
  document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
  document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
}

// The main function to apply all iOS fixes
export function applyIOSViewportFix() {
  const { isAnyIOSBrowser } = isIOSDevice();
  
  if (isAnyIOSBrowser) {
    // Add CSS styles
    addIOSStyles();
    
    // Fix viewport meta tag
    fixIOSViewport();
    
    // Update viewport height
    updateIOSViewportHeight();
    
    // Add safe area insets
    addIOSSafeAreaInsets();
    
    // Add event listeners for orientation changes
    window.addEventListener('resize', updateIOSViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateIOSViewportHeight, 100);
    });
    
    console.log("Applied comprehensive iOS fixes for all browsers");
    return true;
  }
  
  return false;
}

// Clean up all event listeners
export function cleanupIOSViewportFix() {
  window.removeEventListener('resize', updateIOSViewportHeight);
  window.removeEventListener('orientationchange', updateIOSViewportHeight);
}
