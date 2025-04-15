// MIDI utility functions for handling MIDI connections and messages

// Track the MIDI output
let midiOutput: WebMidi.MIDIOutput | null = null;
let midiOutputs: WebMidi.MIDIOutput[] = [];
let midiAccessGranted = false;

// Initialize WebMIDI
export const initMIDI = async (): Promise<boolean> => {
  try {
    if (!navigator.requestMIDIAccess) {
      console.error('WebMIDI is not supported in this browser');
      return false;
    }

    const midiAccess = await navigator.requestMIDIAccess();
    midiAccessGranted = true;
    
    // Get available MIDI outputs
    midiOutputs = Array.from(midiAccess.outputs.values());
    
    // If we have at least one output, use the first one by default
    if (midiOutputs.length > 0) {
      midiOutput = midiOutputs[0];
      console.log(`Connected to MIDI output: ${midiOutput.name}`);
    } else {
      console.log('No MIDI outputs available');
    }

    // Setup listeners for when MIDI devices connect/disconnect
    midiAccess.onstatechange = (event) => {
      const port = event.port;
      console.log(`MIDI port ${port.name} ${port.state} (${port.type})`);
      
      if (port.type === 'output') {
        // Refresh our list of outputs
        midiOutputs = Array.from(midiAccess.outputs.values());
        
        if (port.state === 'connected') {
          console.log(`New MIDI output available: ${port.name}`);
        } else if (port.state === 'disconnected') {
          console.log(`MIDI output disconnected: ${port.name}`);
          // If our current output was disconnected, try to use another one
          if (midiOutput && port.id === midiOutput.id) {
            midiOutput = midiOutputs.length > 0 ? midiOutputs[0] : null;
            if (midiOutput) {
              console.log(`Switched to MIDI output: ${midiOutput.name}`);
            } else {
              console.log('No MIDI outputs available');
            }
          }
        }
      }
    };

    return true;
  } catch (error) {
    console.error('Error initializing MIDI:', error);
    return false;
  }
};

// Send a MIDI Note On message
export const sendNoteOn = (note: number, velocity: number = 127, channel: number = 0): void => {
  if (!midiOutput || !midiAccessGranted) return;
  
  // Note On message: [0x90 + channel, note, velocity]
  midiOutput.send([0x90 + channel, note, velocity]);
};

// Send a MIDI Note Off message
export const sendNoteOff = (note: number, velocity: number = 0, channel: number = 0): void => {
  if (!midiOutput || !midiAccessGranted) return;
  
  // Note Off message: [0x80 + channel, note, velocity]
  midiOutput.send([0x80 + channel, note, velocity]);
};

// Send a MIDI Control Change message
export const sendControlChange = (controller: number, value: number, channel: number = 0): void => {
  if (!midiOutput || !midiAccessGranted) return;
  
  // Control Change message: [0xB0 + channel, controller, value]
  midiOutput.send([0xB0 + channel, controller, value]);
};

// Get the available MIDI outputs
export const getMIDIOutputs = (): WebMidi.MIDIOutput[] => {
  return midiOutputs;
};

// Set the current MIDI output
export const setMIDIOutput = (outputId: string): boolean => {
  const output = midiOutputs.find(output => output.id === outputId);
  if (output) {
    midiOutput = output;
    console.log(`MIDI output set to: ${output.name}`);
    return true;
  }
  return false;
};

// Get information about the current MIDI output
export const getMIDIOutputInfo = () => {
  return midiOutputs.map(output => ({
    id: output.id,
    name: output.name,
    manufacturer: output.manufacturer,
    state: output.state,
    isSelected: midiOutput?.id === output.id
  }));
};

// Check if WebMIDI is supported
export const isMIDISupported = (): boolean => {
  return 'requestMIDIAccess' in navigator;
};

// Check if MIDI access was granted
export const isMIDIAccessGranted = (): boolean => {
  return midiAccessGranted;
};

// Map key names to MIDI notes
export const mapKeyToMIDINote = (note: string, octave: number): number => {
  const baseNotes: Record<string, number> = {
    'C': 0,
    'C#': 1,
    'D': 2,
    'D#': 3,
    'E': 4,
    'F': 5,
    'F#': 6,
    'G': 7,
    'G#': 8,
    'A': 9,
    'A#': 10,
    'B': 11
  };
  
  // For piano keys with note/octave
  if (note in baseNotes) {
    return baseNotes[note] + (octave * 12);
  }
  
  // For functional buttons, map to different MIDI notes/CC values
  // Extract button type and number
  const keyPattern = /^([A-Za-z]+)(\d+)$/;
  const match = note.match(keyPattern);
  
  if (match) {
    const [, buttonType, buttonNumber] = match;
    const num = parseInt(buttonNumber, 10);
    
    // Map different button types to different MIDI note ranges
    switch (buttonType) {
      case 'Key':
        return 0 + num; // Top row keys: 1-15
      case 'Button':
        return 16 + num; // Bottom row buttons: 17-37
      case 'Side':
        return 40 + num; // Side buttons: 41-52
      case 'Left':
      case 'Far':
        return 60 + num; // Far left/right buttons: 61-76
      case 'Final':
        return 80 + num; // Final row: 81-92
      default:
        return 100 + num; // Default fallback
    }
  }
  
  // Default fallback for unrecognized keys
  return 60; // Middle C
};
