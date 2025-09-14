export function createWelcomeEmailTemplate(name, clientURL) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Bolne</title>
  </head>
  <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a;">
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #1a1a1a 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0; position: relative; overflow: hidden;">
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 30% 20%, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(153, 27, 27, 0.2) 0%, transparent 50%);"></div>
      <div style="position: relative; z-index: 1;">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(45deg, #dc2626, #ef4444); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
            <circle cx="8" cy="9" r="1.5" fill="#dc2626"/>
            <circle cx="12" cy="9" r="1.5" fill="#dc2626"/>
            <circle cx="16" cy="9" r="1.5" fill="#dc2626"/>
          </svg>
        </div>
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Bolne</h1>
        <p style="color: rgba(255, 255, 255, 0.8); margin: 10px 0 0 0; font-size: 16px;">Where conversations come alive</p>
      </div>
    </div>
    
    <div style="background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%); padding: 40px 35px; border-radius: 0 0 16px 16px; border: 1px solid #262626; border-top: none;">
      <p style="font-size: 20px; color: #dc2626; margin: 0 0 20px 0; font-weight: 600;">Hello ${name},</p>
      <p style="color: #e5e5e5; font-size: 16px; margin-bottom: 25px;">You've just joined the future of messaging. Bolne brings you seamless, real-time conversations with cutting-edge features and a sleek interface designed for the modern communicator.</p>
      
      <div style="background: linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%); padding: 30px; border-radius: 12px; margin: 30px 0; border: 1px solid #333; position: relative;">
        <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(180deg, #dc2626, #991b1b); border-radius: 2px;"></div>
        <p style="font-size: 18px; margin: 0 0 20px 0; color: #ffffff; font-weight: 600;">Ready to get started?</p>
        <div style="display: grid; gap: 12px;">
          <div style="display: flex; align-items: center; color: #e5e5e5;">
            <span style="width: 8px; height: 8px; background: #dc2626; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></span>
            <span>Customize your profile and avatar</span>
          </div>
          <div style="display: flex; align-items: center; color: #e5e5e5;">
            <span style="width: 8px; height: 8px; background: #dc2626; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></span>
            <span>Connect with friends and colleagues</span>
          </div>
          <div style="display: flex; align-items: center; color: #e5e5e5;">
            <span style="width: 8px; height: 8px; background: #dc2626; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></span>
            <span>Create group chats and channels</span>
          </div>
          <div style="display: flex; align-items: center; color: #e5e5e5;">
            <span style="width: 8px; height: 8px; background: #dc2626; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></span>
            <span>Share media, files, and reactions</span>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${clientURL}" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3); transition: all 0.3s ease; border: 1px solid #ef4444;">Launch Bolne</a>
      </div>
      
      <div style="border-top: 1px solid #333; padding-top: 25px; margin-top: 30px;">
        <p style="margin-bottom: 8px; color: #e5e5e5;">Need assistance? Our support team is standing by 24/7.</p>
        <p style="margin-top: 0; color: #a3a3a3; font-size: 14px;">Experience the next generation of messaging.</p>
        
        <p style="margin-top: 30px; margin-bottom: 0; color: #e5e5e5; font-weight: 500;">Best regards,<br><span style="color: #dc2626;">The Bolne Team</span></p>
      </div>
    </div>
    
    <div style="text-align: center; padding: 25px 20px; color: #666; font-size: 12px; background-color: #0a0a0a;">
      <p style="margin: 0 0 15px 0;">© 2025 Bolne. All rights reserved.</p>
      <div style="margin-top: 15px;">
        <a href="#" style="color: #dc2626; text-decoration: none; margin: 0 15px; font-weight: 500;">Privacy Policy</a>
        <a href="#" style="color: #dc2626; text-decoration: none; margin: 0 15px; font-weight: 500;">Terms of Service</a>
        <a href="#" style="color: #dc2626; text-decoration: none; margin: 0 15px; font-weight: 500;">Support</a>
      </div>
    </div>
  </body>
  </html>
  `;
}