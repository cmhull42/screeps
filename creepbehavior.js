require("creep");

behaviors = {
    Creep: class {
        constructor(room) {
            this.room = room
        }
    },
    Harvester: class {
        constructor(room, assignedSource) {
            this.room = room
            this.assignedSource = assignedSource
        }
    
        run(creep) {
            var source = Game.getObjectById(this.assignedSource);
            var spawn = Game.spawns[this.getSpawnType()];
            
            if (creep.canCarry()) {
                creep.moveHarvest(source);
            }
            else {
                creep.moveTransfer(spawn, RESOURCE_ENERGY);
            }
        }
    
        getSpawnType() {
            // energy harvesting type
            return 'AssSpawn';
        }
    
        getBodyParts() {
            return [WORK, CARRY, MOVE];
        }

        getType() {
            return "harvester";
        }
    },
    Carrier: class {
        constructor(room, assignedController) {
            this.room = room;
            this.assignedController = assignedController;
        }
    
        run(creep) {
            var controller = Game.getObjectById(creep.memory.assignedController);
            var spawn = Game.spawns[this.getSpawnType()];
            if (_.sum(creep.carry) == 0) {
                creep.moveWithdraw(spawn, RESOURCE_ENERGY);
            }
            else {
                creep.moveUpgradeController(controller);
            }
        }
    
        getSpawnType() {
            // energy transfer type
            return 'AssSpawn';
        }
    
        getBodyParts() {
            return [WORK, CARRY, MOVE];
        }

        getType() {
            return "carrier";
        }
    },
    CreepFactory: class {
        static creepFromRole(role) {
            switch (role) {
                case "harvester":
                    return new Harvester();
                case "carrier":
                    return new Carrier();
                default:
                    return null;
            }
        }
    }
}

module.exports = behaviors