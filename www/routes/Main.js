const router = require('express').Router();

const UpdateDiscordRolesController = require('../controllers/UpdateDiscordRoles.js');
const RemoveDiscordRolesController = require('../controllers/RemoveDiscordRoles.js');
const SendDMMessageController = require('../controllers/SendDMMessage.js');
const SendMsgController = require('../Channel/SendMsg.js');
const SengLogController = require('../Channel/SendLog.js');

// DM
router.post('/api/v1/discord/subscriber/roles/update', UpdateDiscordRolesController);
router.post('/api/v1/discord/subscriber/roles/remove', RemoveDiscordRolesController);
router.post('/api/v1/discord/subscriber/send-direct-msg', SendDMMessageController); // Direct messages

// Channel
router.post('/api/v1/discord/channel/send-msg', SendMsgController); // Genshin Stella Mod server
router.post('/api/v1/discord/channel/send-log', SengLogController); // Logs for my test server

module.exports = router;