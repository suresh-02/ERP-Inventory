import { Workbook } from "exceljs";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

export function jsonToExcel(data: any): Promise<any> {
  const header = Object.keys(data[0]);
  let workbook = exportAsExcelFile("KRAFT AUTO PARTS", header, data);

  return new Promise<any>((resolve, reject) => {
    /*Save Excel File*/
    workbook.xlsx.writeBuffer().then((buffer) => {
      return resolve(buffer);
    });
  });
}

function exportAsExcelFile(
  reportHeading: string,
  headersArray: any[],
  json: any[]
) {
  const header = headersArray;
  const data = json;

  /* Create workbook and worksheet */
  const workbook = new Workbook();
  workbook.creator = "Snippet Coder";
  workbook.lastModifiedBy = "SnippetCoder";
  workbook.created = new Date();
  workbook.modified = new Date();
  const worksheet = workbook.addWorksheet("Sheet 1");

  /* Add Header Row */
  worksheet.addRow([]);
  worksheet.mergeCells("A1:" + numToAlpha(header.length - 1) + "1");
  worksheet.getCell("A1").value = reportHeading;
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { size: 26, bold: true };

  /* Add Header Row */
  const headerRow = worksheet.addRow(header);

  // Cell Style : Fill and Border
  headerRow.eachCell((cell, index) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" },
      bgColor: { argb: "FF0000FF" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.font = { size: 12, bold: true };

    worksheet.getColumn(index).width =
      header[index - 1].length < 20 ? 20 : header[index - 1].length;
  });

  // Get all columns from JSON
  let columnsArray: any[];
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      columnsArray = Object.keys(json[key]);
    }
  }

  // Add Data and Conditional Formatting
  data.forEach((element: any) => {
    const eachRow: any[] = [];
    columnsArray.forEach((column) => {
      eachRow.push(element[column]);
    });

    if (element.isDeleted === "Y") {
      const deletedRow = worksheet.addRow(eachRow);
      deletedRow.eachCell((cell) => {
        cell.font = {
          name: "Calibri",
          family: 4,
          size: 11,
          bold: false,
          strike: true,
        };
      });
    } else {
      worksheet.addRow(eachRow);
    }
  });
  return workbook;
}

function numToAlpha(num: number) {
  let alpha = "";

  for (; num >= 0; num = parseInt((num / 26).toString(), 10) - 1) {
    alpha = String.fromCharCode((num % 26) + 0x41) + alpha;
  }

  return alpha;
}
