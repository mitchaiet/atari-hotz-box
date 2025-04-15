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
  return <div className="flex justify-center items-center min-h-screen bg-[#333333] p-8">
    <div className="flex flex-col rounded-lg shadow-2xl p-8 bg-slate-900 w-full">
      {/* New logo row */}
      <div className="flex justify-center mb-4">
        <img src="/lovable-uploads/d0be4dda-e062-4ecc-8661-b1c242693570.png" alt="Atari Hotz Logo" className="h-16 w-auto object-contain" />
      </div>

      {/* Divider after logo */}
      <Separator className="mb-8 bg-gray-200" />

      {/* Existing piano layout */}
      <div className="flex">
        {/* New left column with 16 buttons */}
        <div className="flex flex-col mr-8">
          <div className="flex flex-col gap-0">
            {sixteenButtonGroup.map((button, index) => <PianoKey key={`far-left-${index}`} note={button.note} octave={0} isBlack={false} isTopKey={true} onPress={() => console.log(`Far left button ${index + 1} pressed`)} style={button.style} />)}
          </div>
        </div>

        {/* Separator between new column and existing left column */}
        <Separator className="mx-4 h-full bg-gray-200" orientation="vertical" />

        {/* Original left vertical section */}
        <div className="flex flex-col mr-8">
          {verticalButtonGroups.map((group, groupIndex) => <React.Fragment key={`left-group-${groupIndex}`}>
              <div className="flex flex-col gap-0">
                {group.map((button, buttonIndex) => <PianoKey key={`left-vertical-${groupIndex}-${buttonIndex}`} note={button.note} octave={0} isBlack={false} isTopKey={true} onPress={() => console.log(`Left vertical button ${groupIndex * 3 + buttonIndex + 1} pressed`)} style={button.style} />)}
              </div>
              {groupIndex < verticalButtonGroups.length - 1 && <div className="my-4">
                  <Separator className="bg-gray-200" orientation="horizontal" />
                </div>}
            </React.Fragment>)}
        </div>

        {/* Piano section */}
        <div className="flex flex-col">
          {/* Atari Hotz Logo */}
          <div className="flex justify-center mb-4">
            
          </div>

          {/* Top row of keys */}
          <div className="flex" style={{
            width: `${totalWidth}px`
          }}>
            {topKeys.map((key, index) => <PianoKey key={`top-${index}`} note={key.note} octave={0} isBlack={false} isTopKey={true} onPress={() => console.log(`Top key ${index + 1} pressed`)} style={key.style} />)}
          </div>
          
          {/* Piano keys - middle row */}
          <div className="relative flex -mt-[1px]" style={{
            width: `${totalWidth}px`
          }}>
            {threeOctaves.map((noteObj, index) => {
              const octave = Math.floor(index / 12) + 4;
              return <PianoKey key={`${noteObj.note}-${octave}-${index}`} note={noteObj.note} octave={octave} isBlack={noteObj.isBlack} isTopKey={false} onPress={() => handleKeyPress(noteObj.note, octave)} whiteKeyColor="#8cb4d5" />;
            })}
          </div>

          {/* First Divider */}
          <div className="mt-8" style={{
            width: `${totalWidth}px`
          }}>
            <Separator className="bg-gray-200" />
          </div>

          {/* Bottom row of buttons */}
          <div className="flex mt-8" style={{
            width: `${totalWidth}px`
          }}>
            {bottomButtons.map((button, index) => <PianoKey key={`bottom-${index}`} note={button.note} octave={0} isBlack={false} isTopKey={true} onPress={() => console.log(`Bottom button ${index + 1} pressed`)} style={button.style} />)}
          </div>

          {/* Second Divider */}
          <div className="mt-8" style={{
            width: `${totalWidth}px`
          }}>
            <Separator className="bg-gray-200" />
          </div>

          {/* Final row of 12 keys */}
          <div className="flex mt-8" style={{
            width: `${totalWidth}px`
          }}>
            {Array.from({
              length: 12
            }, (_, i) => ({
              note: `Final${i + 1}`,
              isBlack: false,
              isTopKey: true,
              style: {
                width: `${twelveKeyWidth}px`
              }
            })).map((key, index) => <PianoKey key={`final-${index}`} note={key.note} octave={0} isBlack={false} isTopKey={true} onPress={() => console.log(`Final row key ${index + 1} pressed`)} style={key.style} />)}
          </div>
        </div>

        {/* Right vertical divider */}
        <Separator className="mx-4 h-full bg-gray-200" orientation="vertical" />

        {/* Right vertical section */}
        <div className="flex flex-col ml-8">
          {verticalButtonGroups.map((group, groupIndex) => <React.Fragment key={`right-group-${groupIndex}`}>
              <div className="flex flex-col gap-0">
                {group.map((button, buttonIndex) => <PianoKey key={`right-vertical-${groupIndex}-${buttonIndex}`} note={button.note} octave={0} isBlack={false} isTopKey={true} onPress={() => console.log(`Right vertical button ${groupIndex * 3 + buttonIndex + 1} pressed`)} style={button.style} />)}
              </div>
              {groupIndex < verticalButtonGroups.length - 1 && <div className="my-4">
                  <Separator className="bg-gray-200" orientation="horizontal" />
                </div>}
            </React.Fragment>)}
        </div>

        {/* Rightmost new column with 16 buttons */}
        <Separator className="mx-4 h-full bg-gray-200" orientation="vertical" />
        
        <div className="flex flex-col ml-8">
          <div className="flex flex-col gap-0">
            {sixteenButtonGroup.map((button, index) => <PianoKey key={`far-right-${index}`} note={button.note} octave={0} isBlack={false} isTopKey={true} onPress={() => console.log(`Far right button ${index + 1} pressed`)} style={button.style} />)}
          </div>
        </div>
      </div>
    </div>
  </div>;
};
export default Piano;