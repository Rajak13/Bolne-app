import { useState, useEffect } from 'react';
import { Header, Sidebar, ChatArea, BottomBar } from '../components/layout';
import { useSwipeGesture } from '../hooks';
import './ChatPage.css';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024; // Increased breakpoint for better tablet experience
      setIsMobile(mobile);
      
      // On desktop, sidebar should be open by default
      // On mobile/tablet, sidebar should be closed by default
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isSidebarOpen]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Swipe gesture support for mobile
  const { ref: swipeRef, isSwipping } = useSwipeGesture({
    onSwipeRight: () => {
      if (isMobile && !isSidebarOpen) {
        handleOpenSidebar();
      }
    },
    onSwipeLeft: () => {
      if (isMobile && isSidebarOpen) {
        handleCloseSidebar();
      }
    },
    threshold: 50,
    restraint: 100,
    allowedTime: 300
  });

  const chatPageClasses = [
    'chat-page',
    isSidebarOpen ? 'chat-page--sidebar-open' : 'chat-page--sidebar-closed',
    isSwipping ? 'chat-page--swipping' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={chatPageClasses} ref={swipeRef}>
      {/* Desktop Header */}
      <Header 
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
        className="desktop-only"
      />
      
      <div className="chat-page__content">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
        />
        
        <ChatArea />
      </div>

      {/* Persistent Bottom Navigation */}
      <BottomBar 
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
};

export default ChatPage;