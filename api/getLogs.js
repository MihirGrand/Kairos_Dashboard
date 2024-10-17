export default async function handler(req, res) {
  const apiPass = process.env.GRAND_API_PASS;

  const response = await fetch(`https://kairosapi.vercel.app/get_logs?token=${apiPass}`);

  if (!response.ok) {
    res.status(response.status).json({ error: "Failed to fetch logs" });
    return;
  }

  const logs = await response.json();
  res.status(200).json(logs);
}
