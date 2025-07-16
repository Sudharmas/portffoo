// /api/send-email.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { name, email, message } = req.body;

  try {
    const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: name,
          from_email: email,
          message
        }
      })
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      return res.status(500).json({ error: "Email sending failed", detail: err });
    }

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal error", detail: err.message });
  }
}
