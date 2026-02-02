# Project Timer

A simple USB device-controlled timer application for tracking work projects.

## Prerequisites

- [Bun](https://bun.sh/) - A fast JavaScript runtime and package manager

## Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure your device and macros:**
   ```bash
   bun run setup
   ```
   This will:
   - Detect your USB device and create `.env` file
   - Create a default `macros.json` configuration file

## Usage

**Start the application:**
```bash
bun start
```

Press the configured keys on your device to start/stop timers.

## Customizing Macros

Edit the `macros.json` file to customize your timer macros:

```json
{
  "1": "Your custom macro 1",
  "2": "Your custom macro 2",
  "3": "Your custom macro 3"
}
```

The key corresponds to the button press, and the value is your timer description.

## Special Commands

- **Enter**: View all active sessions