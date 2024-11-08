# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from escpos.printer import Usb
from PIL import Image

app = FastAPI()

class Item(BaseModel):
    name: str
    qty: int
    price: float
    gst: int

class PrintJob(BaseModel):
    items: list[Item]

# Replace with your printer's vendor and product IDs
USB_VENDOR_ID = 0x2aaf  # Change to your printer's USB Vendor ID
USB_PRODUCT_ID = 0x6004  # Change to your printer's USB Product ID

@app.post("/print")
async def print_receipt(print_job: PrintJob):
    try:
        # Initialize the printer
        printer = Usb(USB_VENDOR_ID, USB_PRODUCT_ID)

        # Load and resize the image
        image_path = 'outputsecnd.png'
        image = Image.open(image_path)
        image = image.resize((200, int(image.height * (200 / image.width))), Image.LANCZOS)
        image.save('resized_image.png')

        # Print the resized image
        printer.image('resized_image.png')

        # Print header
        printer.set(align='center', bold=True)
        printer.text("Selvam Broiler\n")
        printer.text("Avinashi road , Annur, 641653\n")
        printer.text("Phone: 123-456-7890\n")
        printer.text("--------------------------------------------\n")

        # Print column headers
        printer.set(align='left', bold=True)
        printer.text("{:<16} {:>4} {:>7} {:>5} {:>8}\n".format("Item", "Qty", "Price", "GST%", "Amount"))
        printer.text("--------------------------------------------\n")

        total = 0

        # Print each item with calculations for GST and final amount
        for item in print_job.items:
            amount_without_gst = item.qty * item.price
            gst_amount = amount_without_gst * (item.gst / 100)
            amount_with_gst = amount_without_gst + gst_amount
            total += amount_with_gst

            # Handle long item names
            item_name = item.name
            if len(item_name) > 16:
                words = item_name.split()
                item_name = ""
                line = ""
                for word in words:
                    if len(line) + len(word) + 1 > 16:
                        item_name += line.strip() + "\n"
                        line = word + " "
                    else:
                        line += word + " "
                item_name += line.strip()

            # Print item row
            lines = item_name.split("\n")
            for i, line in enumerate(lines):
                if i == len(lines) - 1:
                    printer.set(align='left', bold=False)
                    printer.text("{:<16} {:>4} {:>7.2f} {:>5}% {:>8.2f}\n".format(
                        line, item.qty, item.price, item.gst, amount_with_gst
                    ))
                else:
                    printer.set(align='left', bold=False)
                    printer.text("{:<16}\n".format(line))

        printer.text("------------------------------------------------\n")

        # Print total
        printer.set(align='right', bold=True)
        printer.text("Total:         {:.2f}\n".format(total))

        # Footer
        printer.set(align='center', bold=False)
        printer.text("------------------------------\n")
        printer.text("Thank you for shopping!\n")
        printer.text("\n\n")

        # Cut the paper
        printer.cut()

        return {"message": "Print job completed successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to print: {e}")