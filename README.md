
# HotzBox MIDI Interface

🎹 **[Live Demo](https://hotz-midi-translator.lovable.app/)** - Experience the Hotz MIDI Translator Online!

![Hotz MIDI Translator Interface](/public/lovable-uploads/Hotz_Translator_MIDI_Interface.png)

A web-based MIDI interface for translating touch gesture inputs into MIDI signals, inspired by the Hotz MIDI Translator.

## Project Overview

The HotzBox MIDI Interface is a digital recreation of the legendary Hotz MIDI Translator, a groundbreaking device developed in the early 1980s that revolutionized MIDI input and translation for musicians and electronic music producers.

## Features

- **Real-time MIDI Translation**: Converts keyboard inputs into MIDI signals in real-time
- **Debug Console**: Built-in MIDI debug console to monitor MIDI events and messages
- **Interactive Interface**: Visual representation of the Hotz MIDI translator layout
- **WebMIDI Support**: Leverages the Web MIDI API for direct MIDI output
- **Customizable MIDI Output**: Select from available MIDI output devices
- **Event Monitoring**: Real-time logging of MIDI events, touches, and system messages

## Technical Details

This project uses the Web MIDI API to send MIDI signals directly from the browser. The interface includes:

- Vertical key columns for MIDI note input
- Real-time MIDI event monitoring through the built-in debug console
- Support for multiple MIDI output devices
- Color-coded event logging for different types of MIDI messages

## About the Hotz MIDI Translator

The original Hotz MIDI Translator was a pioneering device created by Bob Hotz in the early days of MIDI technology. It provided musicians with an unprecedented ability to translate and route MIDI signals, becoming an essential tool in electronic music studios during the 1980s.

## Browser Requirements

This application requires a browser that supports the Web MIDI API. Most modern browsers support this feature, including:
- Chrome
- Edge
- Opera

Safari and Firefox currently have limited or no support for Web MIDI API.

## Setup and Installation

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installation Steps

```sh
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd hotzbox-midi-interface

# Install dependencies
npm install

# Start development server
npm run dev
```

## Technologies Used

- Vite
- TypeScript
- React
- Web MIDI API
- Tailwind CSS

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Information Links

- [Hotz MIDI Translator Demo Video](https://www.youtube.com/watch?v=pzj4y_vtTkc) - Watch a demonstration of the original Hotz MIDI Translator in action

[![Hotz MIDI Translator Demo Video](https://img.youtube.com/vi/pzj4y_vtTkc/0.jpg)](https://www.youtube.com/watch?v=pzj4y_vtTkc)

## License

© 2025 Mitch Chaiet. All rights reserved.
