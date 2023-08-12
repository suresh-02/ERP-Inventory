import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Department extends Model {}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthlySalary: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    otSalary: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    sundaySalary: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    leaveDetection: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "department",
    timestamps: false,
    underscored: true,
  }
);
