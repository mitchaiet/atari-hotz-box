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

  // Repeat the notes for three octaves
  const threeOctaves = [...notes, ...notes, ...notes];
  
  // Get white keys for bottom row - exactly 21 keys
  const whiteKeys = threeOctaves.filter(note => !note.isBlack).slice(0, 21);
  
  // Calculate width for middle row - 36 keys (21 white keys × 52px width)
  const totalWidth = 1092; // 21 white keys × 52px = 1092px

  // Calculate width for top keys - 15 keys should span the same width
  const topKeyWidth = totalWidth / 15; // 1092px ÷ 15 = 72.8px
  
  // Calculate width for bottom keys - 21 keys should span the same width
  const bottomKeyWidth = totalWidth / 21; // 1092px ÷ 21 = 52px
  
  // Calculate width for 12-key bottom row
  const twelveKeyWidth = totalWidth / 12; // 1092px ÷ 12 = 91px
  
  // Top row - 15 keys
  const topKeys = Array.from({ length: 15 }, (_, i) => ({
    note: `Key${i + 1}`,
    isBlack: false,
    isTopKey: true,
    style: { width: `${topKeyWidth}px` }
  }));
  
  // Bottom row - 21 keys
  const bottomButtons = whiteKeys.map((note, index) => ({
    note: `Button${index + 1}`,
    isBlack: false,
    isTopKey: true,
    style: { width: `${bottomKeyWidth}px` }
  }));

  const handleKeyPress = (note: string, octave: number) => {
    console.log(`Key pressed: ${note} (Octave ${octave})`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="relative flex flex-col bg-white rounded-lg shadow-2xl p-8">
        {/* Top row of keys */}
        <div className="flex" style={{ width: `${totalWidth}px` }}>
          {topKeys.map((key, index) => (
            <PianoKey
              key={`top-${index}`}
              note={key.note}
              octave={0}
              isBlack={false}
              isTopKey={true}
              onPress={() => console.log(`Top key ${index + 1} pressed`)}
              style={key.style}
            />
          ))}
        </div>
        
        {/* Piano keys - middle row */}
        <div className="relative flex -mt-[1px]" style={{ width: `${totalWidth}px` }}>
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

        {/* First Divider */}
        <div className="mt-8" style={{ width: `${totalWidth}px` }}>
          <Separator className="bg-gray-200" />
        </div>

        {/* Bottom row of buttons */}
        <div className="flex mt-8" style={{ width: `${totalWidth}px` }}>
          {bottomButtons.map((button, index) => (
            <PianoKey
              key={`bottom-${index}`}
              note={button.note}
              octave={0}
              isBlack={false}
              isTopKey={true}
              onPress={() => console.log(`Bottom button ${index + 1} pressed`)}
              style={button.style}
            />
          ))}
        </div>

        {/* Second Divider */}
        <div className="mt-8" style={{ width: `${totalWidth}px` }}>
          <Separator className="bg-gray-200" />
        </div>

        {/* Final row of 12 keys */}
        <div className="flex mt-8" style={{ width: `${totalWidth}px` }}>
          {Array.from({ length: 12 }, (_, i) => ({
            note: `Final${i + 1}`,
            isBlack: false,
            isTopKey: true,
            style: { width: `${twelveKeyWidth}px` }
          })).map((key, index) => (
            <PianoKey
              key={`final-${index}`}
              note={key.note}
              octave={0}
              isBlack={false}
              isTopKey={true}
              onPress={() => console.log(`Final row key ${index + 1} pressed`)}
              style={key.style}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Piano;
