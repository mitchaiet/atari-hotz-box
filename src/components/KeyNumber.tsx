
import React from 'react';

interface KeyNumberProps {
  show: boolean;
  number: number;
}

const KeyNumber: React.FC<KeyNumberProps> = ({ show, number }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-xs font-mono bg-black/50 text-white px-1 rounded">
        {number}
      </span>
    </div>
  );
};

export default KeyNumber;
