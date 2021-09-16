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
    SERVER_REDUCE_POWER: 'game:skills-reduce',
    SERVER_UPDATE_BOUNDARY: 'game:boundary-received'
  }
};
