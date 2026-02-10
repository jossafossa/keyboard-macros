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
      "type": "timer",
      "value": "Bug Fixes",
      "character": "🟢"
    },
    "4": {
      "type": "timer",
      "value": "Meetings & Admin",
      "character": "🔵"
    },
    "5": {
      "type": "timer",
      "value": "Other Tasks",
      "character": "⚪️"
    },
    "6": {
      "type": "timer",
      "value": "Code Review",
      "character": "🟣"
    },
    "7": {
      "type": "timer",
      "value": "Research",
      "character": "🟤"
    }
  }
}
```

- **useOnlyOneTimer**: Set to `true` to stop other timers when starting a new one
- **type**: Always `"timer"` for timer macros
- **value**: Description of the timer/project
- **character**: Emoji icon to display

The key corresponds to the button press, and the value is your timer description.

## Special Commands

- **Enter**: View all active sessions and accumulated time (opens in text file)
- **Number keys (1-8)**: Start/stop specific project timers  
- **9**: Play random sound effect
- **0**: Show timer overview notification
- **-** (Minus): Clear all timer sessions
- **=** (Equals): Stop all currently running timers

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