
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
                memory: { role: 'harvester', assignedSource: sourceID, spawnID: energySpawn.id }
            });
    
            if (result == ERR_NOT_ENOUGH_ENERGY) {
                return;
            }
        }
    }
    else {
        // we must need to spawn a carrier
        energySpawn.spawnCreep([WORK, CARRY, MOVE], 'carrier' + this.controller.id, {
            memory: { role: 'carrier', assignedController: this.controller.id, spawnID: energySpawn.id }
        });
    }
}