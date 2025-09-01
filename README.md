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
└── web/                      # Express web server
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
Create a `.env` file with your Discord bot token and other required variables.

4. **Configure servers**
Create configuration files in `config/servers/` for your Discord servers.

5. **Start the bot**
```bash
node index.js
```




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

## 🔗 Dependencies

- **discord.js** - Discord API wrapper
- **express** - Web server framework
- **mongoose** - MongoDB object modeling
- **cron** - Scheduled task management
- **axios** - HTTP client
- **@sefinek/cleverbot-free** - AI chat integration

---

📝 **Documentation**: This documentation was written by [Claude AI](https://claude.ai) to provide comprehensive guidance for the SefinBot configuration system.

**Note**: This bot is designed for specific Discord servers and may require customization for your use case. Please review the configuration files and adapt them to your server's needs.