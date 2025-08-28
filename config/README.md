# Server Configuration System

This directory contains the new modular server configuration system that replaces the monolithic `guilds.js` file.

## 📁 Structure

```
config/
├── guilds.js           # Main config loader with backward compatibility
├── README.md           # This documentation
└── servers/            # Individual server configurations
    ├── sefinek.js      # Sefinek server
    ├── pomocIT.js      # Pomoc IT - Sefinek
    ├── genshinStellaMod.js # Genshin Stella Mod
    ├── nekosiaAPI.js   # Nekosia API
    ├── milosnaGrota.js # Miłosna Grota (full config)
    ├── masneTesciki.js # Development environment
```

## 🚀 Benefits

### Modular Organization
- **One file per server** - easier to manage large numbers of servers
- **Team collaboration** - multiple people can work on different servers
- **Focused changes** - modifications only affect specific servers

### Hot Reload Capability  
- **Live updates** - use `!reload-config` to reload configs without restart
- **Safe deployment** - test config changes in production safely
- **Development friendly** - fast iteration during development

### Better Structure
- **Logical grouping** - channels, roles, features organized separately
- **Type safety** - structured data with validation
- **Documentation** - inline comments and clear naming

### Environment Support
- **Production configs** - stable server configurations
- **Development configs** - testing environments with different settings
- **Automatic detection** - NODE_ENV based config selection

## 📝 Configuration Format

```javascript
// /config/servers/exampleServer.js
module.exports = {
  // Required: Discord server ID
  id: '1234567890123456789',
  
  // Optional: Environment (defaults to 'production')
  environment: 'development',
  
  // Main server settings
  main: {
    botTrapChannelId: 'channel_id_or_null',
    automodChannelId: 'channel_id',
  },

  // Channel IDs organized by purpose
  channels: {
    lobby: 'channel_id',
    general: 'channel_id',
    // ... more channels
  },

  // Role IDs organized by purpose  
  roles: {
    admin: 'role_id',
    moderator: 'role_id',
    // ... more roles
  },

  // Voice channel statistics
  voiceChannels: {
    members: {
      enabled: true,
      channelId: 'channel_id',
      name: '👥・Members: {count} {arrow}',
    },
    // ... more voice channels
  },

  // Event logging (welcome/farewell/ban)
  events: {
    welcome: {
      channelId: 'channel_id',
      content: (member, memberCount) => ({
        embeds: [/* Discord embed */]
      }),
    },
    // ... more events
  },

  // Direct message configuration
  directMessages: {
    welcome: {
      enabled: true,
      content: member => ({
        embeds: [/* Discord embed */]
      }),
    },
  },

  // Reaction system
  reactions: {
    hearts: {
      channels: ['channel_id1', 'channel_id2'],
      emoji: '❤️',
    },
    // ... more reaction types
  },

  // Time-based modes (day/night)
  timeModes: {
    day: {
      name: 'Server Name・😊',
      banner: 'banner_file.jpg',
      message: 'Good morning message',
      rateLimits: {
        'channel_id': 0, // seconds
      },
    },
    // ... more time modes
  },

  // Feature flags
  features: {
    isDatingServer: false,
    timeBasedModes: false,
    customFeature: true,
    cleverBot: {
      enabled: true,
      channelId: 'channel_id',
    },
  },
};
```

## 🔧 Usage

### Loading Configurations
```javascript
const guilds = require('./config/guilds.js');

// Get server configuration  
const serverConfig = guilds.getServerConfig('1234567890123456789');

// Check features
if (serverConfig.features.isDatingServer) {
  // Dating server specific logic
}

// Access channels
const generalChannel = serverConfig.channels.general;

// Access cleverBot configuration
if (serverConfig.cleverBot) {
  const cleverBotChannelId = serverConfig.cleverBotChannelId;
}

// Access legacy properties (backward compatibility)
const welcomeChannelId = serverConfig.welcomeChannelId;
```

### Hot Reload
Use the `!reload-config` command to reload all configurations without restarting the bot:

```
!reload-config
```

### Migration Check
Use the `!check-migration` command to verify all servers have been migrated:

```
!check-migration
```

## 🔄 Environment Handling

The system automatically selects the appropriate configuration based on `NODE_ENV`:

- **Production** (`NODE_ENV=production` or undefined): Uses standard configs
- **Development** (`NODE_ENV=development`): Prefers configs with `environment: 'development'`

### Example Development Config
```javascript
module.exports = {
  id: '943910440520527873',
  environment: 'development', // This marks it as dev-only
  
  // Development-specific settings
  features: {
    isDatingServer: true,
    developmentMode: true,
    cleverBot: {
      enabled: true,
      channelId: 'channel_id',
    },
  },
  
  // Voice channels with arrow support
  voiceChannels: {
    members: {
      enabled: true,
      channelId: 'channel_id',
      name: '👥・Members: {count} {arrow}',
    },
  },
};
```

## 🎯 Migration from Old System

The old `guilds.js` file has been replaced with this modular system. Key changes:

### Before (Old System)
```javascript
// guilds.js - monolithic file
const production = {
  '1234567890123456789': {
    botTrapChannelId: null,
    welcomeChannelId: 'channel_id',
    // ... 100+ lines per server
  },
};
```

### After (New System)  
```javascript
// config/servers/myServer.js - dedicated file
module.exports = {
  id: '1234567890123456789',
  main: { botTrapChannelId: null },
  events: { 
    welcome: { channelId: 'channel_id' } 
  },
};
```

### Backward Compatibility
The new system maintains full backward compatibility - all existing code continues to work without changes.

## 🛠️ Adding New Servers

1. Create a new file in `/config/servers/` (e.g., `newServer.js`)
2. Use the configuration format shown above
3. Set the correct server `id`
4. Configure desired features and channels
5. Restart the bot or use `!reload-config`

## 🐛 Troubleshooting

### Configuration Not Loading
- Check that the `id` field matches the Discord server ID exactly
- Ensure the file exports the configuration object correctly
- Check console logs for loading errors

### Features Not Working  
- Verify feature flags in the `features` object
- Check that required channels/roles are configured
- Use `!check-migration` to verify migration status

### Development vs Production
- Check `NODE_ENV` environment variable  
- Ensure development configs have `environment: 'development'`
- Use console logs to verify which config is being loaded

## 📚 Examples

See the existing server configurations in `/config/servers/` for real-world examples of:
- Basic server setup (sefinek.js)
- Full-featured dating server (milosnaGrota.js)  
- API server with minimal features (nekosiaAPI.js)
- Development environment (masneTesckiDev.js)