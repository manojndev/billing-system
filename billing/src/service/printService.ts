// printService.ts
import axios from 'axios';

interface Item {
    name: string;
    qty: number;
    price: number;
    gst: number;
    amount_with_gst: number;  // Add amount_with_gst field
}

interface PrintJob {
    items: Item[];
    total: number;  // Add total field
}

export async function sendPrintJob(printJob: PrintJob): Promise<void> {
    try {
        const response = await axios.post('http://localhost:8000/print', printJob);
        console.log('Print job completed successfully:', response.data);
    } catch (error) {
        console.error('Failed to send print job:', error);
    }
}