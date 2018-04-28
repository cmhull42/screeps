Creep.prototype.canCarry = function () {
    return _.sum(this.carry) < this.carryCapacity;
}

Creep.prototype.moveHarvest = function (target) {
    if (this.harvest(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target.pos);
    }
}

Creep.prototype.moveTransfer = function (target, resource) {
    if (this.transfer(target, resource) == ERR_NOT_IN_RANGE) {
        this.moveTo(target.pos);
    }
}

Creep.prototype.moveWithdraw = function(target, resource) {
    if (this.withdraw(target, resource) == ERR_NOT_IN_RANGE) {
        this.moveTo(target.pos);
    }
}

Creep.prototype.moveUpgradeController = function(target) {
    if (this.upgradeController(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target.pos)
    }
}