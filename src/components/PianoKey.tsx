
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
          ? "w-[72.8px] h-32 bg-[#0FA0CE] border border-[#1EAEDB] hover:bg-[#1EAEDB] active:bg-[#0077A3] shadow-[0_0_10px_rgba(30,174,219,0.5)]"
          : isBlack
          ? "w-8 h-32 -mx-4 z-10 bg-[#0FA0CE] border border-[#1EAEDB] hover:bg-[#1EAEDB] active:bg-[#0077A3] shadow-[0_0_10px_rgba(30,174,219,0.5)]"
          : "w-[52px] h-48 bg-white border border-gray-200 hover:bg-[#F8F9FA] active:bg-[#E9ECEF]"
      )}
      onMouseDown={handleKeyPress}
      role="button"
      aria-label={`${note}${octave}`}
    />
  );
};

export default PianoKey;
