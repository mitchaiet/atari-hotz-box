
import React from 'react';
import { cn } from '@/lib/utils';

interface PianoKeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  onPress: () => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, octave, isBlack, onPress }) => {
  const handleKeyPress = (e: React.MouseEvent) => {
    e.preventDefault();
    onPress();
  };

  return (
    <div
      className={cn(
        "relative cursor-pointer transition-colors duration-100",
        isBlack
          ? "w-8 h-32 -mx-4 z-10 bg-[#1A1F2C] hover:bg-[#2A2F3C] active:bg-[#3A3F4C]"
          : "w-12 h-48 bg-white border border-gray-200 hover:bg-[#F8F9FA] active:bg-[#E9ECEF]"
      )}
      onMouseDown={handleKeyPress}
      role="button"
      aria-label={`${note}${octave}`}
    />
  );
};

export default PianoKey;
