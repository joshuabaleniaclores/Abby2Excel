import * as XLSX from 'xlsx';

export interface DeliveryItem {
    date: string;
    qty: string;
    unit: string;
    item: string;
    drNumber: string; // Control No.
    remarks?: string;
    receivedBy?: string;
}

export function downloadDeliveryExcel(items: DeliveryItem[]) {
    const currentYear = new Date().getFullYear();
    const filename = `Manila Delivery ${currentYear}.xlsx`;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Prepare data with empty A column (since headers start at B1)
    // Headers: [Date, Qty, Unit, Item, DR#, Remarks, Received By] -> B, C, D, E, F, G, H
    // Row 1: empty, Date, Qty...
    const headers = ["", "Date", "Qty", "Unit", "Item", "DR#", "Remarks", "Received by"];

    const data = items.map(item => [
        "", // A column empty
        item.date,
        item.qty,
        item.unit,
        item.item,
        item.drNumber,
        item.remarks || "",
        item.receivedBy || ""
    ]);

    const wsData = [headers, ...data];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths for better readibility
    ws['!cols'] = [
        { wch: 2 }, // A
        { wch: 15 }, // Date
        { wch: 10 }, // Qty
        { wch: 10 }, // Unit
        { wch: 30 }, // Item
        { wch: 15 }, // DR#
        { wch: 20 }, // Remarks
        { wch: 20 }, // Received by
    ];

    // Append sheet
    XLSX.utils.book_append_sheet(wb, ws, "Delivery");

    // Trigger download
    XLSX.writeFile(wb, filename);
}
