import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Customer } from "./customer";
import { Vendor } from "./vendor";

export class Bank extends Model {}

Bank.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: { type: DataTypes.STRING, allowNull: false },
    accNo: { type: DataTypes.INTEGER, allowNull: false },
    branch: { type: DataTypes.STRING, allowNull: false },
    ifsc: { type: DataTypes.INTEGER, allowNull: false },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Customer,
        key: "id",
      },
    },

    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Vendor,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "bank",
    timestamps: false,
  }
);

Bank.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Bank.belongsTo(Vendor, {
  foreignKey: "vendorId",
  as: "vendor",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Customer.hasMany(Bank, {
  foreignKey: "customerId",
  as: "bank",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Vendor.hasMany(Bank, {
  foreignKey: "vendorId",
  as: "bank",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
