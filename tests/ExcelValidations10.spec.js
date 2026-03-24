const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcelTest(searchText, replaceText, change, sheetPath) {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(sheetPath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = readExcel(worksheet, searchText); // not async

    const cell = worksheet.getCell(output.row, output.column + change.colChange);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(sheetPath);
}

// This does no async work, so don't mark it async.
function readExcel(worksheet, searchText) {
    let output = { row: -1, column: -1 };
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                output = { row: rowNumber, column: colNumber };
            }
        });
    });
    return output;
}

//update Mango Price to 350. 
//writeExcelTest("Mango",350,{rowChange:0,colChange:2},"G:/Users/GP/Downloads/download.xlsx");

test('Upload download excel validation', async ({ page }) => {
    const textSearch = 'Mango';
    const updateValue = '350';
    const sheetPath = 'downloadedExcel.xlsx'

    await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click(); // click the download button
    const download = await downloadPromise; // wait for download event to complete

    await download.saveAs(sheetPath); // save the file to CWD

    // ✅ Ensure the edit finishes before upload
    await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, sheetPath);

    await page.locator('#fileinput').setInputFiles(sheetPath);

    const desiredRow = await page.getByRole('row').filter({ has: page.getByText(textSearch) });
    await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);
});