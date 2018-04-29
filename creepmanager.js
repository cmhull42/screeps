var behavior = require('creepbehavior')

class CreepManager {
    constructor() {
        this.creeps = new Map();
        this.queue = new Map();
    }

    tick() {
        this.trySpawnFromQueue();
        this.dequeueSpawnedCreeps();
        this.runBehavior();
        this.deleteDeadCreeps();
    }

    trySpawnFromQueue() {
        // check wanted creeps
        var queuedCreeps = Array.from(this.queue.keys())
        for (const i in queuedCreeps) {
            var spawn = Game.spawns[this.queue.get(queuedCreeps[i]).impl.getSpawnType()];

            if (spawn.spawning) {
                continue;
            }

            spawn.spawnCreep(this.queue.get(queuedCreeps[i]).impl.getBodyParts(), queuedCreeps[i]);
        }
    }

    dequeueSpawnedCreeps() {
        var queuedCreeps = Array.from(this.queue.keys());
        for (const i in queuedCreeps) {
            var creep = Game.creeps[queuedCreeps[i]];
            if (creep) {
                this.creeps.set(queuedCreeps[i], { impl: this.queue.get(queuedCreeps[i]).impl, creep });
                this.queue.delete(queuedCreeps[i]);
            }
        }
    }

    runBehavior() {
        var creeps = Array.from(this.creeps.keys())

        for (const i in creeps) {
            var creep = this.creeps.get(creeps[i]);
            creep.impl.run(creep.creep);
        }
    }

    deleteDeadCreeps() {
        var creeps = Array.from(this.creeps.keys());

        for (const i in creeps) {
            var creep = Game.creeps[creeps[i]];
            if (!creep) {
                this.creeps.delete(creeps[i]);
                delete Memory[creeps[i]]
            }
        }
        
    }

    getRequestedRoleMembers(type) {

        var allcreeps = Array.from(this.creeps.values())
            .concat(Array.from(this.queue.values()))
            .map((creep) => creep.impl);

        return allcreeps
            .filter((creep) => creep.getType() == type)
    }

    add(impl) {
        if (Array.from(this.queue.keys()).length > 2) {
            return;
        }
        var name = this.getUniqueName(impl.room.name, impl.getType());
        this.queue.set(name, { impl });
    }

    getUniqueName(room, role) {
        var names = Array.from(this.creeps.keys()).concat(Array.from(this.queue.keys())).sort();
        var abbr = this.getAbbrForRole(role);

        for (var i=0; true; i++) {
            var newName = abbr + room + i;
            if (!names.includes(newName)) {
                return newName;
            }
        }
    }

    getAbbrForRole(role) {
        switch (role) {
            case "harvester":
                return "h";
            case "carrier":
                return "c";
        }
    }
}

var CreepManagerSingleton = (function() {
    var instance;

    function createInstance() {
        var object = new CreepManager();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();    
            }
            return instance
        }
    };
})();

module.exports.CreepManagerSingleton = CreepManagerSingleton;