export const limitCommands = ['moveme']
export const timeCommands = ['ban', 'mute', 'vmute', 'timeout']
export const reasonCommands = ['warn']
export const utilityCommands = [
  'moveme',
  'profile',
  'user',
  'avatar',
  'server',
  'daily',
  'vote',
  'rep',
  'credits',
  'roll',
  'short',
  'ping',
  'roles',
  'points'
]
export default {
  general: ['credits', 'rep', 'moveme', 'color', 'colors', 'short', 'roll'],
  leveling: ['profile', 'rank', 'top', 'title', 'setxp', 'setlevel'],
  info: ['user', 'avatar', 'server', 'roles'],
  moderation: [
    'setnick',
    'ban',
    'unban',
    'kick',
    'vkick',
    'mute',
    'unmute',
    'vmute',
    'unvmute',
    'timeout',
    'untimeout',
    'clear',
    'move',
    'role',
    'points',
    'warn',
    'removewarn',
    'warnings',
    'lock',
    'unlock',
    'setcolor',
    'slowmode',
    'reset'
  ],
  starboard: ['starboard'],
  premium: ['vip']
}
