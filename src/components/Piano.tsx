import React, { useEffect, useState } from 'react';
import PianoKey from './PianoKey';
import { Separator } from './ui/separator';
import { initMIDI, isMIDISupported, getMIDIOutputs, setMIDIOutput } from '@/utils/midiUtils';
import { Button } from './ui/button';
import { Maximize, Minimize, HelpCircle } from 'lucide-react';
import MIDIOutputSelector from './MIDIOutputSelector';
import MIDIDebugConsole from './MIDIDebugConsole';

const Piano = () => {
  const [midiInitialized, setMidiInitialized] = useState(false);
  const [midiOutputs, setMidiOutputs] = useState<WebMidi.MIDIOutput[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const setupMidi = async () => {
      const initialized = await initMIDI();
      setMidiInitialized(initialized);
      if (initialized) {
        const outputs = getMIDIOutputs();
        setMidiOutputs(outputs);
        if (outputs.length > 0) {
          setSelectedOutput(outputs[0].id);
        }
      }
    };
    
    setupMidi();
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleOutputChange = (outputId: string) => {
    setSelectedOutput(outputId);
    setMIDIOutput(outputId);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getMidiStatus = () => {
    if (!isMIDISupported()) return "MIDI Not Supported";
    if (!midiInitialized) return "MIDI Available";
    return midiOutputs.length > 0 ? "MIDI Ready" : "No MIDI Outputs";
  };

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

  const threeOctaves = [...notes, ...notes, ...notes];

  const whiteKeys = threeOctaves.filter(note => !note.isBlack).slice(0, 21);

  const totalWidth = 1092;
  const topKeyWidth = totalWidth / 15;
  const bottomKeyWidth = totalWidth / 21;
  const twelveKeyWidth = totalWidth / 12;

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

  // Updating sixteenButtonGroup to match styles
  const sixteenButtonGroup = Array.from({
    length: 16
  }, (_, index) => ({
    note: `Button${index + 1}`,
    isBlack: false,
    isTopKey: true,
    style: {
      width: '104px',
      height: '45px',
      backgroundColor: '#5474b4',
      marginBottom: '0'
    }
  }));

  // Assign unique numbers to each key group
  let keyCounter = 1;

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
        
        <div className="flex items-center justify-between mb-4 w-full">
          <img 
            src="/lovable-uploads/d0be4dda-e062-4ecc-8661-b1c242693570.png" 
            alt="Atari Hotz Logo" 
            className="h-12 md:h-16 w-auto object-contain mr-4" 
          />
          <div className="text-white text-2xl md:text-3xl font-['Orbitron'] font-bold tracking-wider uppercase">
            MIDI TRANSLATOR
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`h-2 w-2 rounded-full ${
              !isMIDISupported() ? 'bg-red-500' :
              !midiInitialized ? 'bg-yellow-500' :
              midiOutputs.length > 0 ? 'bg-green-500' : 'bg-red-500'
            }`} />
            
            {midiInitialized && (
              <MIDIOutputSelector
                selectedOutput={selectedOutput}
                onOutputChange={handleOutputChange}
              />
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => window.open('https://www.hotzstore.com/Support/Manuals/Hotz_Translator_III_Manual.pdf', '_blank')}
              aria-label="View manual"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? 
                <Minimize className="h-3 w-3" /> : 
                <Maximize className="h-3 w-3" />
              }
            </Button>
          </div>
        </div>

        <Separator className="mb-4 md:mb-8 bg-gray-200" />

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-4 md:gap-8 w-full">
          <div className="flex flex-row md:flex-col gap-2 md:gap-0 flex-shrink-0">
            {sixteenButtonGroup.map((button, index) => (
              <PianoKey
                key={`far-left-${index}`}
                note={`Left${index + 1}`}
                octave={0}
                isBlack={false}
                isTopKey={true}
                onPress={() => console.log(`Far left button ${index + 1} pressed`)}
                style={{...button.style, width: undefined}}
                className="w-full md:w-[104px]"
                isCCControl={true}
                ccNumber={60 + index}
                keyNumber={keyCounter++}
              />
            ))}
          </div>

          <Separator className="hidden md:block h-full bg-gray-200" orientation="vertical" />

          <div className="flex flex-row md:flex-col gap-4 flex-shrink-0">
            {verticalButtonGroups.map((group, groupIndex) => (
              <React.Fragment key={`left-group-${groupIndex}`}>
                <div className="flex flex-row md:flex-col gap-2 md:gap-0">
                  {group.map((button, buttonIndex) => (
                    <PianoKey
                      key={`left-vertical-${groupIndex}-${buttonIndex}`}
                      note={`Side${groupIndex * 3 + buttonIndex + 1}`}
                      octave={0}
                      isBlack={false}
                      isTopKey={true}
                      onPress={() => console.log(`Left vertical button ${groupIndex * 3 + buttonIndex + 1} pressed`)}
                      style={{...button.style, width: undefined}}
                      className="w-full md:w-[104px]"
                      isCCControl={true}
                      ccNumber={40 + (groupIndex * 3) + buttonIndex}
                      keyNumber={keyCounter++}
                    />
                  ))}
                </div>
                {groupIndex < verticalButtonGroups.length - 1 && (
                  <Separator className="hidden md:block bg-gray-200" orientation="horizontal" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col items-center flex-grow w-full">
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
                  isCCControl={true}
                  ccNumber={index}
                  keyNumber={keyCounter++}
                />
              ))}
            </div>

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
                    keyNumber={keyCounter++}
                  />
                );
              })}
            </div>

            <div className="mt-8 w-full">
              <Separator className="bg-gray-200" />
            </div>

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
                  isCCControl={true}
                  ccNumber={16 + index}
                  keyNumber={keyCounter++}
                />
              ))}
            </div>

            <div className="mt-8 w-full">
              <Separator className="bg-gray-200" />
            </div>

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
                  isCCControl={true}
                  ccNumber={80 + index}
                  keyNumber={keyCounter++}
                />
              ))}
            </div>
          </div>

          <Separator className="hidden md:block h-full bg-gray-200" orientation="vertical" />

          <div className="flex flex-row md:flex-col gap-4 flex-shrink-0">
            {verticalButtonGroups.map((group, groupIndex) => (
              <React.Fragment key={`right-group-${groupIndex}`}>
                <div className="flex flex-row md:flex-col gap-2 md:gap-0">
                  {group.map((button, buttonIndex) => (
                    <PianoKey
                      key={`right-vertical-${groupIndex}-${buttonIndex}`}
                      note={`Side${groupIndex * 3 + buttonIndex + 1}`}
                      octave={0}
                      isBlack={false}
                      isTopKey={true}
                      onPress={() => console.log(`Right vertical button ${groupIndex * 3 + buttonIndex + 1} pressed`)}
                      style={{...button.style, width: undefined}}
                      className="w-full md:w-[104px]"
                      isCCControl={true}
                      ccNumber={52 + (groupIndex * 3) + buttonIndex}
                      keyNumber={keyCounter++}
                    />
                  ))}
                </div>
                {groupIndex < verticalButtonGroups.length - 1 && (
                  <Separator className="hidden md:block bg-gray-200" orientation="horizontal" />
                )}
              </React.Fragment>
            ))}
          </div>

          <Separator className="hidden md:block h-full bg-gray-200" orientation="vertical" />

          <div className="flex flex-row md:flex-col gap-2 md:gap-0 flex-shrink-0">
            {sixteenButtonGroup.map((button, index) => (
              <PianoKey
                key={`far-right-${index}`}
                note={`Right${index + 1}`}
                octave={0}
                isBlack={false}
                isTopKey={true}
                onPress={() => console.log(`Far right button ${index + 1} pressed`)}
                style={{...button.style, width: undefined}}
                className="w-full md:w-[104px]"
                isCCControl={true}
                ccNumber={100 + index}
                keyNumber={keyCounter++}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Piano;
