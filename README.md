# Macros - Project Timer

A simple USB device-controlled timer application for tracking work projects with automatic startup and background logging.

## Prerequisites

- [Bun](https://bun.sh/) - A fast JavaScript runtime and package manager
- A compatible HID device (tested with YourType Wireless KeyPad)

## Quick Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure your device and macros:**
   ```bash
   bun run setup
   ```
   This interactive setup will:
   - Detect your USB device and create `.env` file
   - Create a default `settings.json` configuration file
   - **Optionally configure automatic startup** when you open a terminal

## Usage

### Manual Start
```bash
bun run start
```

### Automatic Background Start
If you enabled autostart during setup, the app will start automatically in the background when you open a new terminal session.

Press the configured keys on your device to start/stop timers.

## Monitoring & Control

### View Logs
```bash
tail -f ./logs/macros.log
```

### Check if Running
```bash
ps aux | grep bun | grep macros
```

### Stop Background Process
```bash
kill $(cat ./.macros.pid)
```

## Action Types

The application supports several action types that can be configured in your `settings.json` file:

### Available Action Types

| Type | Description | Configuration |
|------|-------------|--------------|
| `timer` | Start/stop specific project timers | Requires `value` field with timer description and `character` field for emoji icon. |
| `soundEffect` | Play random sound effects | - |
| `overview` | Show timer overview notification | - |
| `clearAll` | Clear all timer sessions | - |
| `stopAll` | Stop all currently running timers | - |
| `showAll` | Display all active sessions and accumulated time | - |

## Customizing Macros

Edit the `settings.json` file to customize your timer macros:

```json
{
  "useOnlyOneTimer": true,
  "macros": {
    "1": {
      "type": "timer",
      "value": "Project Development",
      "character": "🔴"
    },
    "2": {
      "type": "timer",
      "value": "Client Work",
      "character": "🟡"
    },
    "3": {
      "type": "soundEffect"
    },
    "4": {
      "type": "overview"
    },
    "5": {
      "type": "clearAll"
    },
    "6": {
      "type": "stopAll"
    },
    "7": {
      "type": "showAll"
    }
  }
}
```

### Configuration Options

- **useOnlyOneTimer**: Set to `true` to stop other timers when starting a new one
- **type**: The action type (see table above)
- **value**: Description of the timer/project (required for `timer` type)
- **character**: Emoji icon to display (optional)

The key corresponds to the button press on your device.

## Action Behavior

The behavior of each action type when triggered:

- **timer**: Toggles the specified timer (starts if stopped, stops if running). If `useOnlyOneTimer` is enabled, stops all other timers first.
- **soundEffect**: Plays a random sound effect from the sound-effects directory
- **overview**: Displays a notification showing the current status of all timers
- **clearAll**: Clears all timer sessions and shows a confirmation notification
- **stopAll**: Stops all currently running timers and shows a confirmation notification
- **showAll**: Shows accumulated time in console table format and opens a text display with the summary

## File Structure

```
├── src/
│   ├── index.ts          # Main application
│   ├── setup.ts          # Interactive setup script
│   ├── connect.ts        # HID device connection
│   └── helpers/          # Utility functions
├── logs/
│   └── macros.log        # Application logs
├── .env                  # Device configuration (auto-generated)
├── .macros.pid          # Process ID for background mode
└── settings.json        # Timer macro configuration
```

### Generated .env format
The setup script creates an `.env` file with your device configuration:

```env
DEVICE_VENDOR_ID=1041
DEVICE_PRODUCT_ID=580
DEVICE_NAME="YourType Wireless KeyPad"
DEVICE_PATH=DevSrvsID:4295947948
```

## Troubleshooting

### App not starting automatically
1. Check if autostart was added to your shell:
   ```bash
   grep -A5 "MACROS_PID_FILE" ~/.zshrc
   ```

2. Re-run setup to add autostart:
   ```bash
   bun run setup
   ```

### Device not detected
1. Make sure your HID device is connected
2. Run setup again to re-detect devices:
   ```bash
   bun run setup
   ```

### View detailed logs
```bash
tail -50 ./logs/macros.log
```