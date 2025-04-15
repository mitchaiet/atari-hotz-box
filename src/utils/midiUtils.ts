
import { toast } from "sonner";

// MIDI utility functions for handling MIDI connections and messages

// Track the MIDI output
let midiOutput: WebMidi.MIDIOutput | null = null;
let midiOutputs: WebMidi.MIDIOutput[] = [];
let midiAccessGranted = false;

// Enhanced MIDI initialization with more detailed error handling
export const initMIDI = async (): Promise<boolean> => {
  try {
    if (!navigator.requestMIDIAccess) {
      toast.error('WebMIDI is not supported in this browser', {
        description: 'Please use a browser that supports WebMIDI (Chrome recommended)'
      });
      return false;
    }

    const midiAccess = await navigator.requestMIDIAccess({ sysex: true });
    midiAccessGranted = true;
    
    // Get available MIDI outputs
    midiOutputs = Array.from(midiAccess.outputs.values());
    
    // If we have at least one output, use the first one by default
    if (midiOutputs.length > 0) {
      midiOutput = midiOutputs[0];
      toast.success('MIDI Connected', {
        description: `Connected to MIDI output: ${midiOutput.name}`
      });
    } else {
      toast.warning('No MIDI Outputs', {
        description: 'No MIDI output devices are currently available'
      });
    }

    // Setup listeners for when MIDI devices connect/disconnect
    midiAccess.onstatechange = (event) => {
      const port = event.port;
      console.log(`MIDI port ${port.name} ${port.state} (${port.type})`);
      
      if (port.type === 'output') {
        // Refresh our list of outputs
        midiOutputs = Array.from(midiAccess.outputs.values());
        
        if (port.state === 'connected') {
          toast.success('MIDI Device Added', {
            description: `New MIDI output available: ${port.name}`
          });
        } else if (port.state === 'disconnected') {
          toast.warning('MIDI Device Removed', {
            description: `MIDI output disconnected: ${port.name}`
          });
          // If our current output was disconnected, try to use another one
          if (midiOutput && port.id === midiOutput.id) {
            midiOutput = midiOutputs.length > 0 ? midiOutputs[0] : null;
            if (midiOutput) {
              toast.info('MIDI Output Switched', {
                description: `Switched to MIDI output: ${midiOutput.name}`
              });
            } else {
              toast.error('No MIDI Outputs', {
                description: 'No MIDI outputs are currently available'
              });
            }
          }
        }
      }
    };

    return true;
  } catch (error) {
    toast.error('MIDI Initialization Error', {
      description: error instanceof Error ? error.message : 'An unknown error occurred'
    });
    return false;
  }
};

// Improved MIDI Note On message with more robust error handling
export const sendNoteOn = (note: number, velocity: number = 127, channel: number = 0): void => {
  try {
    if (!midiOutput || !midiAccessGranted) {
      console.warn('Cannot send MIDI Note On: No MIDI output available');
      return;
    }
    
    // Validate note and velocity ranges
    if (note < 0 || note > 127) {
      console.warn(`Invalid MIDI note: ${note}. Must be between 0 and 127`);
      return;
    }
    
    if (velocity < 0 || velocity > 127) {
      console.warn(`Invalid MIDI velocity: ${velocity}. Must be between 0 and 127`);
      return;
    }

    // Note On message: [0x90 + channel, note, velocity]
    midiOutput.send([0x90 + channel, note, velocity]);
  } catch (error) {
    console.error('Failed to send MIDI Note On:', error);
  }
};

// Improved MIDI Note Off message
export const sendNoteOff = (note: number, velocity: number = 0, channel: number = 0): void => {
  try {
    if (!midiOutput || !midiAccessGranted) {
      console.warn('Cannot send MIDI Note Off: No MIDI output available');
      return;
    }
    
    // Validate note and velocity ranges
    if (note < 0 || note > 127) {
      console.warn(`Invalid MIDI note: ${note}. Must be between 0 and 127`);
      return;
    }
    
    if (velocity < 0 || velocity > 127) {
      console.warn(`Invalid MIDI velocity: ${velocity}. Must be between 0 and 127`);
      return;
    }

    // Note Off message: [0x80 + channel, note, velocity]
    midiOutput.send([0x80 + channel, note, velocity]);
  } catch (error) {
    console.error('Failed to send MIDI Note Off:', error);
  }
};

// More comprehensive MIDI Control Change method
export const sendControlChange = (controller: number, value: number, channel: number = 0): void => {
  try {
    if (!midiOutput || !midiAccessGranted) {
      console.warn('Cannot send MIDI Control Change: No MIDI output available');
      return;
    }
    
    // Validate controller and value ranges
    if (controller < 0 || controller > 127) {
      console.warn(`Invalid MIDI controller: ${controller}. Must be between 0 and 127`);
      return;
    }
    
    if (value < 0 || value > 127) {
      console.warn(`Invalid MIDI control value: ${value}. Must be between 0 and 127`);
      return;
    }

    // Control Change message: [0xB0 + channel, controller, value]
    midiOutput.send([0xB0 + channel, controller, value]);
  } catch (error) {
    console.error('Failed to send MIDI Control Change:', error);
  }
};

// Get the available MIDI outputs with more details
export const getMIDIOutputs = (): WebMidi.MIDIOutput[] => {
  return midiOutputs;
};

// Set the current MIDI output with additional validation and feedback
export const setMIDIOutput = (outputId: string): boolean => {
  const output = midiOutputs.find(output => output.id === outputId);
  if (output) {
    midiOutput = output;
    toast.success('MIDI Output Changed', {
      description: `MIDI output set to: ${output.name}`
    });
    return true;
  }
  
  toast.error('MIDI Output Selection Failed', {
    description: 'Could not find the selected MIDI output'
  });
  return false;
};

// Get detailed information about available MIDI outputs
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

// Enhanced key to MIDI note mapping
export const mapKeyToMIDINote = (note: string, octave: number): number => {
  const baseNotes: Record<string, number> = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 
    'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 
    'A#': 10, 'B': 11
  };
  
  // For piano keys with note/octave
  if (note in baseNotes) {
    return baseNotes[note] + (octave * 12);
  }
  
  // For functional buttons, map to different MIDI notes/CC values
  const keyPattern = /^([A-Za-z]+)(\d+)$/;
  const match = note.match(keyPattern);
  
  if (match) {
    const [, buttonType, buttonNumber] = match;
    const num = parseInt(buttonNumber, 10);
    
    // More granular mapping for different button types
    switch (buttonType) {
      case 'Key': return 0 + num;
      case 'Button': return 16 + num;
      case 'Side': return 40 + num;
      case 'Left':
      case 'Far': return 60 + num;
      case 'Final': return 80 + num;
      default: return 100 + num;
    }
  }
  
  // Default fallback for unrecognized keys
  return 60; // Middle C
};
