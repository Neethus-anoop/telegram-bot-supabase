const { saveMessage } = require('../supabase');

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(200).send("Webhook working");
    }

    const body = req.body;
    const message = body?.message;

    if (!message) {
      return res.status(200).json({ ok: true, message: "No message found" });
    }

    const chatId = message.chat?.id;
    const text = message.text || "";

    if (chatId && text) {
      // Save message to Supabase
      await saveMessage(chatId, text);

      // Reply back to Telegram
      await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `You said: ${text}`,
        }),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
};