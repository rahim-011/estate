

export const sendResetPasswordEmail = async (toEmail: string, otpCode: string) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'Estate App',
        email: process.env.BREVO_SENDER_EMAIL!,
      },
      to: [{ email: toEmail }],
      subject: 'Your Password Reset OTP',
      htmlContent: `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>Password Reset Code</h2>
          <p>Use the following 6-digit code to reset your password:</p>
          <h1 style="letter-spacing: 5px; color: #2563eb; background: #f3f4f6; padding: 10px; display: inline-block; border-radius: 6px;">
            ${otpCode}
          </h1>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 5 minutes.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Brevo Error: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};