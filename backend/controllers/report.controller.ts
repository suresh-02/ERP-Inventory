import { Request, Response } from "express";
import { jsonToExcel } from "../helpers/jsonToCSV";
import { sequelize } from "../db";

export class ReportController {
  getAttendanceReport(req: Request, res: Response) {
    let { start, end } = req.query;
    //! SQL Query for getting both Ot and Attendance count
    let sql = `
            SELECT
              e.name AS "Employee Name",
              e.emp_id AS "Employee ID",
              d.name AS "Department",
              d.monthly_salary AS "Monthly Salary",
              COALESCE(SUM(a.AbsentDays), 0) AS "Total Absent",
              COALESCE(SUM(CASE WHEN ot.is_ot = 1 THEN ot.hours ELSE 0 END), 0) AS "Total OT Hours",
              COALESCE(SUM(CASE WHEN ot.is_sunday = 1 THEN ot.hours ELSE 0 END), 0) AS "Total Sunday OT Hours",
              (d.monthly_salary - (COALESCE(SUM(a.AbsentDays), 0) * d.leave_detection))
              + (COALESCE(SUM(CASE WHEN ot.is_ot = 1 THEN ot.hours ELSE 0 END), 0) * d.ot_salary)
              + (COALESCE(SUM(CASE WHEN ot.is_sunday = 1 THEN ot.hours ELSE 0 END), 0) * d.sunday_salary)
              AS "Final Salary"
            FROM
              employees e
            INNER JOIN departments d ON e.dept_id = d.id
            LEFT JOIN (
              SELECT employee_id, COUNT(id) AS AbsentDays
              FROM attendances
              WHERE (date BETWEEN '${start}' AND '${end}')
              GROUP BY employee_id
            ) a ON e.id = a.employee_id
            LEFT JOIN (
              SELECT employee_id, SUM(hours) AS hours, is_sunday, is_ot
              FROM ots
              WHERE (date BETWEEN '${start}' AND '${end}')
              GROUP BY employee_id, is_sunday
            ) ot ON e.id = ot.employee_id
            GROUP BY e.id;
    `;
    sequelize
      .query(sql)
      .then((result) => {
        jsonToExcel(result[0]).then((data) => {
          res.status(200).send(data);
        });
      })
      .catch((err) => res.status(400).json(err));
  }
  getTransactionReport(req: Request, res: Response) {
    let { start, end } = req.query;
    //! SQL Query for getting transaction report
    let sql = `
            SELECT 
              u.name, i.material, STRFTIME('%d-%m-%Y',t.date) AS date,
              (CASE WHEN t.inward THEN t.inward ELSE 0 END) AS inward,
              (CASE WHEN t.outward THEN t.outward ELSE 0 END) AS outward
            FROM transactions t
            LEFT JOIN inventories i ON i.id = t.inventory_id
            LEFT JOIN users u ON u.id = t.user_id
            WHERE (t.date BETWEEN '${start}' AND '${end}')
    `;
    sequelize
      .query(sql)
      .then((result) => {
        if (result[0].length === 0)
          res.status(400).json({ message: "No data found" });
        else
          jsonToExcel(result[0]).then((data) => {
            res.status(200).send(data);
          });
      })
      .catch((err) => res.status(400).json(err));
  }
}
