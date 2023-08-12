import { Employee } from ".";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Ot extends Model {}

Ot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "id",
      },
    },
    hours: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    isOt: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isSunday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ot",
    timestamps: false,
    underscored: true,
  }
);

Ot.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employee",
  onDelete: "cascade",
});
