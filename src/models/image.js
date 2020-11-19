const { Model, DataTypes } = require('sequelize');

const sequelize = require('../configs/sequelize');

class Image extends Model {};
Image.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    pic: DataTypes.STRING,
    imageCreated: DataTypes.DATE,
    imageId: DataTypes.STRING,
    imageParentId: DataTypes.STRING,
    imageRepoTag: DataTypes.STRING,
    imageSize: DataTypes.INTEGER,
    imageVirtualSize: DataTypes.INTEGER,
    imageExposePort: DataTypes.INTEGER,
    userId: DataTypes.INTEGER // UUID
}, {
    paranoid: true,
    timestamps: true,
    modelName: "",
    sequelize: sequelize.getSequelize()
});

module.exports = Image;