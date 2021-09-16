module.exports = {
  SOCKET_EVENT: {
    GOTIT: 'gotit',
    COUNTDOWN: 'game:count-down',
    PLAYERSENDTARGET: 'change_target',
    SERVER_TELL_PLAYER_TO_MOVE: 'game:self-snakes-received',
    SERVER_UPDATE_ALL_PLAYERS: 'game:snakes-received',
    SERVER_UPDATE_FOOD: 'game:foods-received',
    SERVER_REDUCE_FOOD: 'game:foods-reduce',
    SERVER_UPDATE_POWER: 'game:skills-received',
    SERVER_UPDATE_BOUNDARY: 'game:boundary-received',
    USE_SKILL: 'use_skill',
    SERVER_SKILL_THROUGH: 'game:snake-through',
    SERVER_SKILL_INVISIBLE: 'game:snake-invisible',
    SERVER_SKILL_SUCK: 'game:snake-suck',
    SERVER_SKILL_SPEED: 'game:snake-speed',
    SERVER_SKILL_ZOOM: 'game:snake-zoom'
  }
};
