import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PianoKeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  isTopKey: boolean;
  onPress: () => void;
  style?: React.CSSProperties;
  whiteKeyColor?: string;
}

const PianoKey: React.FC<PianoKeyProps> = ({ 
  note, 
  octave, 
  isBlack, 
  isTopKey, 
  onPress, 
  style, 
  whiteKeyColor = '#FFFFFF' 
}) => {
  const isMobile = useIsMobile();
  
  const handleKeyPress = (e: React.MouseEvent) => {
    e.preventDefault();
    onPress();
  };

  const baseWhiteStyle = "hover:bg-[#F1F1F1] active:bg-[#E0E0E0]";
  const baseBlackStyle = "hover:bg-[#405a96] active:bg-[#344b7d]";

  return (
    <div
      className={cn(
        "relative cursor-pointer transition-colors duration-100",
        isTopKey
          ? `h-16 md:h-32 bg-[#5474b4] border border-[#405a96] shadow-[0_0_10px_rgba(84,116,180,0.5)] ${baseBlackStyle}`
          : isBlack
          ? `w-6 h-16 md:h-24 -mx-3 z-10 bg-[#5474b4] border border-[#405a96] shadow-[0_0_10px_rgba(84,116,180,0.5)] ${baseBlackStyle}`
          : `w-[30px] md:w-[52px] h-32 md:h-48 bg-[${whiteKeyColor}] border border-gray-200 ${baseWhiteStyle}`
      )}
      style={style}
      onMouseDown={handleKeyPress}
      role="button"
      aria-label={`${note}${octave}`}
    />
  );
};

export default PianoKey;
