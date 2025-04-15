
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
  };

  const handleTouchEnter = (e: React.TouchEvent) => {
    if (e.touches.length > 0 && !isPressed) {
      handleKeyPress(e);
    }
  };

  const handleTouchLeave = (e: React.TouchEvent) => {
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
      onMouseLeave={isPressed ? handleKeyRelease : undefined}
      onMouseEnter={(e) => e.buttons === 1 && handleKeyPress(e as any)}
      onTouchStart={handleKeyPress}
      onTouchEnd={handleKeyRelease}
      onTouchCancel={handleKeyRelease}
      onTouchMove={handleTouchEnter}
      role="button"
      aria-label={`${note}${octave}`}
      aria-pressed={isPressed}
    />
  );
};

export default PianoKey;
