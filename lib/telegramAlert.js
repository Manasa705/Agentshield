const TelegramBot = require('node-telegram-bot-api');

// Bot credentials are loaded from environment variables — never hardcode
// tokens in source. Set these in .env.local (see .env.example) and in
// your deployment platform's environment variable settings.
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token) {
  console.warn(
    '[telegramAlert] TELEGRAM_BOT_TOKEN is not set — Telegram alerts are disabled.'
  );
}

const bot = token ? new TelegramBot(token, { polling: true }) : null;

async function sendTelegramAlert(txDetails) {
  if (!bot || !chatId) {
    console.warn('[telegramAlert] Skipping alert — bot not configured.');
    return;
  }

  const message = `🚨 *CRITICAL THREAT BLOCKED*

*Action:* ${txDetails.action}
*Target:* ${txDetails.target}
*Risk Score:* ${txDetails.riskScore}/100
*At Risk:* $${txDetails.amountAtRisk} USDC

${txDetails.explanation}`;

  await bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🚫 Reject', callback_data: 'reject' },
          { text: '✅ Allow Anyway', callback_data: 'allow' }
        ]
      ]
    }
  });
}

if (bot) {
  bot.on('callback_query', async (query) => {
    const action = query.data;

    if (action === 'reject') {
      await bot.sendMessage(chatId, '🚫 Transaction rejected. The agent will NOT proceed.');
    } else if (action === 'allow') {
      await bot.sendMessage(chatId, '✅ You chose to allow this transaction anyway. Proceeding despite the risk.');
    }

    await bot.answerCallbackQuery(query.id);
  });
}

module.exports = { sendTelegramAlert };
