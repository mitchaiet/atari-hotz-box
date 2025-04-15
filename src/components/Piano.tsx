
import React from 'react';
import PianoKey from './PianoKey';

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

  const handleKeyPress = (note: string, octave: number) => {
    console.log(`Key pressed: ${note} (Octave ${octave})`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="relative flex bg-white rounded-lg shadow-2xl p-8">
        <div className="relative flex">
          {threeOctaves.map((noteObj, index) => {
            const octave = Math.floor(index / 12) + 4; // Starting from octave 4
            return (
              <PianoKey
                key={`${noteObj.note}-${octave}-${index}`}
                note={noteObj.note}
                octave={octave}
                isBlack={noteObj.isBlack}
                onPress={() => handleKeyPress(noteObj.note, octave)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Piano;
