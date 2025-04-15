
import React from 'react';
import { cn } from '@/lib/utils';

interface PianoKeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  isTopKey: boolean;
  onPress: () => void;
  style?: React.CSSProperties;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, octave, isBlack, isTopKey, onPress, style }) => {
  const handleKeyPress = (e: React.MouseEvent) => {
    e.preventDefault();
    onPress();
  };

  return (
    <div
      className={cn(
        "relative cursor-pointer transition-colors duration-100",
        isTopKey
          ? "h-32 bg-[#5474b4] border border-[#405a96] hover:bg-[#405a96] active:bg-[#344b7d] shadow-[0_0_10px_rgba(84,116,180,0.5)]"
          : isBlack
          ? "w-8 h-32 -mx-4 z-10 bg-[#5474b4] border border-[#405a96] hover:bg-[#405a96] active:bg-[#344b7d] shadow-[0_0_10px_rgba(84,116,180,0.5)]"
          : "w-[52px] h-48 bg-[#8cb4d5] border border-gray-200 hover:bg-[#7aa2c3] active:bg-[#6890b1]"
      )}
      style={style}
      onMouseDown={handleKeyPress}
      role="button"
      aria-label={`${note}${octave}`}
    />
  );
};

export default PianoKey;
