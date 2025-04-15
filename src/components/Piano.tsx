import React from 'react';
import PianoKey from './PianoKey';
import { Separator } from './ui/separator';

const Piano = () => {
  // Define the notes for three octaves
  const notes = [{
    note: 'C',
    isBlack: false
  }, {
    note: 'C#',
    isBlack: true
  }, {
    note: 'D',
    isBlack: false
  }, {
    note: 'D#',
    isBlack: true
  }, {
    note: 'E',
    isBlack: false
  }, {
    note: 'F',
    isBlack: false
  }, {
    note: 'F#',
    isBlack: true
  }, {
    note: 'G',
    isBlack: false
  }, {
    note: 'G#',
    isBlack: true
  }, {
    note: 'A',
    isBlack: false
  }, {
    note: 'A#',
    isBlack: true
  }, {
    note: 'B',
    isBlack: false
  }];

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
  const topKeys = Array.from({
    length: 15
  }, (_, i) => ({
    note: `Key${i + 1}`,
    isBlack: false,
    isTopKey: true,
    style: {
      width: `${topKeyWidth}px`
    }
  }));

  // Bottom row - 21 keys
  const bottomButtons = whiteKeys.map((note, index) => ({
    note: `Button${index + 1}`,
    isBlack: false,
    isTopKey: true,
    style: {
      width: `${bottomKeyWidth}px`
    }
  }));
  const handleKeyPress = (note: string, octave: number) => {
    console.log(`Key pressed: ${note} (Octave ${octave})`);
  };

  // Create vertical button groups - 4 groups of 3 buttons (12 total)
  const verticalButtonGroups = Array.from({
    length: 4
  }, (_, groupIndex) => Array.from({
    length: 3
  }, (_, buttonIndex) => ({
    note: `Side${groupIndex * 3 + buttonIndex + 1}`,
    isBlack: false,
    isTopKey: true,
    style: {
      width: '104px',
      height: '52px',
      backgroundColor: '#8cb4d5',
      marginBottom: groupIndex < 3 ? '0' : '0'
    }
  })));

  // Create the new column of 16 buttons
  const sixteenButtonGroup = Array.from({
    length: 16
  }, (_, index) => ({
    note: `Left${index + 1}`,
    isBlack: false,
    isTopKey: true,
    style: {
      width: '104px',
      height: '45px',
      backgroundColor: '#5474b4',
      marginBottom: '0'
    }
  }));
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#333333] p-4 md:p-8">
      <div className="flex flex-col rounded-lg shadow-2xl p-4 md:p-8 bg-slate-900 w-full max-w-[1400px] mx-auto 
        border-[16px] border-[#403E43] 
        relative 
        before:absolute before:inset-0 
        before:border-[8px] 
        before:border-[#221F26] 
        before:pointer-events-none 
        before:z-[-1]">
        
        {/* Logo and title section */}
        <div className="flex items-center justify-between mb-4 w-full">
          <img 
            src="/lovable-uploads/d0be4dda-e062-4ecc-8661-b1c242693570.png" 
            alt="Atari Hotz Logo" 
            className="h-12 md:h-16 w-auto object-contain mr-4" 
          />
          <div className="text-white text-lg md:text-2xl font-bold tracking-wider">
            MIDI TRANSLATOR
          </div>
        </div>

        {/* Divider after logo */}
        <Separator className="mb-4 md:mb-8 bg-gray-200" />

        {/* Main piano layout */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-4 md:gap-8 w-full">
          {/* Left 16-button column */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-0 flex-shrink-0">
            {sixteenButtonGroup.map((button, index) => (
              <PianoKey
                key={`far-left-${index}`}
                note={button.note}
                octave={0}
                isBlack={false}
                isTopKey={true}
                onPress={() => console.log(`Far left button ${index + 1} pressed`)}
                style={{...button.style, width: undefined}}
                className="w-full md:w-[104px]"
              />
            ))}
          </div>

          {/* Left separator */}
          <Separator className="hidden md:block h-full bg-gray-200" orientation="vertical" />

          {/* Left control buttons */}
          <div className="flex flex-row md:flex-col gap-4 flex-shrink-0">
            {verticalButtonGroups.map((group, groupIndex) => (
              <React.Fragment key={`left-group-${groupIndex}`}>
                <div className="flex flex-row md:flex-col gap-2 md:gap-0">
                  {group.map((button, buttonIndex) => (
                    <PianoKey
                      key={`left-vertical-${groupIndex}-${buttonIndex}`}
                      note={button.note}
                      octave={0}
                      isBlack={false}
                      isTopKey={true}
                      onPress={() => console.log(`Left vertical button ${groupIndex * 3 + buttonIndex + 1} pressed`)}
                      style={{...button.style, width: undefined}}
                      className="w-full md:w-[104px]"
                    />
                  ))}
                </div>
                {groupIndex < verticalButtonGroups.length - 1 && (
                  <Separator className="hidden md:block bg-gray-200" orientation="horizontal" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Piano section */}
          <div className="flex flex-col items-center flex-grow w-full">
            {/* Top row of keys */}
            <div className="flex w-full">
              {topKeys.map((key, index) => (
                <PianoKey
                  key={`top-${index}`}
                  note={key.note}
                  octave={0}
                  isBlack={false}
                  isTopKey={true}
                  onPress={() => console.log(`Top key ${index + 1} pressed`)}
                  className="flex-1"
                  style={{width: undefined}}
                />
              ))}
            </div>

            {/* Piano keys - middle row */}
            <div className="relative flex -mt-[1px] w-full">
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
                    whiteKeyColor="#8cb4d5"
                    className={noteObj.isBlack ? undefined : "flex-1 bg-[#8cb4d5]"}
                  />
                );
              })}
            </div>

            {/* First Divider */}
            <div className="mt-8 w-full">
              <Separator className="bg-gray-200" />
            </div>

            {/* Bottom row of buttons */}
            <div className="flex mt-8 w-full">
              {bottomButtons.map((button, index) => (
                <PianoKey
                  key={`bottom-${index}`}
                  note={button.note}
                  octave={0}
                  isBlack={false}
                  isTopKey={true}
                  onPress={() => console.log(`Bottom button ${index + 1} pressed`)}
                  className="flex-1"
                  style={{width: undefined}}
                />
              ))}
            </div>

            {/* Second Divider */}
            <div className="mt-8 w-full">
              <Separator className="bg-gray-200" />
            </div>

            {/* Final row of 12 keys */}
            <div className="flex mt-8 w-full">
              {Array.from({ length: 12 }, (_, i) => ({
                note: `Final${i + 1}`,
                isBlack: false,
                isTopKey: true
              })).map((key, index) => (
                <PianoKey
                  key={`final-${index}`}
                  note={key.note}
                  octave={0}
                  isBlack={false}
                  isTopKey={true}
                  onPress={() => console.log(`Final row key ${index + 1} pressed`)}
                  className="flex-1"
                />
              ))}
            </div>
          </div>

          {/* Right separator */}
          <Separator className="hidden md:block h-full bg-gray-200" orientation="vertical" />

          {/* Right control buttons */}
          <div className="flex flex-row md:flex-col gap-4 flex-shrink-0">
            {verticalButtonGroups.map((group, groupIndex) => (
              <React.Fragment key={`right-group-${groupIndex}`}>
                <div className="flex flex-row md:flex-col gap-2 md:gap-0">
                  {group.map((button, buttonIndex) => (
                    <PianoKey
                      key={`right-vertical-${groupIndex}-${buttonIndex}`}
                      note={button.note}
                      octave={0}
                      isBlack={false}
                      isTopKey={true}
                      onPress={() => console.log(`Right vertical button ${groupIndex * 3 + buttonIndex + 1} pressed`)}
                      style={{...button.style, width: undefined}}
                      className="w-full md:w-[104px]"
                    />
                  ))}
                </div>
                {groupIndex < verticalButtonGroups.length - 1 && (
                  <Separator className="hidden md:block bg-gray-200" orientation="horizontal" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right separator */}
          <Separator className="hidden md:block h-full bg-gray-200" orientation="vertical" />

          {/* Right 16-button column */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-0 flex-shrink-0">
            {sixteenButtonGroup.map((button, index) => (
              <PianoKey
                key={`far-right-${index}`}
                note={button.note}
                octave={0}
                isBlack={false}
                isTopKey={true}
                onPress={() => console.log(`Far right button ${index + 1} pressed`)}
                style={{...button.style, width: undefined}}
                className="w-full md:w-[104px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Piano;
