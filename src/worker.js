const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname === "/api/newsletter/send") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      try {
        const { subject, body, recipients } = await request.json();

        if (!subject || !body || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
          return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const domain = env.MAILGUN_DOMAIN || "newsletter.altbusinessconnections.org";
        const rawFromEmail = env.MAILGUN_FROM_EMAIL || `updates@${domain}`;
        const replyTo = env.MAILGUN_REPLY_TO || "growlocalcreative@gmail.com";
        const apiKey = env.MAILGUN_API_KEY;

        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Mailgun API key not configured" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const fromName = "ALT Business Connections";
        const fromEmail = rawFromEmail.includes('<') ? rawFromEmail.split('<')[1].split('>')[0] : rawFromEmail;
        const fromHeader = `${fromName} <${fromEmail}>`;

        const htmlTemplate = `
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
        `;

        const toField = recipients.join(', ');

        const mailgunResponse = await fetch(
          `https://api.mailgun.net/v3/${domain}/messages`,
          {
            method: "POST",
            headers: {
              "Authorization": "Basic " + btoa("api:" + apiKey),
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              from: fromHeader,
              to: toField,
              subject: subject,
              html: htmlTemplate,
              text: `${body}\n\n---\nALT Business Connections\nwww.altbusinessconnections.org\nAuburn Lake Trails, CA\nTo unsubscribe, please reply to this email with "Unsubscribe".`,
              'h:Reply-To': replyTo,
              'o:tracking': 'yes',
              'o:tracking-clicks': 'yes',
              'o:tracking-opens': 'yes'
            }),
          }
        );

        const result = await mailgunResponse.json();
        
        if (!mailgunResponse.ok) {
          return new Response(JSON.stringify({ error: result.message || "Failed to send email" }), {
            status: mailgunResponse.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true, messageId: result.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Diagnostic route
    if (url.pathname === "/api/newsletter/status") {
      const config = {
        mailgun: {
          apiKeySet: !!env.MAILGUN_API_KEY,
          domain: env.MAILGUN_DOMAIN || "newsletter.altbusinessconnections.org",
          from: env.MAILGUN_FROM_EMAIL || "updates@newsletter.altbusinessconnections.org",
          replyTo: env.MAILGUN_REPLY_TO || "growlocalcreative@gmail.com"
        },
        envKeys: Object.keys(env).filter(k => k !== 'ASSETS'),
        version: '1.1.1-worker'
      };
      
      return new Response(JSON.stringify(config), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback to static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  },
};
