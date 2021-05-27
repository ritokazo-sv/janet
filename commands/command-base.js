const { prefix } = require('../config.json')

const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Permissão Desconhecida: "${permission}"`)
    }
  }
}

const allCommands = []

module.exports = (commandOptions) => {
  let {
    commands,
    permissions = [],
  } = commandOptions

  // Ensure the command and aliases are in an array
  if (typeof commands === 'string') {
    commands = [commands]
  }

  console.log(`Registering command "${commands[0]}"`)

  // Ensure the permissions are in an array and are all valid
  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions]
    }

    validatePermissions(permissions)
  }

  for (const command of commands) {
    allCommands[command] = {
      ...commandOptions,
      commands,
      permissions
    };
  }
}

module.exports.listen = (client) => {
  // Listen for messages
  client.on('message', (message) => {
    const { member, content, guild } = message;
    
      // Split on any number of spaces
      const arguments = content.split(/[ ]+/)

      // Remove the command which is the first index
      const name = arguments.shift().toLowerCase();

      if(name.startsWith(prefix)) {
        const command = allCommands[name.replace(prefix, '')]
        if (!command) {
          return
        }

        const {
          permissions,
          permissionError = "Você não tem permissão para rodar esse comando.",
          requiredRoles = [],
          minArgs = 0,
          maxArgs = null,
          expectedArgs,
          callback,
        } = command;

        // Ensure the user has the required permissions
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.reply(permissionError)
            return
          }
        }

        // Ensure the user has the required roles
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.name === requiredRole
          )

          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
              `Você precisa ter a permissão "${requiredRole}" para usar esse comando.`
            )
            return
          }
        }

        // Ensure we have the correct number of arguments
        if (
          arguments.length < minArgs ||
          (maxArgs !== null && arguments.length > maxArgs)
        ) {
          message.reply(`Comando inválido ! Use ${prefix}${alias} ${expectedArgs}`);
          return;
        }

        // Handle the custom command code
        callback(message, arguments, arguments.join(' '), client);
      }
  })
}