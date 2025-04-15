
import React, { useState } from 'react';
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
  const [touchId, setTouchId] = useState<number | null>(null);

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
    setTouchId(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isPressed) return;
    
    // Store the touch identifier to track this specific touch
    if (e.touches.length > 0) {
      setTouchId(e.touches[0].identifier);
      handleKeyPress(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // Check if there's at least one touch point
    if (e.touches.length === 0) return;
    
    // Get bounding rectangle of the key element
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Check if touch is inside this key's boundaries
    let touchInside = false;
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        touchInside = true;
        break;
      }
    }
    
    // Activate if touch enters key and not already pressed
    if (touchInside && !isPressed) {
      handleKeyPress(e);
    } 
    // Deactivate if touch leaves key and is currently pressed
    else if (!touchInside && isPressed) {
      handleKeyRelease(e);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // Check if our tracked touch has ended
    let touchExists = false;
    for (let i = 0; i < e.touches.length; i++) {
      if (touchId !== null && e.touches[i].identifier === touchId) {
        touchExists = true;
        break;
      }
    }
    
    // If our tracked touch no longer exists, release the key
    if (!touchExists && isPressed) {
      handleKeyRelease(e);
    }
  };

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
