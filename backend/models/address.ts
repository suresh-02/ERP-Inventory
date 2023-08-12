import { Vendor } from "./vendor";
import { Customer } from "./customer";
import { sequelize } from "./../db";
import { DataTypes, Model } from "sequelize";

export class Address extends Model {}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    line1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    line2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    line3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
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
    modelName: "address",
    timestamps: false,
    underscored: true,
  }
);

Address.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Address.belongsTo(Vendor, {
  foreignKey: "vendorId",
  as: "vendor",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Customer.hasMany(Address, {
  foreignKey: "customerId",
  as: "address",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Vendor.hasMany(Address, {
  foreignKey: "vendorId",
  as: "address",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
