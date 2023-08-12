import express from "express";
import cors from "cors";

import { sequelize } from "./db";

import bcrypt from "bcryptjs";

import {
  UserRoutes,
  EmployeeRoutes,
  InventoryRoutes,
  AttendanceRoutes,
  DepartmentRoutes,
  TransactionRoutes,
  ReportRoutes,
  OtRoutes,
  TransportBillRoutes,
  CustomerRoutes,
  FileRoutes,
  VendorRoutes,
} from "./routes";

import {
  Attendance,
  Department,
  Employee,
  Inventory,
  TransportBill,
  Ot,
  Transaction,
  User,
  Customer,
  Vendor,
  File,
  Commercial,
  Bank,
  TransportBillItem,
  Address,
} from "./models";
import { verifyToken } from "./middleware";

import { UserService } from "./services";

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

User.sync().then(() => {
  new UserService(User).find({ where: { role: "ADMIN" } }).then((user: any) => {
    if (!user) {
      bcrypt.hash("admin@123", 10).then((hashPassword: string) => {
        let newUser = new User({
          name: "Admin",
          email: "admin@local.com",
          password: hashPassword,
          role: "ADMIN",
        });
        new UserService(User).create(newUser);
      });
    }
  });
});

Employee.sync();
Inventory.sync();
Attendance.sync();
Department.sync();
Transaction.sync();
Ot.sync();
TransportBill.sync();
TransportBillItem.sync();

Customer.sync();
Vendor.sync();
Commercial.sync();
Bank.sync();
Address.sync();

File.sync();

app.use(express.json());

app.use("/api/users", new UserRoutes().getRouter());
app.use("/api/customers", new CustomerRoutes().getRouter());
app.use("/api/vendors", verifyToken, new VendorRoutes().getRouter());
app.use("/api/employees", verifyToken, new EmployeeRoutes().getRouter());
app.use("/api/inventory", verifyToken, new InventoryRoutes().getRouter());
app.use("/api/attendances", verifyToken, new AttendanceRoutes().getRouter());
app.use("/api/departments", verifyToken, new DepartmentRoutes().getRouter());
app.use("/api/transactions", verifyToken, new TransactionRoutes().getRouter());
app.use("/api/ot", verifyToken, new OtRoutes().getRouter());
app.use(
  "/api/transport-bill",
  verifyToken,
  new TransportBillRoutes().getRouter()
);
app.use("/api/reports", verifyToken, new ReportRoutes().getRouter());
app.use("/api/files", new FileRoutes().getRouter());

app.listen(3000, () => {
  console.log("App listening on port http://localhost:3000");
});
