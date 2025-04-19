
import React from 'react';
import { cn } from '@/lib/utils';
import { useKeyOverlay } from '@/contexts/KeyOverlayContext';
import { useKeyInteraction } from '@/hooks/useKeyInteraction';
import KeyNumber from './KeyNumber';

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
  keyNumber: number;
}

const PianoKey: React.FC<PianoKeyProps> = ({ 
  note, 
  octave, 
  isBlack, 
  isTopKey, 
  onPress,
  style, 
  className,
  isCCControl = false,
  ccNumber,
  keyNumber
}) => {
  const { showNumbers } = useKeyOverlay();
  const keyId = `${note}-${octave}`;

  const {
    keyRef,
    isPressed,
    handleInteractionStart,
    handleInteractionEnd,
    handleInteractionMove
  } = useKeyInteraction({
    note,
    octave,
    isCCControl,
    ccNumber,
    keyId
  });

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
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleInteractionEnd}
      role="button"
      aria-label={`${note}${octave}`}
      aria-pressed={isPressed}
    >
      <KeyNumber show={showNumbers} number={keyNumber} />
    </div>
  );
};

export default PianoKey;
