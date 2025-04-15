import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { sendNoteOn, sendNoteOff, mapKeyToMIDINote, sendControlChange } from '@/utils/midiUtils';

const emitDebugEvent = (type: string, message: string) => {
  window.dispatchEvent(new CustomEvent('midi-debug', {
    detail: { type, message }
  }));
};

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
  const keyRef = useRef<HTMLDivElement>(null);
  const lastTouchTimeRef = useRef<number>(0);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isPressed) return;

    const midiNote = mapKeyToMIDINote(note, octave);
    
    if (isCCControl && ccNumber !== undefined) {
      sendControlChange(ccNumber, 127);
      emitDebugEvent('midi', `CC ${ccNumber} ON (127)`);
    } else {
      sendNoteOn(midiNote);
      emitDebugEvent('midi', `Note ${note}${octave} ON (${midiNote})`);
    }
    
    emitDebugEvent(
      'touch' in e ? 'touch' : 'mouse',
      `${e.type} on ${note}${octave}`
    );
    
    setIsPressed(true);
    onPress();

    if ('touches' in e && e.touches.length > 0) {
      touchIdRef.current = e.touches[0].identifier;
    }
  };

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isPressed) return;
    
    const midiNote = mapKeyToMIDINote(note, octave);
    
    if (isCCControl && ccNumber !== undefined) {
      sendControlChange(ccNumber, 0);
      emitDebugEvent('midi', `CC ${ccNumber} OFF (0)`);
    } else {
      sendNoteOff(midiNote);
      emitDebugEvent('midi', `Note ${note}${octave} OFF (${midiNote})`);
    }
    
    emitDebugEvent(
      'touch' in e ? 'touch' : 'mouse',
      `${e.type} on ${note}${octave}`
    );
    
    setIsPressed(false);
    touchIdRef.current = null;
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!keyRef.current) return;

    const now = Date.now();
    if (now - lastTouchTimeRef.current < 16) { // ~60fps
      return;
    }
    lastTouchTimeRef.current = now;

    const rect = keyRef.current.getBoundingClientRect();
    let isPointerOver = false;

    if ('touches' in e) {
      const touchList = Array.from(e.touches);
      isPointerOver = touchList.some(touch => {
        const isOver = (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        );
        return isOver;
      });
      
      const touchCoordinates = touchList.map(touch => 
        `(${Math.round(touch.clientX)},${Math.round(touch.clientY)})`
      ).join(', ');
      
      emitDebugEvent('touch', 
        `${e.type} on ${note}${octave} - coords: ${touchCoordinates} - ${isPointerOver ? 'over' : 'out'} - bounds: (${Math.round(rect.left)},${Math.round(rect.top)})-(${Math.round(rect.right)},${Math.round(rect.bottom)})`
      );
    } else {
      const mouseEvent = e as React.MouseEvent;
      isPointerOver = (
        mouseEvent.clientX >= rect.left &&
        mouseEvent.clientX <= rect.right &&
        mouseEvent.clientY >= rect.top &&
        mouseEvent.clientY <= rect.bottom
      );
      
      emitDebugEvent('mouse', 
        `${e.type} on ${note}${octave} - coords: (${Math.round(mouseEvent.clientX)},${Math.round(mouseEvent.clientY)}) - ${isPointerOver ? 'over' : 'out'}`
      );
    }

    if (isPointerOver && !isPressed) {
      handleInteractionStart(e);
    } else if (!isPointerOver && isPressed) {
      handleInteractionEnd(e);
    }
  };

  return (
    <div
      ref={keyRef}
      className={cn(
        "relative cursor-pointer transition-colors duration-100 touch-none select-none",
        isPressed && "brightness-75",
        isTopKey
          ? `h-32 bg-[#5474b4] border border-[#405a96] shadow-[0_0_10px_rgba(84,116,180,0.5)] hover:bg-[#405a96] active:bg-[#344b7d]`
          : isBlack
          ? `w-6 h-24 -mx-3 z-10 bg-[#5474b4] border border-[#405a96] shadow-[0_0_10px_rgba(84,116,180,0.5)] hover:bg-[#405a96] active:bg-[#344b7d]`
          : `h-48 bg-[#8cb4d5] border border-gray-200 hover:bg-[#79a0c1] active:bg-[#6890b1]`,
        className
      )}
      style={{
        ...style,
        touchAction: 'none'
      }}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseEnter={(e) => e.buttons === 1 && handleInteractionStart(e)}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchMove={handleInteractionMove}
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleInteractionEnd}
      role="button"
      aria-label={`${note}${octave}`}
      aria-pressed={isPressed}
    />
  );
};

export default PianoKey;
