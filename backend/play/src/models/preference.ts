import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db'; // Assuming sequelize instance is in config/db

interface PreferenceAttributes {
  id: number;
  userId: number; // Foreign key referencing the user, but no association
  name: string;
  hobbies: string[];
  skills: string[];
  teach: string;
  dob: Date;
  learn: string;
}

type PreferenceCreationAttributes = Optional<PreferenceAttributes, 'id'>;

export class Preference extends Model<PreferenceAttributes, PreferenceCreationAttributes> 
  implements PreferenceAttributes {
  public id!: number;
  public userId!: number; // Reference to User from Auth service
  public name!: string;
  public hobbies!: string[];
  public skills!: string[];
  public teach!: string;
  public dob!: Date;
  public learn!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Preference.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hobbies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    teach: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    learn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'preferences',
  }
);
