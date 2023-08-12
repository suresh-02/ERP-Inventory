import { User } from "./user";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Inventory } from "./inventory";

export class Transaction extends Model {}

Transaction.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    inventoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Inventory,
        key: "id",
      },
    },
    inward: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    outward: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "transaction",
    timestamps: false,
    underscored: true,
  }
);

Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Transaction, {
  foreignKey: "userId",
  as: "transaction",
});

Transaction.belongsTo(Inventory, {
  foreignKey: "inventoryId",
  as: "inventory",
});

Inventory.hasMany(Transaction, {
  foreignKey: "inventoryId",
  as: "transaction",
});
