# HotzBox MIDI Interface

A web-based MIDI interface for translating keyboard inputs into MIDI signals, inspired by the Hotz MIDI Translator.

## Project info

**URL**: https://lovable.dev/projects/eb3024bb-b2a8-4a77-aace-49a8b2ea3a51

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

## Browser Requirements

This application requires a browser that supports the Web MIDI API. Most modern browsers support this feature, including:
- Chrome
- Edge
- Opera

Safari and Firefox currently have limited or no support for Web MIDI API.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/eb3024bb-b2a8-4a77-aace-49a8b2ea3a51) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eb3024bb-b2a8-4a77-aace-49a8b2ea3a51) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

© 2025 Mitch Chaiet. All rights reserved.
