
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { ChevronDown, Music2 } from "lucide-react";
import { getMIDIOutputs, setMIDIOutput } from '@/utils/midiUtils';

interface MIDIOutputSelectorProps {
  selectedOutput: string;
  onOutputChange: (outputId: string) => void;
}

const MIDIOutputSelector = ({ selectedOutput, onOutputChange }: MIDIOutputSelectorProps) => {
  const midiOutputs = getMIDIOutputs();
  const selectedDevice = midiOutputs.find(output => output.id === selectedOutput);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[260px] justify-between bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
        >
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4" />
            <span className="truncate">
              {selectedDevice ? selectedDevice.name : 'Select MIDI Output'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[260px] bg-slate-800 text-white border-slate-700"
      >
        <DropdownMenuLabel>MIDI Output Devices</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {midiOutputs.map((output) => (
          <DropdownMenuItem
            key={output.id}
            onClick={() => onOutputChange(output.id)}
            className={`flex flex-col items-start ${
              selectedOutput === output.id ? 'bg-slate-700' : ''
            }`}
          >
            <div className="font-medium">{output.name}</div>
            <div className="text-xs text-slate-400">
              {output.manufacturer || 'Unknown manufacturer'}
            </div>
          </DropdownMenuItem>
        ))}
        {midiOutputs.length === 0 && (
          <DropdownMenuItem disabled>
            No MIDI outputs available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MIDIOutputSelector;
