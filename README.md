# SefinBot - Discord Bot

A powerful and flexible Discord bot built with discord.js v14, featuring modular server configurations, advanced reactions system, and comprehensive automation capabilities.

## 🚀 Features

- **Modular Server Configuration System** - Individual configuration files for each server
- **Flexible Reactions System** - Customizable auto-reactions with thread creation and validation
- **Verification System** - hCaptcha-based member verification with role assignment
- **Voice Channel Statistics** - Dynamic member count and status tracking
- **Event Logging** - Welcome, farewell, and ban messages with custom embeds
- **Cron-based Automation** - Time-based server modes and scheduled tasks
- **CleverBot Integration** - AI-powered chat responses
- **Hot Reload** - Live configuration updates without restart
- **Development Environment Support** - Separate configs for development and production

## 📋 Configuration

For detailed information about server configuration, including the flexible reactions system, validation rules, and environment handling, see the [Configuration Documentation](config/README.md).

## 📁 Project Structure

```
sefinbot/
├── index.js                    # Bot entry point
├── package.json               # Dependencies and scripts
├── config/                    # Configuration system
│   ├── guilds.js             # Config loader with backward compatibility
│   └── servers/              # Individual server configurations
├── commands/                  # Bot commands
├── events/                   # Discord event handlers
├── cron/                     # Scheduled tasks and automation
├── handlers/                 # Command and event loaders
└── www/                      # Express web server
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/sefinek/sefinbot-discord.git
cd sefinbot-discord
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Copy `.env.default` to `.env` and fill in your Discord bot token and other required variables:
```bash
cp .env.default .env
```
Required variables: `TOKEN`, `OWNER`, `PREFIX`, `MONGODB_URL`

4. **Configure servers**
Create configuration files in `config/servers/` for your Discord servers. See `config/README.md` for detailed documentation.

5. **Start the bot**
```bash
# Development
node index.js

# Production (with PM2)
pm2 start ecosystem.config.js
```




## 🛠️ Development Commands

### Code Quality
- `npx eslint .` - Run ESLint linting
- `npm run up` - Update all dependencies using npm-check-updates (ncu)

### Production Management (PM2)
- `pm2 logs sefi` - View bot logs
- `pm2 restart sefi` - Restart the bot
- `pm2 status` - Check bot status

### Configuration Management
- `!reload-config` - Hot reload server configurations (in Discord)
- `!check-migration` - Verify server configurations (in Discord)

## 🛠️ Adding New Servers

1. Create a new file in `/config/servers/` (e.g., `newServer.js`)
2. Use the configuration format from `config/README.md`
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

## 🔗 Dependencies

- **discord.js v14** - Discord API wrapper
- **express** - Web server framework
- **mongoose** - MongoDB object modeling
- **cron** - Scheduled task management
- **axios** - HTTP client
- **@sefinek/cleverbot-free** - Chat integration
- **helmet** - Security middleware
- **morgan** - HTTP request logging
- **ws** - WebSocket library

---

📝 **Documentation**: This documentation was written by [Claude AI](https://claude.ai) to provide comprehensive guidance for the SefinBot configuration system.

**Note**: This bot is designed for specific Discord servers and may require customization for your use case. Please review the configuration files and adapt them to your server's needs.


## 🔖 License
MIT License