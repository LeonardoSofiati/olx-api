import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface AdInstance extends Model {
    id: number,
    iduser: string,
    state: string,
    category: number,
    // images: {url: string, default: boolean} [],
    image: string,
    datecreated: Date,
    title: string,
    price: number,
    pricenegotiable: boolean,
    description: string,
    view: number,
    status: boolean
}

export const Ad = sequelize.define<AdInstance>('Ad', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    iduser: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.INTEGER
    },
    image: {
        type: DataTypes.STRING
    },
    datecreated: {
        type: DataTypes.DATE
    },
    title: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    pricenegotiable: {
        type: DataTypes.BOOLEAN
    },
    description: {
        type: DataTypes.STRING
    },
    view: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.BOOLEAN
    },
}, {
    tableName: 'ads',
    timestamps: false
})