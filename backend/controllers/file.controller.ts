import { Response, Request } from "express";
import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { File, User } from "./../models";

export class FileController {
  constructor() {}

  async get(req: any, res: Response) {
    try {
      const files = await File.findAll({
        attributes: [
          "id",
          "fileName",
          [Sequelize.col("user.name"), "userName"],
        ],
        include: [{ model: User, as: "user", attributes: [] }],
        order: [["createdAt", "ASC"]],
      });
      return res.json(files);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Failed to fetch file names");
    }
  }

  async post(req: any, res: Response) {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(422).send("No files were uploaded.");
    }

    const fileNames: string[] = [];
    Object.values(files).forEach((file: any) => {
      if (file.length)
        file.forEach((file: any) => {
          fileNames.push(file.name);
        });
      else fileNames.push(file.name);
    });

    try {
      ////////////////// Checking the existing files //////////////////
      const existingFiles = await File.findAll({
        where: {
          fileName: fileNames,
        },
      });

      const existingFileNames = existingFiles.map(
        (existingFile) => existingFile.dataValues.fileName + "\n"
      );

      if (existingFiles.length > 0) {
        return res
          .status(400)
          .send(`${existingFileNames} files already exist.`);
      }
      ////////// End of checking the existing files //////////
      await File.bulkCreate(
        fileNames.map((fileName) => ({
          fileName,
          userId: req.user.userId,
        }))
      );

      const upload = (file: any) => {
        const fileName = file.name;
        const filepath = path.join(__dirname, `../files`, fileName);

        // Move the file to the desired destination
        console.log(fileName);
        file.mv(filepath, (err: any) => {
          if (err) {
            console.error(`Error moving file ${fileName}:`, err);
          }
        });
      };

      Object.values(files).forEach((file: any) => {
        if (file.length)
          file.forEach((file: any) => {
            upload(file);
          });
        else upload(file);
      });

      return res
        .status(200)
        .json({ status: "success", message: "Files uploaded successfully" });
    } catch (error) {
      return res.status(500).send("Failed to save file names");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const fileName = String(req.query.fileName);

      await File.destroy({ where: { id } });
      const filepath = path.join(__dirname, `../files`, fileName);
      fs.unlink(filepath, (err: any) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Failed to delete file");
        }
      });
      return res.json({ status: "success", message: "File deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Failed to delete file");
    }
  }
}
