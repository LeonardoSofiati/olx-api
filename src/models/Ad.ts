import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface AdInstance extends Model {
    id: number,
    idUser: number,
    state: string,
    category: string,
    images: {url: string, default: boolean} [],
    dateCreated: Date,
    title: string,
    price: number,
    priceNegotiable: boolean,
    description: string,
    view: number,
    status: string
}

export const Ad = sequelize.define<AdInstance>('Ad', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    idUser: {
        type: DataTypes.INTEGER
    },
    state: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    images: {
        type: DataTypes.ARRAY
    },
    dateCreated: {
        type: DataTypes.DATE
    },
    title: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    priceNegotiable: {
        type: DataTypes.BOOLEAN
    },
    description: {
        type: DataTypes.STRING
    },
    view: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'ads',
    timestamps: false
})