
import { TouchEventHandler, MouseEventHandler } from 'react';

interface KeyRegistryEntry {
  ref: HTMLDivElement | null;
  isPressed: boolean;
  setIsPressed: (value: boolean) => void;
  handlePress: (pressed: boolean, e: React.MouseEvent | React.TouchEvent) => void;
}

export const keyRegistry = new Map<string, KeyRegistryEntry>();

export const registerKey = (
  keyId: string,
  entry: KeyRegistryEntry
) => {
  keyRegistry.set(keyId, entry);
};

export const unregisterKey = (keyId: string) => {
  keyRegistry.delete(keyId);
};

export const handleGlobalTouchMove = (e: TouchEvent, emitDebugEvent: (type: string, message: string) => void) => {
  const now = Date.now();
  const lastTouchTimeRef = { current: 0 };
  if (now - lastTouchTimeRef.current < 16) {
    return;
  }
  lastTouchTimeRef.current = now;

  Array.from(e.touches).forEach(touch => {
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    const keysUnderTouch = new Set<string>();
    
    keyRegistry.forEach((keyData, id) => {
      if (!keyData.ref) return;
      
      const rect = keyData.ref.getBoundingClientRect();
      const isPointInside = 
        touchX >= rect.left && 
        touchX <= rect.right && 
        touchY >= rect.top && 
        touchY <= rect.bottom;
      
      if (isPointInside) {
        keysUnderTouch.add(id);
        
        if (!keyData.isPressed) {
          keyData.handlePress(true, e as unknown as React.TouchEvent);
          emitDebugEvent('touch', 
            `Touch entered ${id} at (${Math.round(touchX)},${Math.round(touchY)}) - bounds: (${Math.round(rect.left)},${Math.round(rect.top)})-(${Math.round(rect.right)},${Math.round(rect.bottom)})`
          );
        }
      }
    });
    
    keyRegistry.forEach((keyData, id) => {
      if (keyData.isPressed && !keysUnderTouch.has(id)) {
        keyData.handlePress(false, e as unknown as React.TouchEvent);
        emitDebugEvent('touch', `Touch left ${id}`);
      }
    });
  });

  if (e.touches.length === 0) {
    keyRegistry.forEach((keyData, id) => {
      if (keyData.isPressed) {
        keyData.handlePress(false, e as unknown as React.TouchEvent);
        emitDebugEvent('touch', `Touch ended ${id}`);
      }
    });
  }
};
