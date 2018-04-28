require("creep");
require("room");

var behavior = require("creepbehavior");

module.exports.loop = function() {
    var room = Game.rooms["W3N4"];

    room.renewCreeps();

    var creeps = room.find(FIND_MY_CREEPS);
    for (const i in creeps) {
        var creepImpl = behavior.CreepFactory.creepFromRole(creeps[i]);
        creepImpl.run();
    }
}