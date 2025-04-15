
import React from 'react';
import PianoKey from './PianoKey';
import { Separator } from './ui/separator';

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

  // Get only white keys for the bottom row - exactly 21 keys
  const whiteKeys = threeOctaves.filter(note => !note.isBlack).slice(0, 21);
  
  // Calculate the exact width needed for each button in the bottom row
  // Total width needs to match the piano keys: 1092px (21 white keys × 52px)
  // Each bottom button should be 1092/21 = 52px wide
  const bottomButtons = Array.from({ length: 21 }, (_, index) => ({
    note: `Button${index + 1}`,
    isBlack: false,
    isTopKey: true
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
        <div className="flex mt-8" style={{ width: "1092px" }}>
          {bottomButtons.map((button, index) => (
            <PianoKey
              key={`bottom-${index}`}
              note={button.note}
              octave={0}
              isBlack={false}
              isTopKey={true}
              onPress={() => console.log(`Bottom button ${index + 1} pressed`)}
              style={{ width: "52px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Piano;
