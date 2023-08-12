import { Employee } from ".";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Attendance extends Model {}

Attendance.init(
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
  },
  {
    sequelize,
    modelName: "attendance",
    timestamps: false,
    underscored: true,
  }
);

Attendance.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employee",
  onDelete: "cascade",
});
