# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Bot
- `node index.js` - Start the bot directly
- PM2 is configured in `ecosystem.config.js` for production deployment

### Code Quality
- `npx eslint .` - Run ESLint linting (uses `eslint.config.mjs`)
- `npm run up` - Update all dependencies and run audit fix

### Configuration Management  
- `!reload-config` - Hot reload server configurations without restart (in Discord)
- `!check-migration` - Verify all servers have proper configurations (in Discord)

## Architecture Overview

### Core Structure
- **Entry Point**: `index.js` - Initializes Discord client with required intents and loads handlers
- **Configuration System**: Modular server configs in `config/servers/` loaded by `config/guilds.js` 
- **Event-Driven**: Discord events handled in `events/` directory
- **Command System**: Commands in `commands/` with handlers in `handlers/`
- **Database**: MongoDB via Mongoose (`database/mongoose.js`)
- **Web Server**: Express server in `www/` directory
- **Automation**: Cron jobs in `cron/` for scheduled tasks

### Handler System
- `handlers/command.js` - Loads traditional prefix commands
- `handlers/event.js` - Loads Discord event handlers  
- `handlers/slash.js` - Loads slash commands

### Key Features Architecture
1. **Modular Server Configurations**: Each Discord server has its own config file in `config/servers/`
2. **Flexible Reactions System**: Array-based reaction configs with validation, threading, and custom emojis
3. **Voice Channel Statistics**: Dynamic member count updates
4. **Time-Based Modes**: Cron-scheduled server appearance changes (day/night modes)
5. **Verification System**: hCaptcha-based member verification
6. **CleverBot Integration**: Chat responses in designated channels

### Configuration System
- Server configs loaded from `config/servers/*.js` by `config/guilds.js`
- Each config exports an object with `id` (Discord server ID) as the primary key
- Development configs use `dev: true` flag and are preferred when `NODE_ENV=development`
- Hot reload capability allows config changes without bot restart
- Backward compatibility maintained for legacy property access patterns

### Reaction System Architecture
The flexible reaction system uses an array-based approach:

```javascript
reactions: [
  {
    name: 'unique-name',
    enabled: true/false,
    channels: ['channel_id1', 'channel_id2'],
    emojis: ['😍', '👍'],
    thread: {
      enabled: true/false,
      nameTemplate: author => `${author.username}: Comments`,
      autoArchiveDuration: 1440, // minutes
      reason: author => `Thread for ${author.tag}`,
      startMessage: { embeds: [...] }
    },
    validation: {
      onlyImages: { message: 'Only images allowed!' },
      textLength: { min: 20, message: minLength => `Minimum ${minLength} chars` }
    }
  }
]
```

### Environment Handling
- Production: Uses standard configs from `config/servers/`
- Development: Prefers configs with `dev: true` when `NODE_ENV=development`
- Environment variables loaded via `node:process.loadEnvFile()`

## Code Style and Standards

### ESLint Configuration
- Tab indentation (not spaces)
- Single quotes for strings
- Semicolons required
- No console statements allowed in production (but currently disabled)
- Max 4 nested callbacks
- Prefer const over let/var
- Arrow function spacing enforced

### File Organization
- Event handlers in `events/` directory
- Commands in `commands/` directory with subdirectories:
  - `commands/prefix/` - Traditional prefix commands (loaded by `handlers/command.js`)
  - `commands/slashes/` - Slash commands (loaded by `handlers/slash.js`)
- Configuration files in `config/servers/` directory
- Utility scripts in `scripts/` directory
- Database models likely in `models/` directory
- Web routes in `www/` directory (not `web/`)
- Automation tasks in `cron/` directory

### Dependencies
- **discord.js v14** - Main Discord API wrapper
- **mongoose** - MongoDB ODM
- **express** - Web server framework
- **cron** - Scheduled task management
- **@sefinek/cleverbot-free** - Chat integration
- **axios** - HTTP requests
- **helmet** - Security middleware

## Development Notes

- Bot uses CommonJS modules (`type: "commonjs"` in package.json)
- PM2 configured for production with auto-restart and logging
- No test suite currently configured
- Development/production split handled through NODE_ENV and config flags
- Hot reload supported for configuration changes via Discord commands

## Command Structure Details

### Prefix Commands Structure
Prefix commands are organized in subdirectories by permission level:
- `1_admins/` - Administrator-only commands (eval, shell, shutdown, etc.)
- `2_mods/` - Moderator commands (clear, reload-config)  
- `3_dating/` - General/dating server specific commands

### Handler Loading Process
1. `handlers/command.js` recursively loads all `.js` files from `commands/prefix/`
2. `handlers/event.js` loads all event files from `events/` directory
3. `handlers/slash.js` loads slash commands from `commands/slashes/`
4. Commands must have proper `name` property and `execute` function
5. Events must have `name` and `execute` properties

### Configuration Loading Logic
Server configs in `config/servers/` are loaded with environment awareness:
- In development (`NODE_ENV=development`): Prefers configs with `dev: true`
- In production: Uses configs without `dev: true` flag
- Each config must have unique `id` matching Discord server ID
- Template available at `config/servers/template.example.js`

## Database Integration
- MongoDB connection established in `database/mongoose.js`
- Connection uses `MONGODB_URL` environment variable  
- Automatic reconnection and error handling built-in
- Process exits on connection failure for fail-fast behavior