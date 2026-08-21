import { Booking, Invoice, InvoiceItem } from '../types';
import jsPDF from 'jspdf';

export interface BillingCalculationInput {
  booking: Booking;
  actualHours: number;
  fuelSurcharge?: number;
  transportCharge?: number;
  discountAmount?: number;
  platformFee?: number;
}

/**
 * Calculates finalized rental invoice details factoring telemetry actuals
 */
export function calculateFinalInvoice(input: BillingCalculationInput): Invoice {
  const {
    booking,
    actualHours,
    fuelSurcharge = 240,
    transportCharge = 300,
    discountAmount = 100,
    platformFee = 100
  } = input;

  const baseRentalAmount = Math.round(actualHours * booking.hourlyRate);
  const taxableSubtotal = baseRentalAmount + transportCharge + fuelSurcharge + platformFee - discountAmount;
  const taxGstAmount = Math.round(taxableSubtotal * 0.05); // 5% GST
  const finalTotalAmount = taxableSubtotal + taxGstAmount;

  const items: InvoiceItem[] = [
    {
      description: `Machinery Rental: ${booking.machineModel} (${actualHours} actual hrs @ ₹${booking.hourlyRate}/hr)`,
      quantity: actualHours,
      unitPrice: booking.hourlyRate,
      totalPrice: baseRentalAmount
    },
    {
      description: 'Mobilization & Equipment Transport (Bilkisganj Hub Route)',
      quantity: 1,
      unitPrice: transportCharge,
      totalPrice: transportCharge
    },
    {
      description: 'Fuel Variance & Telematics Telemetry Charge',
      quantity: 1,
      unitPrice: fuelSurcharge,
      totalPrice: fuelSurcharge
    },
    {
      description: 'Yukti Digital Operations & Telematics Platform Fee',
      quantity: 1,
      unitPrice: platformFee,
      totalPrice: platformFee
    }
  ];

  if (discountAmount > 0) {
    items.push({
      description: 'AgriCredit Seasonal Loyalty Promotion Discount',
      quantity: 1,
      unitPrice: -discountAmount,
      totalPrice: -discountAmount
    });
  }

  const invoiceNumber = `INV-${new Date().getFullYear()}-${booking.bookingNumber.replace('BK-', '')}`;

  return {
    id: `inv-${booking.id}`,
    invoiceNumber,
    bookingId: booking.id,
    bookingNumber: booking.bookingNumber,
    farmerName: booking.farmerName,
    farmerPhone: booking.farmerPhone,
    chcName: booking.chcName,
    machineName: booking.machineModel,
    machineIdentifier: booking.machineIdentifier,
    rentalPeriod: `${booking.startTime.slice(0, 10)} (${booking.bookedHours}h booked / ${actualHours}h actual)`,
    bookedHours: booking.bookedHours,
    actualHours,
    baseRatePerHour: booking.hourlyRate,
    baseRentalAmount,
    transportCharge,
    fuelSurcharge,
    platformFee,
    discountAmount,
    taxGstAmount,
    finalTotalAmount,
    paymentMethod: booking.paymentMethod,
    paymentStatus: booking.paymentStatus === 'CAPTURED' ? 'CAPTURED' : 'AUTHORIZED',
    issuedAt: new Date().toISOString(),
    items
  };
}

/**
 * Generates and downloads a clean professional PDF invoice
 */
export function generatePdfInvoice(invoice: Invoice): void {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(27, 77, 62); // Agri Dark Green
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Yukti', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Agricultural Machinery Intelligence & CHC Network', 14, 26);
  doc.text(`Tax Invoice #${invoice.invoiceNumber}`, 130, 26);

  // Bill To & Booking Info
  doc.setTextColor(33, 37, 41);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To (Farmer):', 14, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.farmerName, 14, 55);
  doc.text(`Phone: ${invoice.farmerPhone}`, 14, 61);
  doc.text(`Booking Ref: ${invoice.bookingNumber}`, 14, 67);

  doc.setFont('helvetica', 'bold');
  doc.text('Custom Hiring Centre:', 120, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.chcName, 120, 55);
  doc.text(`Equipment: ${invoice.machineName} (${invoice.machineIdentifier})`, 120, 61);
  doc.text(`Issued Date: ${new Date(invoice.issuedAt).toLocaleDateString()}`, 120, 67);

  // Table Headers
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(243, 244, 238);
  doc.rect(14, 76, 182, 9, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Item Description', 18, 82);
  doc.text('Qty / Hrs', 120, 82);
  doc.text('Rate', 145, 82);
  doc.text('Amount (INR)', 170, 82);

  // Table Rows
  let y = 92;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  invoice.items.forEach(item => {
    doc.text(item.description, 18, y);
    doc.text(item.quantity.toString(), 125, y);
    doc.text(`₹${Math.abs(item.unitPrice)}`, 147, y);
    doc.text(`₹${item.totalPrice}`, 172, y);
    y += 8;
  });

  // Summary Lines
  y += 6;
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 8;

  doc.text('Subtotal:', 135, y);
  doc.text(`₹${invoice.baseRentalAmount + invoice.transportCharge + invoice.fuelSurcharge + invoice.platformFee - invoice.discountAmount}`, 172, y);
  y += 7;

  doc.text('GST (5%):', 135, y);
  doc.text(`₹${invoice.taxGstAmount}`, 172, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Final Total:', 135, y);
  doc.text(`₹${invoice.finalTotalAmount}`, 172, y);

  // Payment Status Box
  y += 18;
  doc.setFillColor(242, 248, 245);
  doc.roundedRect(14, y, 182, 20, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(27, 77, 62);
  doc.text(`Payment Method: ${invoice.paymentMethod.replace('_', ' ')}`, 20, y + 8);
  doc.text(`Payment Status: ${invoice.paymentStatus} (Verified by Yukti Telematics Engine)`, 20, y + 14);

  // Footer
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated tax invoice verified by telematics data from Yukti platform.', 14, 285);

  doc.save(`${invoice.invoiceNumber}.pdf`);
}
