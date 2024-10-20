from escpos.printer import Usb

# Replace with your printer's vendor and product IDs
USB_VENDOR_ID = 0x2aaf  # Change to your printer's USB Vendor ID
USB_PRODUCT_ID = 0x6004  # Change to your printer's USB Product ID

try:
    # Initialize the printer
    printer = Usb(USB_VENDOR_ID, USB_PRODUCT_ID)

    # Print header
    printer.set(align='center', bold=True)
    printer.text("Sample Store\n")
    printer.text("123 Sample St, City\n")
    printer.text("Phone: 123-456-7890\n")
    printer.text("------------------------------\n")

    # Print items
    printer.set(align='left', bold=False)
    printer.text("Item                Qty   Price\n")
    printer.text("------------------------------\n")
    printer.text("Apple Juice         2    $4.00\n")
    printer.text("Banana              5    $2.50\n")
    printer.text("Chocolate Bar       1    $1.75\n")
    printer.text("------------------------------\n")

    # Print total
    printer.set(align='right', bold=True)
    printer.text("Total:         $8.25\n")

    # Footer
    printer.set(align='center', bold=False)
    printer.text("------------------------------\n")
    printer.text("Thank you for shopping!\n")
    printer.text("\n\n")

    # Cut the paper
    printer.cut()

except Exception as e:
    print(f"Failed to print: {e}")
