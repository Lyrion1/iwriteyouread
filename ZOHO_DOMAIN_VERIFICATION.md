# Zoho Domain Verification Setup

This document provides step-by-step instructions for verifying your domain with Zoho Mail to enable email services at your custom domain.

## Prerequisites

- Access to your domain's DNS management panel (via your domain registrar or Netlify DNS)
- A Zoho Mail account (free tier available at https://www.zoho.com/mail)

## Domain Verification TXT Record

To verify domain ownership for `iwriteread.org`, you need to add the following TXT record to your DNS settings:

```
Type: TXT
Name: @ (or leave blank for root domain)
Value: zoho-verification=76528d1030.neverify.zoho.eu
TTL: 3600 (or Auto)
```

## Step-by-Step Instructions

### Option A: Using Netlify DNS

If your domain DNS is managed through Netlify:

1. Log in to your Netlify account
2. Navigate to your site dashboard
3. Go to **Domain Settings** → **DNS**
4. Click **Add new record**
5. Fill in the following:
   - **Record type**: TXT
   - **Name**: @ (or leave blank)
   - **Value**: `zoho-verification=76528d1030.neverify.zoho.eu`
   - **TTL**: 3600 (or leave default)
6. Click **Save**
7. Wait 5-30 minutes for DNS propagation

### Option B: Using Your Domain Registrar

If your domain DNS is managed through your registrar (GoDaddy, Namecheap, Google Domains, etc.):

1. Log in to your domain registrar's control panel
2. Navigate to DNS Management or DNS Settings
3. Find the section for adding DNS records
4. Click **Add Record** or **Add New Record**
5. Fill in the following:
   - **Type**: TXT
   - **Host/Name**: @ (or leave blank for root domain)
   - **Value/Answer**: `zoho-verification=76528d1030.neverify.zoho.eu`
   - **TTL**: 3600 (or Auto)
6. Save the record
7. Wait 5-30 minutes for DNS propagation (can take up to 48 hours in rare cases)

## Verify DNS Propagation

After adding the TXT record, you can verify it has propagated using these methods:

### Command Line (Mac/Linux)
```bash
dig TXT iwriteread.org
```

### Command Line (Windows)
```cmd
nslookup -type=TXT iwriteread.org
```

### Online Tools
- https://dnschecker.org (check globally)
- https://mxtoolbox.com/TXTLookup.aspx

Look for the value `zoho-verification=76528d1030.neverify.zoho.eu` in the results.

## Complete Zoho Mail Setup

Once the TXT record is verified:

1. Log in to Zoho Mail at https://www.zoho.com/mail
2. Go to the Control Panel
3. Navigate to **Domains** section
4. Click **Verify** next to your domain
5. Zoho will automatically detect the TXT record
6. Once verified, you can proceed to:
   - Create email addresses (e.g., hello@iwriteread.org)
   - Configure MX records for email delivery
   - Set up email forwarding if needed

## MX Records (After Verification)

After domain verification is complete, Zoho will provide MX records to add. These typically look like:

```
Type: MX
Name: @
Value: mx.zoho.eu (or similar)
Priority: 10

Type: MX  
Name: @
Value: mx2.zoho.eu (or similar)
Priority: 20
```

**Important**: Only add MX records AFTER completing domain verification with the TXT record.

## Troubleshooting

### TXT Record Not Detected

If Zoho doesn't detect your TXT record:

1. **Wait longer**: DNS propagation can take up to 48 hours
2. **Check syntax**: Ensure there are no extra spaces or quotes in the value
3. **Check record name**: Use `@` or leave blank for root domain (not `www`)
4. **Clear DNS cache**: 
   - Mac/Linux: `sudo dscacheutil -flushcache`
   - Windows: `ipconfig /flushdns`
5. **Verify record exists**: Use dig or nslookup commands above

### Multiple TXT Records

If you already have TXT records for other services (like SPF, DKIM, or site verification):

- You can have multiple TXT records for the same domain
- Each TXT record should be added separately
- Do NOT combine different TXT values into one record

### Contact Support

- **Zoho Support**: https://www.zoho.com/mail/help/
- **Netlify Support**: https://www.netlify.com/support/
- **Domain Registrar Support**: Contact your specific registrar

## Security Note

The verification TXT record proves domain ownership and should only be added if you're actually setting up Zoho Mail for your domain. Never add TXT records from unverified sources.

## Next Steps

After successful verification:

1. ✅ Create email addresses for your domain
2. ✅ Configure email clients (Outlook, Apple Mail, etc.)
3. ✅ Set up email forwarding if needed
4. ✅ Configure SPF and DKIM for better email deliverability
5. ✅ Update contact forms to send to your new domain email

---

**Status Tracking:**

- [ ] TXT record added to DNS
- [ ] DNS propagation verified
- [ ] Domain verified in Zoho
- [ ] Email address created
- [ ] MX records configured
- [ ] Email tested (send & receive)

For more general deployment instructions, see [DNS_AND_DEPLOYMENT_CHECKLIST.md](./DNS_AND_DEPLOYMENT_CHECKLIST.md).
