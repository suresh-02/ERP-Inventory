import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Customer } from "./customer";

export class Vendor extends Model {}

Vendor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Customer,
        key: "id",
      },
    },
    contractor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("PVT", "SUB"),
      allowNull: false,
    },
    salesPerson: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    consignee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    territory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "vendor",
    timestamps: false,
    underscored: true,
  }
);

Vendor.hasOne(Customer, {
  foreignKey: "customerId",
  as: "customer",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Customer.hasOne(Vendor, {
  foreignKey: "customerId",
  as: "vendor",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
