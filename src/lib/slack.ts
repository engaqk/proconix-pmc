

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

  const emoji = priority === 'high' ? '🔥' : priority === 'medium' ? '💬' : '📩';

  const blocks: any[] = [
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
          text: `*Country/Location:*\n${country || 'N/A'}`
        },
        {
          type: "mrkdwn",
          text: `*Sector/Budget:*\n${sector || 'N/A'}`
        }
      ] as any
    });
  }

  if (details) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Additional Context:*\n${details}`
      }
    });
  }

  blocks.push({
    type: "divider"
  });

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Slack Webhook Failed:', response.status, errorText);
    }
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}

