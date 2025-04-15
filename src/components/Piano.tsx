import React from 'react';
import PianoKey from './PianoKey';
import { Separator } from './ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

const Piano = () => {
  const isMobile = useIsMobile();

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

  // Adjust width calculations based on screen size
  const totalWidth = isMobile ? 360 : 1092; // 21 white keys × 52px = 1092px for desktop
  const topKeyWidth = totalWidth / (isMobile ? 8 : 15); // Fewer keys on mobile
  const bottomKeyWidth = totalWidth / (isMobile ? 12 : 21);
  const twelveKeyWidth = totalWidth / 12;
  const sideButtonWidth = isMobile ? '52px' : '104px';

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

  // Adjust vertical button configurations
  const verticalButtonGroups = Array.from({
    length: isMobile ? 2 : 4
  }, (_, groupIndex) => Array.from({
    length: 3
  }, (_, buttonIndex) => ({
    note: `Side${groupIndex * 3 + buttonIndex + 1}`,
    isBlack: false,
    isTopKey: true,
    style: {
      width: sideButtonWidth,
      height: '52px',
      backgroundColor: '#8cb4d5',
      marginBottom: groupIndex < (isMobile ? 1 : 3) ? '0' : '0'
    }
  })));

  // Adjust sixteen button group configuration
  const sixteenButtonGroup = Array.from({
    length: isMobile ? 8 : 16
  }, (_, index) => ({
    note: `Left${index + 1}`,
    isBlack: false,
    isTopKey: true,
    style: {
      width: sideButtonWidth,
      height: '45px',
      backgroundColor: '#5474b4',
      marginBottom: '0'
    }
  }));

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#333333] p-2 md:p-8">
      <div className="flex flex-col rounded-lg shadow-2xl p-4 md:p-8 bg-slate-900 w-full max-w-[1400px] 
        border-[8px] md:border-[16px] border-[#403E43] 
        relative 
        before:absolute before:inset-0 
        before:border-[4px] md:before:border-[8px] 
        before:border-[#221F26] 
        before:pointer-events-none 
        before:z-[-1]">
        
        {/* Logo and title section */}
        <div className="flex items-center justify-between mb-4">
          <img 
            src="/lovable-uploads/d0be4dda-e062-4ecc-8661-b1c242693570.png" 
            alt="Atari Hotz Logo" 
            className="h-8 md:h-16 w-auto object-contain mr-4" 
          />
          <div className="text-white text-lg md:text-2xl font-bold tracking-wider">
            MIDI TRANSLATOR
          </div>
        </div>

        <Separator className="mb-4 md:mb-8 bg-gray-200" />

        {/* Piano layout */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-0">
          {/* Left column - only show on desktop */}
          {!isMobile && (
            <>
              <div className="flex flex-col mr-8">
                <div className="flex flex-col gap-0">
                  {sixteenButtonGroup.map((button, index) => (
                    <PianoKey
                      key={`far-left-${index}`}
                      note={button.note}
                      octave={0}
                      isBlack={false}
                      isTopKey={true}
                      onPress={() => console.log(`Far left button ${index + 1} pressed`)}
                      style={button.style}
                    />
                  ))}
                </div>
              </div>
              <Separator className="mx-4 h-full bg-gray-200" orientation="vertical" />
            </>
          )}

          {/* Left vertical section - only show on desktop */}
          {!isMobile && (
            <>
              <div className="flex flex-col mr-8">
                {verticalButtonGroups.map((group, groupIndex) => (
                  <React.Fragment key={`left-group-${groupIndex}`}>
                    <div className="flex flex-col gap-0">
                      {group.map((button, buttonIndex) => (
                        <PianoKey
                          key={`left-vertical-${groupIndex}-${buttonIndex}`}
                          note={button.note}
                          octave={0}
                          isBlack={false}
                          isTopKey={true}
                          onPress={() => console.log(`Left vertical button ${groupIndex * 3 + buttonIndex + 1} pressed`)}
                          style={button.style}
                        />
                      ))}
                    </div>
                    {groupIndex < verticalButtonGroups.length - 1 && (
                      <div className="my-4">
                        <Separator className="bg-gray-200" orientation="horizontal" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <Separator className="mx-4 h-full bg-gray-200" orientation="vertical" />
            </>
          )}

          {/* Piano section */}
          <div className="flex flex-col">
            {/* Top row of keys */}
            <div className="flex" style={{ width: `${totalWidth}px` }}>
              {topKeys.slice(0, isMobile ? 8 : 15).map((key, index) => (
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
              {threeOctaves.slice(0, isMobile ? 12 : undefined).map((noteObj, index) => {
                const octave = Math.floor(index / 12) + 4;
                return (
                  <PianoKey
                    key={`${noteObj.note}-${octave}-${index}`}
                    note={noteObj.note}
                    octave={octave}
                    isBlack={noteObj.isBlack}
                    isTopKey={false}
                    onPress={() => console.log(`Piano key ${noteObj.note}${octave} pressed`)}
                    whiteKeyColor="#8cb4d5"
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
              {bottomButtons.slice(0, isMobile ? 12 : 21).map((button, index) => (
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
          </div>

          {/* Right sections - only show on desktop */}
          {!isMobile && (
            <>
              <Separator className="mx-4 h-full bg-gray-200" orientation="vertical" />
              <div className="flex flex-col ml-8">
                {verticalButtonGroups.map((group, groupIndex) => (
                  <React.Fragment key={`right-group-${groupIndex}`}>
                    <div className="flex flex-col gap-0">
                      {group.map((button, buttonIndex) => (
                        <PianoKey
                          key={`right-vertical-${groupIndex}-${buttonIndex}`}
                          note={button.note}
                          octave={0}
                          isBlack={false}
                          isTopKey={true}
                          onPress={() => console.log(`Right vertical button ${groupIndex * 3 + buttonIndex + 1} pressed`)}
                          style={button.style}
                        />
                      ))}
                    </div>
                    {groupIndex < verticalButtonGroups.length - 1 && (
                      <div className="my-4">
                        <Separator className="bg-gray-200" orientation="horizontal" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Separator className="mx-4 h-full bg-gray-200" orientation="vertical" />

              <div className="flex flex-col ml-8">
                <div className="flex flex-col gap-0">
                  {sixteenButtonGroup.map((button, index) => (
                    <PianoKey
                      key={`far-right-${index}`}
                      note={button.note}
                      octave={0}
                      isBlack={false}
                      isTopKey={true}
                      onPress={() => console.log(`Far right button ${index + 1} pressed`)}
                      style={button.style}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Piano;
