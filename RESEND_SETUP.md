# Resend Email Setup Guide

This guide will help you set up Resend to send invoice emails automatically.

## What is Resend?

Resend is a modern email API built for developers. It offers:
- ✅ **3,000 emails/month FREE** (no credit card required)
- ✅ Simple integration
- ✅ Great deliverability
- ✅ Support for attachments (PDFs)
- ✅ TypeScript-first

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" (top right)
3. Create account with your email
4. Verify your email address

### 2. Get Your API Key

1. Log in to [Resend Dashboard](https://resend.com/home)
2. Click "API Keys" in the left sidebar
3. Click "Create API Key"
4. Name it (e.g., "PixelPro Invoice Sender")
5. Select permissions: **Full Access** (or at minimum: "Sending access")
6. Click "Create"
7. **Copy the API key** (starts with `re_...`)
   - ⚠️ You can only see this once! Save it securely

### 3. Add API Key to Your Project

1. Open your `.env.local` file in the project root
2. Find the line:
   ```
   RESEND_API_KEY=re_your_resend_api_key_here
   ```
3. Replace `re_your_resend_api_key_here` with your actual API key:
   ```
   RESEND_API_KEY=re_abc123xyz789...
   ```
4. Save the file
5. **Restart your development server** for changes to take effect

### 4. Verify Your Domain (Optional but Recommended)

By default, emails are sent from `onboarding@resend.dev`. To use your own domain:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `pixelprostudios.com`)
4. Add the DNS records shown to your domain provider:
   - SPF record
   - DKIM records
   - DMARC record (optional)
5. Wait for verification (usually 5-10 minutes)
6. Update the `from` address in `lib/actions/invoices.ts`:
   ```typescript
   from: "PixelPro Studios <invoices@pixelprostudios.com>",
   ```

### 5. Test the Email Functionality

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin/orders`

3. Click "Send Invoice" on any order

4. Check the email inbox for the customer

5. Verify:
   - ✅ Email arrives
   - ✅ PDF attachment is included
   - ✅ Formatting looks good
   - ✅ Invoice details are correct

## Current Email Configuration

The invoice email includes:

**Subject**: `Invoice for Order {REFERENCE_NUMBER}`

**From**: `PixelPro Studios <onboarding@resend.dev>` (change after domain verification)

**To**: Customer's email from order

**Content**:
- Personalized greeting with customer name
- Order details (reference number, total, status)
- Professional HTML formatting
- PDF invoice attachment

## Customizing the Email Template

To customize the email content, edit [lib/actions/invoices.ts](lib/actions/invoices.ts) line 42-63:

```typescript
html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Invoice from PixelPro Studios</h2>
    <!-- Customize your HTML here -->
  </div>
`
```

## Troubleshooting

### "Failed to send invoice email"

**Check:**
1. Is your API key correct in `.env.local`?
2. Did you restart the dev server after adding the key?
3. Check browser console for error details
4. Check Resend dashboard for failed send attempts

### Email not arriving

**Check:**
1. Spam/junk folder
2. Resend logs in dashboard: [Resend Emails](https://resend.com/emails)
3. Email address is valid
4. You haven't exceeded free tier limit (3,000/month)

### "Invalid API key" error

**Fix:**
1. Verify API key starts with `re_`
2. No extra spaces or quotes in `.env.local`
3. Generate a new API key if needed

### Using wrong sender email

**Fix:**
1. If domain not verified, use: `onboarding@resend.dev`
2. If domain verified, use: `your-email@yourdomain.com`
3. Update `from:` field in `lib/actions/invoices.ts`

## Free Tier Limits

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day
- API access
- Email logs
- Webhooks

**Upgrading**: If you need more, paid plans start at $20/month for 50,000 emails

## Monitoring Email Delivery

View all sent emails in [Resend Dashboard > Emails](https://resend.com/emails):
- Delivery status
- Open/click tracking (if enabled)
- Bounce handling
- Error logs

## Alternative Email Services

If you prefer a different service:

### SendGrid (Free: 100 emails/day)
```bash
npm install @sendgrid/mail
```

### Mailgun (Free: 5,000 emails/month for 3 months)
```bash
npm install mailgun.js
```

### AWS SES (Free: 62,000 emails/month if on AWS)
```bash
npm install @aws-sdk/client-ses
```

## Support

- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **API Reference**: [resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **Support**: [resend.com/support](https://resend.com/support)

---

**Last Updated**: January 3, 2026
