require("creep");

class Harvester {
    constructor(creep) {
        this.creep = creep;
        this.source = Game.getObjectById(creep.memory.assignedSource);
        this.spawn = Game.getObjectById(creep.memory.spawnID);
    }

    run() {
        if (this.creep.canCarry()) {
            this.creep.moveHarvest(this.source);
        }
        else {
            this.creep.moveTransfer(this.spawn, RESOURCE_ENERGY);
        }
    }
}

class Carrier {
    constructor(creep) {
        this.creep = creep;
        this.controller = Game.getObjectById(creep.memory.assignedController)
        this.spawn = Game.getObjectById(creep.memory.spawnID);
    }

    run() {
        if (this.creep.canCarry()) {
            this.creep.moveWithdraw(this.spawn, RESOURCE_ENERGY);
        }
        else {
            this.creep.moveUpgradeController(this.controller);
        }
    }
}

class CreepFactory {
    static creepFromRole(creep) {
        switch (creep.memory.role) {
            case "harvester":
                return new Harvester(creep);
            case "carrier":
                return new Carrier(creep);
            default:
                return null;
        }
    }
}

module.exports.CreepFactory = CreepFactory