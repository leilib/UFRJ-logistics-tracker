res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, redirect_uri, verifier } = req.body;

  const response = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: "4602042605636246",
      client_secret: process.env.CLIENT_SECRET, // set in Vercel dashboard
      code,
      redirect_uri,
      code_verifier: verifier
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
