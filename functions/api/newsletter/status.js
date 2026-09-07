const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function onRequestGet({ env }) {
  const config = {
    mailgun: {
      apiKeySet: !!env.MAILGUN_API_KEY,
      domain: env.MAILGUN_DOMAIN || "newsletter.altbusinessconnections.org",
      from: env.MAILGUN_FROM_EMAIL || "updates@newsletter.altbusinessconnections.org",
      replyTo: env.MAILGUN_REPLY_TO || "growlocalcreative@gmail.com"
    },
    version: '1.0.9-pages-function'
  };
  
  return new Response(JSON.stringify(config), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
