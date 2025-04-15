
import React from 'react';
import { cn } from '@/lib/utils';

interface PianoKeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  isTopKey: boolean;
  onPress: () => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, octave, isBlack, isTopKey, onPress }) => {
  const handleKeyPress = (e: React.MouseEvent) => {
    e.preventDefault();
    onPress();
  };

  return (
    <div
      className={cn(
        "relative cursor-pointer transition-colors duration-100",
        isTopKey
          ? "w-[72.8px] h-32 bg-[#338899] border border-[#2A7B8D] hover:bg-[#2A7B8D] active:bg-[#1E5A6A] shadow-[0_0_10px_rgba(51,136,153,0.5)]"
          : isBlack
          ? "w-8 h-32 -mx-4 z-10 bg-[#338899] border border-[#2A7B8D] hover:bg-[#2A7B8D] active:bg-[#1E5A6A] shadow-[0_0_10px_rgba(51,136,153,0.5)]"
          : "w-[52px] h-48 bg-[#a3e9f3] border border-gray-200 hover:bg-[#8bcfe3] active:bg-[#73b5c9]"
      )}
      onMouseDown={handleKeyPress}
      role="button"
      aria-label={`${note}${octave}`}
    />
  );
};

export default PianoKey;
