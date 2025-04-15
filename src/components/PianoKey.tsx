
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { sendNoteOn, sendNoteOff, mapKeyToMIDINote, sendControlChange } from '@/utils/midiUtils';

interface PianoKeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  isTopKey: boolean;
  onPress: () => void;
  style?: React.CSSProperties;
  whiteKeyColor?: string;
  className?: string;
  isCCControl?: boolean;
  ccNumber?: number;
}

const PianoKey: React.FC<PianoKeyProps> = ({ 
  note, 
  octave, 
  isBlack, 
  isTopKey, 
  onPress, 
  style, 
  whiteKeyColor = '#F5F5F5', 
  className,
  isCCControl = false,
  ccNumber
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const handleKeyPress = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isPressed) return; // Prevent multiple triggers
    
    const midiNote = mapKeyToMIDINote(note, octave);
    
    if (isCCControl && ccNumber !== undefined) {
      sendControlChange(ccNumber, 127);
    } else {
      sendNoteOn(midiNote);
    }
    
    setIsPressed(true);
    onPress();
  };

  const handleKeyRelease = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isPressed) return;
    
    const midiNote = mapKeyToMIDINote(note, octave);
    
    if (isCCControl && ccNumber !== undefined) {
      sendControlChange(ccNumber, 0);
    } else {
      sendNoteOff(midiNote);
    }
    
    setIsPressed(false);
    touchIdRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPressed) return;
    
    // Store the touch identifier to track this specific touch
    if (e.touches.length > 0) {
      touchIdRef.current = e.touches[0].identifier;
      handleKeyPress(e);
    }
  };

  // Global touch move handler for the piano
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if there's at least one touch point
    if (e.touches.length === 0) return;
    
    // Get the current touch
    let currentTouch = null;
    for (let i = 0; i < e.touches.length; i++) {
      if (touchIdRef.current === e.touches[i].identifier) {
        currentTouch = e.touches[i];
        break;
      }
    }
    
    // If we couldn't find our tracked touch, check if we're in the touch
    if (!currentTouch) {
      const rect = e.currentTarget.getBoundingClientRect();
      
      // Look for any touch that's over this element
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          currentTouch = touch;
          touchIdRef.current = touch.identifier;
          break;
        }
      }
    }
    
    // Get bounding rectangle of the key element
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Check if our touch is inside this key's boundaries
    let touchInside = false;
    if (currentTouch) {
      touchInside = 
        currentTouch.clientX >= rect.left &&
        currentTouch.clientX <= rect.right &&
        currentTouch.clientY >= rect.top &&
        currentTouch.clientY <= rect.bottom;
    }
    
    // Handle touch entering key (press)
    if (touchInside && !isPressed) {
      handleKeyPress(e);
    }
    // Handle touch exiting key (release)
    else if (!touchInside && isPressed) {
      handleKeyRelease(e);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if our tracked touch has ended
    let touchExists = false;
    for (let i = 0; i < e.touches.length; i++) {
      if (touchIdRef.current !== null && e.touches[i].identifier === touchIdRef.current) {
        touchExists = true;
        break;
      }
    }
    
    // If our tracked touch no longer exists, release the key
    if (!touchExists && isPressed) {
      handleKeyRelease(e);
    }
  };

  // Mouse events for desktop
  const handleMouseEnter = (e: React.MouseEvent) => {
    // Trigger key when mouse enters with button pressed (dragging)
    if (e.buttons === 1) {
      handleKeyPress(e);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Release key when mouse leaves if it was pressed
    if (isPressed) {
      handleKeyRelease(e);
    }
  };

  const baseWhiteStyle = "hover:bg-[#79a0c1] active:bg-[#6890b1] bg-[#8cb4d5]";
  const baseBlackStyle = "hover:bg-[#405a96] active:bg-[#344b7d]";

  return (
    <div
      className={cn(
        "relative cursor-pointer transition-colors duration-100 touch-none",
        isPressed && "brightness-75",
        isTopKey
          ? `h-32 bg-[#5474b4] border border-[#405a96] shadow-[0_0_10px_rgba(84,116,180,0.5)] ${baseBlackStyle}`
          : isBlack
          ? `w-6 h-24 -mx-3 z-10 bg-[#5474b4] border border-[#405a96] shadow-[0_0_10px_rgba(84,116,180,0.5)] ${baseBlackStyle}`
          : `h-48 bg-[#8cb4d5] border border-gray-200 ${baseWhiteStyle}`,
        className
      )}
      style={style}
      onMouseDown={handleKeyPress}
      onMouseUp={handleKeyRelease}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      role="button"
      aria-label={`${note}${octave}`}
      aria-pressed={isPressed}
    />
  );
};

export default PianoKey;
