Creep.prototype.canCarry = function () {
    return _.sum(this.carry) < this.carryCapacity;
}

Room.prototype.renewCreeps = function() {
    var energySpawn = this.find(FIND_MY_SPAWNS, { filter: (spawn) => spawn.name == 'AssSpawn' })[0];

    var sources = this.find(FIND_SOURCES);

    var harvesters = this.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'harvester' });
    var carriers = this.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'carrier' });

    if (harvesters.length == sources.length && carriers.length == 1) {
        return;
    }

    if (energySpawn.spawning) {
        return;
    }

    var sourcesNeedingHarvesters = sources.filter(
        (source) => !harvesters.some(
            (creep) => source.id == creep.memory.assignedSource
        )
    );

    if (sourcesNeedingHarvesters.length > 0) {
        for (const i in sourcesNeedingHarvesters) {
            var sourceID = sourcesNeedingHarvesters[i].id;
            var result = energySpawn.spawnCreep([WORK, CARRY, MOVE], 'harvest' + sourceID, {
                memory: { role: 'harvester', assignedSource: sourceID }
            });
    
            if (result == ERR_NOT_ENOUGH_ENERGY) {
                return;
            }
        }
    }
    else {
        // we must need to spawn a carrier
        energySpawn.spawnCreep([WORK, CARRY, MOVE], 'carrier' + this.controller.id, {
            memory: { role: 'carrier', assignedController: this.controller.id }
        });
    }
}

module.exports.loop = function () {
    var room = Game.rooms["W3N4"];

    room.renewCreeps();

    var harvesters = room.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'harvester' })
    for (const i in harvesters) {
        if (harvesters[i].canCarry()) {
            // move to energy until we can mine
            var assignedSource = Game.getObjectById(harvesters[i].memory.assignedSource);
            if (harvesters[i].harvest(assignedSource) == ERR_NOT_IN_RANGE) {
                harvesters[i].moveTo(assignedSource.pos)
            }
        }
        else {
            // move to spawn until we can transfer
            if (harvesters[i].transfer(Game.spawns['AssSpawn'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                harvesters[i].moveTo(Game.spawns["AssSpawn"].pos);
            }
        }
    }

    var carriers = room.find(FIND_MY_CREEPS, { filter: (creep) => creep.memory.role == 'carrier'});
    for (const i in carriers) {
        if (carriers[i].canCarry()) {
            if (carriers[i].withdraw(Game.spawns['AssSpawn'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                carriers[i].moveTo(Game.spawns['AssSpawn'].pos);
            }
        }
        else {
            var assignedController = Game.getObjectById(carriers[i].memory.assignedController);
            if (carriers[i].upgradeController(assignedController) == ERR_NOT_IN_RANGE) {
                carriers[i].moveTo(assignedController.pos);
            }
        }
    }
}