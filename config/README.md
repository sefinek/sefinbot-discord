# Server Configuration System

This directory contains the new modular server configuration system that replaces the monolithic `guilds.js` file.

## 📁 Structure

```
config/
├── guilds.js           # Main config loader with backward compatibility
├── README.md           # This documentation
└── servers/            # Individual server configurations
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
  
  // Optional: Development environment flag
  dev: false,
  
  // Main server settings
  botTrapChannelId: 'channel_id_or_null',
  automodChannelId: 'channel_id',

  // Channel IDs organized by purpose
  channels: {
    lobby: 'channel_id',
    general: 'channel_id',
    // ... more channels
  },

  // Role IDs organized by purpose  
  roles: {
    verified: 'role_id',
    unverified: 'role_id',
    // ... more roles
  },

  // Voice channel statistics
  voiceChannels: {
    members: {
      enabled: true,
      channelId: 'channel_id',
      name: (count, arrow) => `👥・Members: ${count} ${arrow || ''}`,
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

  // Flexible Reaction System
  reactions: [
    {
      name: 'photo-reactions',
      enabled: true,
      channels: ['channel_id1', 'channel_id2'],
      emojis: ['😍', '😐', '🤢'],
      thread: {
        enabled: true,
        nameTemplate: author => `${author.globalName || author.username}: Comments`,
        autoArchiveDuration: 24 * 60, // minutes
        reason: author => `Photo by ${author.tag}`,
        startMessage: {
          embeds: [/* Discord embed for thread start */]
        }
      },
      validation: {
        onlyImages: { message: 'Only images allowed in this channel! 📸' },
      },
    },
    // ... more reaction configurations
  ],

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
    customFeature: true,
    cleverBot: {
      enabled: true,
      channelId: 'channel_id',
    },
  },
};
```

## 🎭 Flexible Reactions System

The new reactions system provides a modular, configurable approach to automatic reactions and thread creation. Each reaction configuration is independent and can be enabled/disabled individually.

### Basic Structure

```javascript
reactions: [
  {
    name: 'unique-reaction-name',     // Descriptive name for this reaction set
    enabled: true,                    // Can disable without removing config
    channels: ['channel_id1', '...'], // Channels where this applies
    emojis: ['😍', '👍', '❤️'],       // Auto-reactions to add
    thread: { /* thread config */ },  // Optional thread creation
    validation: { /* rules */ },      // Optional message validation
  }
]
```

### Thread Configuration

```javascript
thread: {
  enabled: true,                                    // Enable/disable thread creation
  nameTemplate: author => `${author.username}: Comments`, // Thread name function
  autoArchiveDuration: 24 * 60,                   // Auto-archive time (minutes)
  reason: author => `Discussion for ${author.tag}`, // Audit log reason
  startMessage: {                                  // Initial message in thread
    embeds: [
      new EmbedBuilder()
        .setColor('#4A90E2')
        .setDescription('Discussion thread started!')
        .setTimestamp()
    ]
  }
}
```

### Validation System

The validation system allows you to enforce rules on messages before reactions are added:

```javascript
validation: {
  // Image validation - requires message to have image attachments
  onlyImages: { 
    message: 'Only images are allowed in this channel! 📸' 
  },
  
  // Text length validation - requires minimum text length
  textLength: { 
    min: 20, 
    message: minLength => `Message too short! Minimum ${minLength} characters required.` 
  },
  
  // Multiple validations can be combined
  // onlyImages: { message: '...' },
  // textLength: { min: 10, max: 500, message: length => `...` },
}
```

### Complete Examples

#### Photo Sharing Channel
```javascript
{
  name: 'photo-sharing',
  enabled: true,
  channels: ['photo-channel-id'],
  emojis: ['😍', '😐', '🤢'],
  thread: {
    enabled: true,
    nameTemplate: author => `${author.globalName || author.username}: Photo Comments`,
    autoArchiveDuration: 24 * 60, // 1 day
    reason: author => `Photo shared by ${author.tag}`,
    startMessage: {
      embeds: [
        new EmbedBuilder()
          .setColor('#FF69B4')
          .setDescription('Share your thoughts about this photo! 📸✨')
          .setFooter({ text: 'Photo Comments' })
          .setTimestamp()
      ]
    }
  },
  validation: {
    onlyImages: { message: 'This channel is for photos only! 📸' }
  }
}
```

#### Introduction Channel
```javascript
{
  name: 'introductions',
  enabled: true,
  channels: ['intro-channel-id'],
  emojis: ['❤️', '👋'],
  thread: {
    enabled: true,
    nameTemplate: author => `Welcome ${author.username}!`,
    autoArchiveDuration: 72 * 60, // 3 days
    reason: author => `Introduction thread for ${author.tag}`,
    startMessage: {
      embeds: [
        new EmbedBuilder()
          .setColor('#00D26A')
          .setDescription('Welcome to our community! Others can comment here.')
          .setFooter({ text: 'Welcome Thread' })
          .setTimestamp()
      ]
    }
  },
  validation: {
    textLength: { 
      min: 50, 
      message: minLength => `Please write at least ${minLength} characters so we can get to know you better! ✍️` 
    }
  }
}
```

#### Simple Like/Dislike
```javascript
{
  name: 'general-voting',
  enabled: true,
  channels: ['suggestions-id', 'memes-id'],
  emojis: ['👍', '👎'],
  thread: { enabled: false },
  validation: {} // No validation rules
}
```

#### Approval System
```javascript
{
  name: 'admin-approval',
  enabled: true,
  channels: ['approval-channel-id'],
  emojis: ['✅'],
  thread: { enabled: false },
  validation: {} // Admins can approve anything
}
```

### Migration from Old System

#### Before (Old Rigid System)
```javascript
reactions: {
  pokazRyjek: {          // Fixed type name
    channels: ['...'],
    requiresAttachment: true,
    createThread: true,   // Boolean only
    threadConfig: { ... }
  },
  likeDislike: {         // Another fixed type
    channels: ['...'],
    emojis: ['👍', '👎']
  }
}
```

#### After (New Flexible System)
```javascript
reactions: [
  {
    name: 'photo-reactions',    // Custom name
    enabled: true,              // Can disable
    channels: ['...'],
    emojis: ['😍', '😐', '🤢'],
    thread: {
      enabled: true,            // Granular control
      nameTemplate: author => `...`,
      // ... more options
    },
    validation: {
      onlyImages: { message: '...' }  // Semantic validation
    }
  },
  {
    name: 'voting-reactions',   // Another custom reaction set
    enabled: true,
    channels: ['...'],
    emojis: ['👍', '👎'],
    thread: { enabled: false },
    validation: {}
  }
]
```

### Benefits of New System

1. **Flexibility** - Custom names, not predefined types
2. **Granular Control** - Enable/disable any feature independently  
3. **Semantic Validation** - `onlyImages` vs `requiresAttachment: true`
4. **Extensibility** - Easy to add new validation types
5. **Maintainability** - Clear structure, easy to understand
6. **Scalability** - Add unlimited reaction configurations

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
- **Development** (`NODE_ENV=development`): Prefers configs with `dev: true`

### Example Development Config
```javascript
module.exports = {
  id: '943910440520527873',
  dev: true, // This marks it as dev-only
  
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
  botTrapChannelId: null,
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
- Ensure development configs have `dev: true`
- Use console logs to verify which config is being loaded

## 📚 Examples

See the existing server configurations in `/config/servers/` for real-world examples of different server setups and feature implementations.

---

📝 **Documentation**: This comprehensive configuration documentation was written by [Claude AI](https://claude.ai) to help developers understand and implement the flexible server configuration system.