
export async function sendSlackNotification(data: {
  type: string;
  name: string;
  email: string;
  country?: string;
  sector?: string;
  details?: string;
  priority?: 'high' | 'medium' | 'low';
}) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL is not defined. Skipping Slack notification.');
    return;
  }

  const { type, name, email, country, sector, details, priority = 'low' } = data;

  const colorMap = {
    high: '#ff9400',   // Orange for Discovery/Audit
    medium: '#25D366', // WhatsApp Green
    low: '#C9A84C'     // Proconix Gold for Checklist
  };

  const currentColor = colorMap[priority];
  const emoji = priority === 'high' ? '🔥' : priority === 'medium' ? '💬' : '📩';

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} New Lead: ${type}`,
        emoji: true
      }
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Name:*\n${name}`
        },
        {
          type: "mrkdwn",
          text: `*Email:*\n${email}`
        }
      ]
    }
  ];

  if (country || sector) {
    blocks.push({
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Country:*\n${country || 'N/A'}`
        },
        {
          type: "mrkdwn",
          text: `*Sector:*\n${sector || 'N/A'}`
        }
      ] as any
    });
  }

  if (details) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Additional Details:*\n${details}`
      }
    } as any);
  }

  blocks.push({
    type: "divider"
  });

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks })
    });
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}
