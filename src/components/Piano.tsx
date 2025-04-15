import React from 'react';
import PianoKey from './PianoKey';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

const Piano = () => {
  // Define the notes for three octaves
  const notes = [
    { note: 'C', isBlack: false }, { note: 'C#', isBlack: true },
    { note: 'D', isBlack: false }, { note: 'D#', isBlack: true },
    { note: 'E', isBlack: false },
    { note: 'F', isBlack: false }, { note: 'F#', isBlack: true },
    { note: 'G', isBlack: false }, { note: 'G#', isBlack: true },
    { note: 'A', isBlack: false }, { note: 'A#', isBlack: true },
    { note: 'B', isBlack: false },
  ];

  // Calculate width for top keys
  // Bottom row: 36 keys total (21 white keys × 52px width)
  // Total width of bottom row = 1092px (21 × 52px)
  // For 15 top keys, each should be 1092/15 ≈ 72.8px
  const topKeys = Array.from({ length: 15 }, (_, i) => ({
    note: `Key${i + 1}`,
    isBlack: false,
    isTopKey: true
  }));

  // Repeat the notes for three octaves
  const threeOctaves = [...notes, ...notes, ...notes];

  // Calculate button width to match total piano width
  // Total width of 36 keys = (21 white keys × 52px) = 1092px
  // For 21 buttons, each should be approximately 52px
  const bottomButtons = Array.from({ length: 21 }, (_, i) => ({
    id: `button-${i + 1}`,
    label: `${i + 1}`
  }));

  const handleKeyPress = (note: string, octave: number) => {
    console.log(`Key pressed: ${note} (Octave ${octave})`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="relative flex flex-col bg-white rounded-lg shadow-2xl p-8">
        {/* Top row of keys */}
        <div className="flex">
          {topKeys.map((key, index) => (
            <PianoKey
              key={`top-${index}`}
              note={key.note}
              octave={0}
              isBlack={false}
              isTopKey={true}
              onPress={() => console.log(`Top key ${index + 1} pressed`)}
            />
          ))}
        </div>
        {/* Piano keys */}
        <div className="relative flex -mt-[1px]">
          {threeOctaves.map((noteObj, index) => {
            const octave = Math.floor(index / 12) + 4;
            return (
              <PianoKey
                key={`${noteObj.note}-${octave}-${index}`}
                note={noteObj.note}
                octave={octave}
                isBlack={noteObj.isBlack}
                isTopKey={false}
                onPress={() => handleKeyPress(noteObj.note, octave)}
              />
            );
          })}
        </div>

        {/* Divider */}
        <div className="mt-8">
          <Separator className="bg-gray-200" />
        </div>

        {/* Bottom row of buttons */}
        <div className="flex gap-1 mt-8">
          {bottomButtons.map((button) => (
            <Button 
              key={button.id}
              className="w-[52px] h-12 bg-[#8cb4d5] hover:bg-[#7aa2c3] active:bg-[#6890b1] border-none"
              onClick={() => console.log(`Bottom button ${button.label} clicked`)}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Piano;
