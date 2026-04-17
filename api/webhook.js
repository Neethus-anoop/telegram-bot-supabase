export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ message: "Webhook endpoint is live" });
    }

    const body = req.body;
    const message = body?.message;
    const chatId = message?.chat?.id;
    const text = message?.text || "";

    if (!chatId) {
      return res.status(200).json({ ok: true, message: "No chat id found" });
    }

    let replyText = "Message received";

    if (text.startsWith("/start")) {
      replyText = "Hello! Your bot is working on Vercel.";
    } else if (text.startsWith("/help")) {
      replyText = "Send any message and I will reply.";
    } else {
      replyText = `You said: ${text}`;
    }

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
      }),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}