const path = require('path');
const { promises: fsPromises } = require('fs');

const axios = require('axios').default.create({
    baseURL: process.env.DOCKER_API_URI
});

const ErrorResponse = require('../utils/error-response');

module.exports.servicesList = async () => {
    try {
        let response = await axios.get('/services');
        for (let service of response.data) {
            delete service.Endpoint;
            delete service.Spec.Labels;
            delete service.PreviousSpec;
            delete service.Spec.UpdateConfig;
            delete service.Spec.RollbackConfig;
            delete service.Spec.TaskTemplate.Runtime;
            delete service.Spec.TaskTemplate.ForceUpdate;
            delete service.Spec.TaskTemplate.RestartPolicy;
            delete service.Spec.TaskTemplate.ContainerSpec.Mounts;
            delete service.Spec.TaskTemplate.ContainerSpec.DNSConfig;
            delete service.Spec.TaskTemplate.ContainerSpec.Isolation;
            // service.ID;
            // service.CreatedAt;
            // service.UpdatedAt;
            // service.Spec.Name;
            // service.Version.Index;
            // service.Spec.Mode.Replicated.Replicas;
            // service.Spec.TaskTemplate.ContainerSpec.Env;
            // service.Spec.TaskTemplate.ContainerSpec.Image;
            // service.Spec.EndpointSpec.Ports[0].TargetPort;
            // service.Spec.TaskTemplate.ContainerSpec.Hostname;
            // service.Spec.TaskTemplate.ContainerSpec.Hostname;
            // service.Spec.EndpointSpec.Ports[0].PublishedPort;
            // service.Spec.TaskTemplate.Resources.Limits.NanoCPUs;
            // service.Spec.TaskTemplate.Resources.Limits.MemoryBytes;
        };
        return response.status === 200 ? response.data : null;
    } catch (error) {
        throw new ErrorResponse('DockerError', error.message, error.response.status)
    };
};

module.exports.createBaseImageService = async (imageName, imageVersion, cpu, ram, storage, networkId) => {
    try {
        let targetPort, nodeHostname;
        let json = fsPromises.readFile(path.join(__dirname, '..', '..', 'docker', 'json', 'service.json'), 'utf8');

        json = JSON.parse(json);

        switch (imageName) {
            case 'wordpress':
                targetPort = 80;
                nodeHostname = 'debian';
                mountTarget = '/var/www/html/wp-content';
                break;
            case 'mysql':
            case 'mariadb':
                targetPort = 3306;
                nodeHostname = 'debian';
                mountTarget = '/var/lib/mysql';
                break;
            case 'postgres':
                targetPort = 5432;
                nodeHostname = 'debian';
                mountTarget = '/var/lib/postgresql/data';
                break;
            case 'mongodb':
                targetPort = 27017;
                nodeHostname = 'debian';
                mountTarget = '/data/db';
                break;
            // case 'mssql':
            //     targetPort = 1433;
            //     nodeHostname = 'debian';
            //     mountTarget = '';
            //     break;
        };

        json.Networks[0].Target = networkId;
        json.TaskTemplate.ContainerSpec.Env = env;
        json.TaskTemplate.ContainerSpec.Hostname = name;
        json.EndpointSpec.Ports[0].TargetPort = targetPort;
        json.TaskTemplate.ContainerSpec.Mounts[0].Source = volumeName;
        json.Placement.Constaints = [`node.hostname==${nodeHostname}`];
        json.TaskTemplate.Resources.Limits.NanoCPUs = cpu * 1_000_000_000;
        json.TaskTemplate.Resources.Limits.MemoryBytes = ram * 1_073_741_824;
        json.TaskTemplate.ContainerSpec.Image = `${imageName}:${imageVersion}`;

        let response = await axios.post('/services/create', json);
    } catch (error) { 
        throw new ErrorResponse('DockerError', error.message, error.response.status);
    };
};

module.exports.networksList = async () => {
    try {
        let response = await axios.get('/networks');
        return response.status === 200 ? response.data : null;
    } catch (error) {
        throw new ErrorResponse('DockerError', error.message, error.response.status);
    };
};

module.exports.createNetwork = async (name, driver, internal, attachable) => {
    try {
        let json = {
            Name: name,
            Driver: driver,
            Ingress: false,
            EnableIPv6: false,
            Internal: internal,
            CheckDuplicate: true,
            Attachable: attachable,
        };
        let response = await axios.post('/networks/create', json);
        return response.status === 201 ? response.data.Id : null;
    } catch (error) {
        throw new ErrorResponse('DockerError', error.message, error.response.status);
    };
};

module.exports.inspectNetwork = async id => {
    try {
        let containersId = [];
        let response = await axios.get(`/networks/${id}`);
        
        delete response.data.IPAM;
        delete response.data.Options;
        delete response.data.Labels;
        for (let containerId in response.data.Containers) {
            containersId.push(containerId);
        };
        response.data.Containers = containersId;
        
        return response.status === 200 ? response.data : null;
    } catch (error) {
        throw new ErrorResponse('DockerError', error.message, error.response.status);
    };
};

module.exports.removeNetwork = async id => {
    try {
        return await axios.delete(`/networks/${id}`);
    } catch (error) {
        throw new ErrorResponse('DockerError', error.message, error.response.status);
    };
};