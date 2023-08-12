import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Customer } from "./customer";

export class Commercial extends Model {}

Commercial.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    terms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    basics: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    billSequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    saleTarget: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "commercial_details",
    timestamps: false,
  }
);

Commercial.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Customer.hasOne(Commercial, {
  foreignKey: "customerId",
  as: "commercial",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
