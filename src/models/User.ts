import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/pg";

export interface UserInstance extends Model {
    id: number,
    name: string,
    email: string,
    password: string
    state: string,
    // passwordHash: string,
    // token: string
}

export const User = sequelize.define<UserInstance>('User', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    }
    ,
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    }
    // passwordHash: {
    //     type: DataTypes.STRING
    // }
    // ,
    // token: {
    //     type: DataTypes.STRING
    // }
}, {
    tableName: 'users',
    timestamps: false
})