import { User } from "./user";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Department } from "./department";

export class Employee extends Model {}

Employee.init(
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
    empId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Employee ID must be unique!", name: "empId" },
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    deptId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Department,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "employee",
    timestamps: false,
    underscored: true,
  }
);

Employee.belongsTo(User, {
  foreignKey: "mentorId",
  as: "mentor",
});

User.hasMany(Employee, {
  foreignKey: "mentorId",
  as: "employee",
});

Employee.belongsTo(Department, {
  foreignKey: "deptId",
  as: "department",
});

Department.hasMany(Employee, {
  foreignKey: "deptId",
  as: "employee",
});
