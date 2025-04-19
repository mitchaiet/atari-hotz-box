
import React, { createContext, useContext, useState } from 'react';

interface KeyOverlayContextType {
  showNumbers: boolean;
  toggleNumbers: () => void;
}

const KeyOverlayContext = createContext<KeyOverlayContextType>({
  showNumbers: false,
  toggleNumbers: () => {},
});

export const KeyOverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [showNumbers, setShowNumbers] = useState(false);

  const toggleNumbers = () => {
    setShowNumbers(prev => !prev);
  };

  return (
    <KeyOverlayContext.Provider value={{ showNumbers, toggleNumbers }}>
      {children}
    </KeyOverlayContext.Provider>
  );
};

export const useKeyOverlay = () => {
  const context = useContext(KeyOverlayContext);
  if (!context) {
    throw new Error('useKeyOverlay must be used within a KeyOverlayProvider');
  }
  return context;
};
