const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');
const Container = require('./container');

class Service extends Model { };
Service.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    serviceId: DataTypes.STRING,
    serviceCreatedAt: DataTypes.DATE,
    serviceUpdatedAt: DataTypes.DATE,
    serviceName: DataTypes.STRING,
    serviceIndexVersion: DataTypes.NUMBER,
    serviceReplicas: DataTypes.NUMBER,
    serviceEnv: DataTypes.ARRAY(DataTypes.STRING),
    serviceImage: DataTypes.STRING,
    serviceTargetPort: DataTypes.NUMBER,
    servicePublishedPort: DataTypes.NUMBER,
    serviceNanoCPUs: DataTypes.NUMBER,
    serviceMemoryBytes: DataTypes.NUMBER,
    serviceState: {
        defaultValue: 'accepted',
        type: DataTypes.ENUM('shutodwn', 'running', 'accepted', 'failed', 'freeze')
    },
    price: DataTypes.STRING,
    userId: DataTypes.NUMBER // UUID
}, {
    paranoid: true,
    timestamps: true,
    modelName: 'services',
    sequelize: sequelize.getSequelize(),
});

// 1
Service.hasMany(Container);
// N
Container.belongsTo(Service);

module.exports = Service;