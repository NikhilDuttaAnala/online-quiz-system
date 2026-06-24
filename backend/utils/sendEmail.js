export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_FROM },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Brevo error:', data);
      throw new Error(data.message || 'Email sending failed');
    }
    
    return data;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};