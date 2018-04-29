require("creep");

var behaviorLib = require("creepbehavior");
var managerLib = require('creepmanager');

var manager = managerLib.CreepManagerSingleton.getInstance();
var room = Game.rooms["W3N4"];

module.exports.loop = function() {
    // todo abstract this into DecisionManager
    // harvesters
    var sources = room.find(FIND_SOURCES);
    var harvesters = manager.getRequestedRoleMembers('harvester');

    var sourcesNeedingHarvesters = sources.filter(
        (source) => !harvesters.some(
            (h) => source.id == h.assignedSource
        )
    );

    for (const i in sourcesNeedingHarvesters) {
        manager.add(new behaviorLib.Harvester(room, sourcesNeedingHarvesters[i].id));
    }

    // controllers

    var carriers = manager.getRequestedRoleMembers('carrier');
    for (i = carriers.length; i <= 2; i++) {
        //manager.add(new behaviorLib.Carrier(room, room.controller.id))
    }

    manager.tick();
}