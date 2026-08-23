const TelegramBot = require('node-telegram-bot-api');

const token = '8815621172:AAEQ7CK0KlvWtC7y5Zvn67wl3apowBOpyqA';
const chatId = '8937628829';

const bot = new TelegramBot(token, { polling: true });

async function sendTelegramAlert(txDetails) {
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

bot.on('callback_query', async (query) => {
  const action = query.data;

  if (action === 'reject') {
    await bot.sendMessage(chatId, '🚫 Transaction rejected. The agent will NOT proceed.');
  } else if (action === 'allow') {
    await bot.sendMessage(chatId, '✅ You chose to allow this transaction anyway. Proceeding despite the risk.');
  }

  await bot.answerCallbackQuery(query.id);
});

module.exports = { sendTelegramAlert };