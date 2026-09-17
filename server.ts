import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Mailgun from "mailgun.js";
import formData from "form-data";
import cors from "cors";
import fs from "fs";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";



async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    res.setHeader('X-Server-Version', '1.0.8');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Initialize Firebase Admin for background work and logging
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
  
  if (!getApps().length) {
    initializeApp({
      projectId: firebaseConfig.projectId
    });
  }
  
  // Get the correct Firestore instance
  const adminDb = getFirestore(firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined);

  // Explicit OPTIONS handler for all routes to help with preflights
  app.options('*', cors());



  // Mailgun Client Lazy Initialization
  let mgClient: any = null;
  const getMailgun = () => {
    if (!mgClient) {
      const apiKey = process.env.MAILGUN_API_KEY;
      if (!apiKey) {
        console.error("MAILGUN_API_KEY is missing from environment variables");
        return null;
      }
      const mailgun = new Mailgun(formData);
      mgClient = mailgun.client({ username: 'api', key: apiKey });
      console.log("Mailgun client initialized successfully");
    }
    return mgClient;
  };

  const sendEmail = async (subject: string, body: string, recipients: string[], customization?: any) => {
    const domain = process.env.MAILGUN_DOMAIN || "newsletter.altbusinessconnections.org";
    const rawFromEmail = process.env.MAILGUN_FROM_EMAIL || `updates@${domain}`;
    
    // Branding & Customization
    const bannerColor = customization?.bannerColor || "#1a3a3a";
    const bannerTextColor = customization?.bannerTextColor || "#d4af37";
    const orgName = customization?.organizationName || "ALT Business Connections";
    const footerAddress = customization?.address || "Auburn Lake Trails • Cool, California";
    const footerWebsite = customization?.website || "https://www.altbusinessconnections.org";
    const footerPhone = customization?.phone || "";
    const footerEmail = customization?.contactEmail || "";
    const replyTo = customization?.replyTo || process.env.MAILGUN_REPLY_TO || "growlocalcreative@gmail.com";
    const footerText = customization?.footerText || "You are receiving this because you are part of our local community network.";

    const mg = getMailgun();
    if (!mg) throw new Error("Mailgun not configured");

    const recipientVariables: Record<string, any> = {};
    recipients.forEach(email => {
      recipientVariables[email] = { id: email };
    });

    return mg.messages.create(domain, {
      from: `${orgName} <${rawFromEmail.includes('<') ? rawFromEmail.split('<')[1].split('>')[0] : rawFromEmail}>`,
      to: recipients,
      'h:Reply-To': replyTo,
      'o:tracking': 'yes',
      'o:tracking-clicks': 'yes',
      'o:tracking-opens': 'yes',
      'recipient-variables': JSON.stringify(recipientVariables),
      subject: subject,
      text: `${body}\n\n---\n${orgName}\n${footerWebsite}\n${footerAddress}${footerPhone ? `\nPhone: ${footerPhone}` : ""}${footerEmail ? `\nEmail: ${footerEmail}` : ""}\nTo unsubscribe, please reply to this email with "Unsubscribe".`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              .content-box { line-height: 1.6; color: #334155; }
              .footer { color: #94a3b8; font-size: 12px; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
              .footer a { color: ${bannerTextColor}; text-decoration: none; }
            </style>
          </head>
          <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 0; margin: 0;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: ${bannerColor}; padding: 30px; text-align: center;">
                        <h1 style="color: ${bannerTextColor}; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px;">${orgName}</h1>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px 30px;" class="content-box">
                        <div style="font-size: 16px;">
                          ${body.replace(/\n/g, '<br>')}
                        </div>
                        
                        <!-- Compliance Footer -->
                        <div class="footer">
                          <p style="margin: 0 0 10px 0;"><strong>${orgName}</strong></p>
                          <p style="margin: 0 0 5px 0;">${footerAddress}</p>
                          <p style="margin: 0 0 5px 0;">${footerPhone ? `Phone: ${footerPhone}` : ""}</p>
                          <p style="margin: 0 0 5px 0;">${footerEmail ? `Email: <a href="mailto:${footerEmail}">${footerEmail}</a>` : ""}</p>
                          <p style="margin: 0 0 20px 0;"><a href="${footerWebsite}">${footerWebsite.replace('https://', '').replace('http://', '')}</a></p>
                          <p style="margin: 0; font-style: italic;">
                            ${footerText}
                            <br>
                            <a href="mailto:${replyTo}?subject=Unsubscribe">Unsubscribe from this list</a>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    });
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      env: process.env.NODE_ENV
    });
  });

  app.post("/api/newsletter/send", async (req, res) => {
    console.log(`[${new Date().toISOString()}] Newsletter send request received`, {
      subject: req.body.subject,
      recipientCount: req.body.recipients?.length,
      recipients: req.body.recipients
    });

    const { subject, body, recipients, customization } = req.body;

    if (!subject || !body || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      console.warn("Newsletter send failed: Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      console.log("Attempting to send email via Mailgun...");
      const result = await sendEmail(subject, body, recipients, customization);
      console.log("Mailgun API accepted the request. Result:", result);
      res.json({ success: true, messageId: result.id });
    } catch (error: any) {
      console.error("Mailgun send error detected:", {
        message: error.message,
        stack: error.stack,
        details: error.details,
        status: error.status
      });
      res.status(500).json({ 
        error: error.message,
        details: error.details || "Check server logs for more information."
      });
    }
  });

  // Diagnostic endpoint to check configuration (safely)
  app.get("/api/newsletter/status", (req, res) => {
    const config = {
      mailgun: {
        apiKeySet: !!process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN || "newsletter.altbusinessconnections.org",
        from: process.env.MAILGUN_FROM_EMAIL || "updates@newsletter.altbusinessconnections.org",
        replyTo: process.env.MAILGUN_REPLY_TO || "growlocalcreative@gmail.com"
      },
      env: process.env.NODE_ENV,
      version: '1.0.8'
    };
    console.log("Diagnostic status requested:", config);
    res.json(config);
  });

  // API 404 handler - helps debug 405/404 issues

  app.all("/api/*", (req, res) => {
    res.status(404).json({ 
      error: "API Route Not Found",
      method: req.method,
      path: req.originalUrl 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
