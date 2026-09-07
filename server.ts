import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Mailgun from "mailgun.js";
import formData from "form-data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mailgun Client Lazy Initialization
  let mgClient: any = null;
  const getMailgun = () => {
    if (!mgClient) {
      const apiKey = process.env.MAILGUN_API_KEY;
      if (!apiKey) {
        throw new Error("MAILGUN_API_KEY is not configured");
      }
      const mailgun = new Mailgun(formData);
      mgClient = mailgun.client({ username: 'api', key: apiKey });
    }
    return mgClient;
  };

  // API Routes
  app.post("/api/newsletter/send", async (req, res) => {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients || !Array.isArray(recipients)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const domain = process.env.MAILGUN_DOMAIN || "newsletter.altbusinessconnections.org";
      const rawFromEmail = process.env.MAILGUN_FROM_EMAIL || `updates@${domain}`;
      const replyTo = process.env.MAILGUN_REPLY_TO || "growlocalcreative@gmail.com";

      // Force the display name to "ALT Business Connections" for professional appearance
      // This fixes the issue where only 'renee' was appearing in the from column
      const fromEmail = rawFromEmail.includes("<") 
        ? rawFromEmail.replace(/^[^<]+/, "ALT Business Connections ")
        : `ALT Business Connections <${rawFromEmail}>`;

      if (!domain) {
        throw new Error("MAILGUN_DOMAIN is not configured");
      }

      const mg = getMailgun();
      
      // Use Mailgun Batch Sending for better deliverability
      const recipientVariables: Record<string, any> = {};
      recipients.forEach(email => {
        recipientVariables[email] = { id: email };
      });

      await mg.messages.create(domain, {
        from: fromEmail,
        to: recipients,
        'h:Reply-To': replyTo, // Critical for "Trust"
        'o:tracking': 'yes', // Enable open/click tracking
        'o:tracking-clicks': 'yes',
        'o:tracking-opens': 'yes',
        'recipient-variables': JSON.stringify(recipientVariables),
        subject: subject,
        text: `${body}\n\n---\nALT Business Connections\nwww.altbusinessconnections.org\nAuburn Lake Trails, CA\nTo unsubscribe, please reply to this email with "Unsubscribe".`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                .content-box { line-height: 1.6; color: #334155; }
                .footer { color: #94a3b8; font-size: 12px; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
                .footer a { color: #d4af37; text-decoration: none; }
              </style>
            </head>
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 0; margin: 0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                      <!-- Header -->
                      <tr>
                        <td style="background-color: #1a3a3a; padding: 30px; text-align: center;">
                          <h1 style="color: #d4af37; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px;">ALT Business Connections</h1>
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
                            <p style="margin: 0 0 10px 0;"><strong>ALT Business Connections</strong></p>
                            <p style="margin: 0 0 5px 0;">Auburn Lake Trails • Cool, California</p>
                            <p style="margin: 0 0 20px 0;"><a href="https://www.altbusinessconnections.org">www.altbusinessconnections.org</a></p>
                            <p style="margin: 0; font-style: italic;">
                              You are receiving this because you are part of our local community network.
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

      res.json({ success: true });
    } catch (error: any) {
      console.error("Mailgun Error:", error);
      res.status(500).json({ error: error.message || "Failed to send newsletter" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
