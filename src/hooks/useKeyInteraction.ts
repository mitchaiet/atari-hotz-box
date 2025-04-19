
import { useState, useRef, useEffect } from 'react';
import { sendNoteOn, sendNoteOff, sendControlChange } from '@/utils/midiUtils';
import { registerKey, unregisterKey, handleGlobalTouchMove } from '@/utils/keyRegistry';

interface UseKeyInteractionProps {
  note: string;
  octave: number;
  isCCControl: boolean;
  ccNumber?: number;
  keyId: string;
}

export const useKeyInteraction = ({
  note,
  octave,
  isCCControl,
  ccNumber,
  keyId
}: UseKeyInteractionProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const touchIdRef = useRef<number | null>(null);
  const keyRef = useRef<HTMLDivElement>(null);
  const lastTouchTimeRef = useRef<number>(0);

  const emitDebugEvent = (type: string, message: string) => {
    window.dispatchEvent(new CustomEvent('midi-debug', {
      detail: { type, message }
    }));
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isPressed) return;

    if (isCCControl && ccNumber !== undefined) {
      sendControlChange(ccNumber, 127);
      emitDebugEvent('midi', `CC ${ccNumber} ON (127)`);
    } else {
      const midiNote = mapKeyToMIDINote(note, octave);
      sendNoteOn(midiNote);
      emitDebugEvent('midi', `Note ${note}${octave} ON (${midiNote})`);
    }
    
    emitDebugEvent(
      'touch' in e ? 'touch' : 'mouse',
      `${e.type} on ${note}${octave}`
    );
    
    setIsPressed(true);

    if ('touches' in e && e.touches.length > 0) {
      touchIdRef.current = e.touches[0].identifier;
    }
  };

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isPressed) return;
    
    if (isCCControl && ccNumber !== undefined) {
      sendControlChange(ccNumber, 0);
      emitDebugEvent('midi', `CC ${ccNumber} OFF (0)`);
    } else {
      const midiNote = mapKeyToMIDINote(note, octave);
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
    if (now - lastTouchTimeRef.current < 16) {
      return;
    }
    lastTouchTimeRef.current = now;

    const rect = keyRef.current.getBoundingClientRect();
    let isPointerOver = false;

    if ('touches' in e) {
      const touchList = Array.from(e.touches);
      isPointerOver = touchList.some(touch => {
        return (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        );
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

  useEffect(() => {
    if (keyRef.current) {
      registerKey(keyId, {
        ref: keyRef.current,
        isPressed,
        setIsPressed,
        handlePress: (pressed: boolean, e: React.MouseEvent | React.TouchEvent) => {
          if (pressed) {
            handleInteractionStart(e);
          } else {
            handleInteractionEnd(e);
          }
        }
      });
    }
    
    return () => {
      unregisterKey(keyId);
    };
  }, [keyId, isPressed]);

  useEffect(() => {
    document.addEventListener('touchmove', (e) => handleGlobalTouchMove(e, emitDebugEvent), { passive: false });
    document.addEventListener('touchend', (e) => {
      if (e.touches.length === 0 && isPressed) {
        handleInteractionEnd(e as unknown as React.TouchEvent);
      }
    });
    
    return () => {
      document.removeEventListener('touchmove', (e) => handleGlobalTouchMove(e, emitDebugEvent));
    };
  }, [isPressed]);

  return {
    keyRef,
    isPressed,
    handleInteractionStart,
    handleInteractionEnd,
    handleInteractionMove
  };
};

// Helper function moved from PianoKey
const mapKeyToMIDINote = (note: string, octave: number): number => {
  const baseNote = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  }[note] || 0;
  
  return baseNote + (octave * 12);
};
