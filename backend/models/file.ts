import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { User } from "./user";

export class File extends Model {}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "files",
    timestamps: true,
    underscored: true,
  }
);

File.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(File, { foreignKey: "userId", as: "files" });
