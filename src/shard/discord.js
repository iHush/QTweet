// Direct mappings for discord.js methods
import Discord from 'discord.js';
import log from '../log';
import Backup from '../backup';

const dClient = new Discord.Client({
  messageCacheMaxSize: 1,
  messageCacheLifetime: 30,
  messageSweepInterval: 60,
  disabledEvents: [
    'GUILD_UPDATE',
    'GUILD_MEMBER_ADD',
    'GUILD_MEMBER_REMOVE',
    'GUILD_MEMBER_UPDATE',
    'GUILD_MEMBERS_CHUNK',
    'GUILD_ROLE_CREATE',
    'GUILD_ROLE_DELETE',
    'GUILD_ROLE_UPDATE',
    'GUILD_BAN_ADD',
    'GUILD_BAN_REMOVE',
    'GUILD_EMOJIS_UPDATE',
    'GUILD_INTEGRATIONS_UPDATE',
    'CHANNEL_UPDATE',
    'CHANNEL_PINS_UPDATE',
    'PRESENCE_UPDATE',
    'MESSAGE_DELETE',
    'MESSAGE_UPDATE',
    'MESSAGE_DELETE_BULK',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE',
    'MESSAGE_REACTION_REMOVE_ALL',
    'USER_UPDATE',
    'PRESENCE_UPDATE',
    'TYPING_START',
    'VOICE_STATE_UPDATE',
    'VOICE_SERVER_UPDATE',
    'WEBHOOKS_UPDATE',
  ],
});

const reconnectionDelay = new Backup({
  mode: 'exponential',
  startValue: 1000,
  maxValue: 60000,
});

export const getClient = () => dClient;

export const login = async () => {
  try {
    log('⚙️ Logging into Discord');
    await dClient.login(process.env.DISCORD_TOKEN);
    reconnectionDelay.reset();
  } catch (err) {
    log("Couldn't log into discord:");
    log(err);
    setTimeout(login, reconnectionDelay.value());
    reconnectionDelay.increment();
  }
};

export const user = () => dClient.user;

export const getChannel = (id) => dClient.channels.resolve(id);

export const getGuild = (id) => dClient.guilds.resolve(id);

export const getUser = (id) => dClient.users.resolve(id);

export const getUserDm = async (id) => {
  const usr = dClient.users.resolve(id);
  if (!usr) return null;
  return usr.dmChannel ? usr.dmChannel : usr.createDM();
};

export const canPostIn = (channel) => {
  if (!channel) return false;
  const permissions = channel.permissionsFor(dClient.user);
  return (
    permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)
    && permissions.has(Discord.Permissions.FLAGS.VIEW_CHANNEL)
  );
};

export const canPostEmbedIn = (channel) => {
  if (!channel) return false;
  const permissions = channel.permissionsFor(dClient.user);
  return (
    permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)
    && permissions.has(Discord.Permissions.FLAGS.VIEW_CHANNEL)
    && permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)
    && permissions.has(Discord.Permissions.FLAGS.ATTACH_FILES)
  );
};
