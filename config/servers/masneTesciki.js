const { EmbedBuilder } = require('discord.js');

module.exports = {
	// Server ID: Masne Teściki Botów™
	id: '943910440520527873',

	// Main Configuration
	main: {
		botTrapChannelId: null, // Not configured
		automodChannelId: '1188578816310906890',
	},

	// Voice Channel Statistics (all disabled)
	voiceChannels: {
		members: {
			enabled: false,
		},
		online: {
			enabled: false,
		},
		newest: {
			enabled: false,
		},
	},

	// Event Logging (minimal - same channel for all events)
	events: {
		welcome: {
			channelId: '1150787924351254539',
			content: null, // No custom welcome message
		},
		farewell: {
			channelId: '1150787924351254539',
			content: null, // No custom farewell message
		},
		ban: {
			channelId: '1150787924351254539',
			content: null, // No custom ban message
		},
	},

	// Direct Messages (disabled)
	directMessages: {
		welcome: {
			enabled: false,
		},
	},

	// Reaction System (none configured)
	reactions: {},

	// Features
	features: {
		isDatingServer: false,
		timeBasedModes: false,
		botTesting: true, // Custom feature for bot testing server
		cleverBot: {
			enabled: true,
			channelId: '1162955264467669022',
		},
	},
};