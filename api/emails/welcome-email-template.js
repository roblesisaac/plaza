import config from '../config/environment';
import base64Logo from './logoBase64';

export default function welcomeEmailTemplate(newUser) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${config.FRIENDLY_NAME}</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
              background-color: #3498db;
              color: white;
              padding: 20px;
              text-align: center;
          }
          .logo {
              width: 100%;
              max-width: 200px;
              height: auto;
              margin-bottom: 20px;
          }
          .content {
              padding: 20px;
          }
          h1, h2 {
              color: #2C3E50;
              margin-top: 0;
          }
          .verification-code {
              background: #f9f9f9;
              border-radius: 4px;
              padding: 15px;
              margin-bottom: 20px;
              font-size: 24px;
              text-align: center;
              letter-spacing: 5px;
              font-weight: bold;
          }
          .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #3498db;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 10px;
          }
          .footer {
              background-color: #34495e;
              color: white;
              text-align: center;
              padding: 20px;
              font-size: 0.9em;
          }
          @media only screen and (max-width: 600px) {
              .container {
                  width: 100%;
                  margin: 0;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <img src="${base64Logo()}" alt="${config.FRIENDLY_NAME} Logo" class="logo">
              <h1>Welcome to ${config.FRIENDLY_NAME}!</h1>
          </div>
          
          <div class="content">
              <h2>Thank you for joining us</h2>
              <p>To get started, please verify your email address using the code below:</p>
              
              <div class="verification-code">
                  ${newUser.email_verified}
              </div>
              
              <p>Enter this code on our website to complete your registration and unlock all the features of your new account.</p>
              
              <a href="${config.URL}/login" class="button">Verify Email</a>
              
              <p>If you didn't create an account with us, please ignore this email or contact our support team.</p>
          </div>
          
          <div class="footer">
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p>We look forward to seeing you on ${config.FRIENDLY_NAME}!</p>
          </div>
      </div>
  </body>
  </html>
  `;
}