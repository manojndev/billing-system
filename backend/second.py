from escpos.printer import Usb

# Replace with your printer's vendor and product IDs
USB_VENDOR_ID = 0x2aaf  # Change to your printer's USB Vendor ID
USB_PRODUCT_ID = 0x6004  # Change to your printer's USB Product ID

try:
    # Initialize the printer
    printer = Usb(USB_VENDOR_ID, USB_PRODUCT_ID)

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

    # Item details
    items = [
        {"name": "Apple Juice", "qty": 2, "price": 4.00, "gst": 5},
        {"name": "Banana", "qty": 5, "price": 2.50, "gst": 0},
        {"name": "Chocolate Bar for you to eat", "qty": 1, "price": 30000, "gst": 12}
    ]

    total = 0

    # Print each item with calculations for GST and final amount
    for item in items:
        amount_without_gst = item["qty"] * item["price"]
        gst_amount = amount_without_gst * (item["gst"] / 100)
        amount_with_gst = amount_without_gst + gst_amount
        total += amount_with_gst

        # Handle long item names
        item_name = item["name"]
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
                    line, item["qty"], item["price"], item["gst"], amount_with_gst
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

except Exception as e:
    print(f"Failed to print: {e}")