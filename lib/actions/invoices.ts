"use server";

import { createClient } from "@/lib/supabase/server";
import { jsPDF } from "jspdf";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

export async function sendInvoice(orderId: string) {
  try {
    console.log("Generating invoice for order:", orderId);
    const supabase = await createClient();

    // Fetch order with all details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        lead:leads(*),
        order_items:order_items(
          *,
          service:services(*)
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Error fetching order:", orderError);
      return { success: false, error: "Order not found" };
    }

    // Generate PDF invoice
    const pdfBuffer = await generateInvoicePDF(order);

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email with PDF attachment
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "PixelPro Studios <billing@pixelprostudios.sg>", // Change to your verified domain
      to: order.lead.email,
      subject: `Invoice for Order ${order.reference_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Invoice from PixelPro Studios</h2>
          <p>Dear ${order.lead.full_name},</p>
          <p>Thank you for your order! Please find your invoice attached.</p>

          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Invoice Number:</strong> ${order.reference_number}</p>
            <p><strong>Total Amount:</strong> $${order.total_bows_price.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status.replace("_", " ").toUpperCase()}</p>
          </div>

          <p>If you have any questions, please don't hesitate to contact us.</p>

          <p style="margin-top: 30px;">
            Best regards,<br/>
            <strong>PixelPro Studios</strong><br/>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice-${order.reference_number}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return { success: false, error: "Failed to send invoice email" };
    }

    console.log("Invoice sent successfully:", emailData);
    return {
      success: true,
      message: `Invoice sent to ${order.lead.email}`,
      reference: order.reference_number,
    };
  } catch (error) {
    console.error("Error sending invoice:", error);
    return { success: false, error: "Failed to send invoice" };
  }
}

async function generateInvoicePDF(order: any): Promise<Buffer> {
  const doc = new jsPDF();

  // Add Company Logo
  try {
    const logoPath = path.join(process.cwd(), "public/pixelpro-studios-logo.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    doc.addImage(logoBase64, "PNG", 20, 10, 20, 20);
    
    // Add Company Name next to logo
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PixelPro Studios", 45, 25);
  } catch (error) {
    console.error("Failed to add logo to PDF:", error);
    // Fallback to text if logo fails to load
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PixelPro Studios", 20, 20);
  }


  // Invoice Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 150, 18);

  // Order Information
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${order.reference_number}`, 150, 30);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 150, 37);
  doc.text(`Status: ${order.status.replace("_", " ").toUpperCase()}`, 150, 44);

  // Customer Information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 50);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(order.lead.full_name, 20, 57);
  doc.text(order.lead.email, 20, 64);
  doc.text(order.lead.phone, 20, 71);

  if (order.lead.event_date) {
    doc.text(`Event Date: ${new Date(order.lead.event_date).toLocaleDateString()}`, 20, 78);
  }

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 85, 190, 85);

  // Table Header
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Service", 20, 95);
  doc.text("Qty", 120, 95);
  doc.text("Price", 145, 95);
  doc.text("Total", 170, 95);

  doc.setLineWidth(0.3);
  doc.line(20, 98, 190, 98);

  // Table Items
  doc.setFont("helvetica", "normal");
  let yPosition = 108;

  order.order_items.forEach((item: any) => {
    const serviceName = item.service.name;
    const quantity = item.quantity;
    const price = item.bows_price;
    const total = price * quantity;

    // Wrap text if too long
    const wrappedText = doc.splitTextToSize(serviceName, 90);
    doc.text(wrappedText, 20, yPosition);
    doc.text(quantity.toString(), 120, yPosition);
    doc.text(`$${price.toFixed(2)}`, 145, yPosition);
    doc.text(`$${total.toFixed(2)}`, 170, yPosition);

    yPosition += wrappedText.length * 7 + 5;
  });

  // Line separator
  doc.setLineWidth(0.3);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;

  // Totals
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal (Original Price):", 120, yPosition);
  doc.text(`$${order.total_original_price.toFixed(2)}`, 170, yPosition);

  yPosition += 7;
  doc.setTextColor(0, 150, 0);
  doc.text("BOWS Discount:", 120, yPosition);
  doc.text(`-$${order.total_savings.toFixed(2)}`, 170, yPosition);

  yPosition += 10;
  doc.setLineWidth(0.5);
  doc.line(120, yPosition - 3, 190, yPosition - 3);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Total Amount Due:", 120, yPosition + 5);
  doc.text(`$${order.total_bows_price.toFixed(2)}`, 170, yPosition + 5);

  // Footer
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const footerY = 270;
  doc.text("Thank you for your business!", 105, footerY, { align: "center" });
  doc.text("PixelPro Studios @ BOWS", 105, footerY + 5, { align: "center" });

  if (order.lead.additional_notes) {
    doc.setFontSize(8);
    doc.text("Notes:", 20, footerY - 20);
    const notes = doc.splitTextToSize(order.lead.additional_notes, 170);
    doc.text(notes, 20, footerY - 15);
  }

  // Convert to buffer (for server-side usage)
  const pdfBlob = doc.output("arraybuffer");
  return Buffer.from(pdfBlob);
}
