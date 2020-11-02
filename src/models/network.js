const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

class Network extends Model {};
Network.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    networkName: DataTypes.STRING,
    networkId: DataTypes.STRING,
    networkCreated: DataTypes.DATE,
    networkScope: DataTypes.STRING,
    networkDriver: DataTypes.STRING,
    networkEnableIPv6: DataTypes.BOOLEAN,
    networkInternal: DataTypes.BOOLEAN,
    networkAttachable: DataTypes.BOOLEAN,
    networkIngress: DataTypes.BOOLEAN,
    networkContainers: DataTypes.ARRAY(DataTypes.STRING),
    userId: DataTypes.UUID
}, {
    paranoid: true,
    timestamps: true,
    sequelize: sequelize.getSequelize()
});

module.exports = Network;