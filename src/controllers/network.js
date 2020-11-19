const Network = require('../models/network');
const sequelize = require('../configs/sequelize');
const dockerService = require('../services/docker');

module.exports.list = async (req, res, next) => {
    let { userId } = req.body;
    let networks = await Network.findAll({
        where: {
            userId
        }
    });

    req.apiData = networks;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.inspect = async (req, res, next) => {
    let { id } = req.params;
    let network = await Network.findByPk(id);
    
    req.apiData = network;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.create = async (req, res, next) => {
    let { name, driver, internal, attachable, userId } = req.body;
    let networkId = await dockerService.createNetwork(name, driver, internal, attachable);
    let inspectNetwork = await dockerService.inspectNetwork(networkId);

    let network = await sequelize.getSequelize().transaction(async t => {
        return await Network.create({
            networkName: name,
            networkId,
            networkCreated: inspectNetwork.Created,
            networkScope: inspectNetwork.Scope,
            networkDriver: inspectNetwork.Driver,
            networkEnableIPv6: inspectNetwork.EnableIPv6,
            networkInternal: inspectNetwork.Internal,
            networkAttachable: inspectNetwork.Attachable,
            networkIngress: inspectNetwork.Ingress,
            networkContainers: inspectNetwork.Containers,
            userId
        });
    });
    
    req.apiData = network.id;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};

module.exports.remove = async (req, res, next) => {
    let { id } = req.params;
    let { userId } = req.body;
    let network = await Network.findOne({
        where: {
            id,
            userId
        }
    });
    
    await dockerService.removeNetwork(network.networkId);

    req.apiData = `Network (${id}) deleted`;
    req.apiError = null;
    req.apiStatus = 200;
    next();
};