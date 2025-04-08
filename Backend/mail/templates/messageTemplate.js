const messageTemplate = (senderName, subject, message, email, userName, link) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>New Message Notification</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0a0a0a;
          color: #eaeaea;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
  
        .container {
          max-width: 640px;
          margin: 40px auto;
          padding: 40px 30px;
          background: linear-gradient(145deg, #131313, #1b1b1b);
          border-radius: 18px;
          box-shadow: 0 0 30px rgba(0, 246, 255, 0.15);
          border: 1px solid #262626;
        }
  
        .logo {
          width: 150px;
          margin: 0 auto 20px;
          display: block;
        }
  
        .heading {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          color: #00f6ff;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }
  
        .subheading {
          text-align: center;
          font-size: 16px;
          color: #bbbbbb;
          margin-bottom: 30px;
        }
  
        .link-highlight {
          color: #00f6ff;
          text-decoration: none;
          font-weight: bold;
          transition: color 0.3s ease;
        }
  
        .link-highlight:hover {
          color: #66fcff;
        }
  
        .greeting {
          font-size: 18px;
          color: #cccccc;
          margin-bottom: 25px;
          text-align: center;
        }
  
        .message-box {
          background-color: rgb(50, 50, 50);
          border-left: 5px solid #00f6ff;
          padding: 25px 30px;
          border-radius: 12px;
          margin-top: 10px;
          box-shadow: inset 0 0 10px rgba(0, 246, 255, 0.1);
        }
  
        .label {
          font-weight: 600;
          color: #aaaaaa;
          margin-top: 15px;
          font-size: 15px;
        }
  
        .value {
          font-size: 17px;
          margin: 5px 0 10px;
          color: #ffffff;
          word-break: break-word;
        }
  
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 13px;
          color: #888;
          border-top: 1px solid #333;
          padding-top: 20px;
        }
  
        .footer a {
          color: #00f6ff;
          text-decoration: none;
        }
  
        .footer a:hover {
          text-decoration: underline;
        }
  
        @media (max-width: 600px) {
          .container {
            padding: 25px 20px;
          }
  
          .message-box {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="https://i.ibb.co/CQTxH1c/portfolio-dark-logo.png" alt="Portfolio Generator Logo" />
        <div class="heading">📬 New Message Received!</div>
        <div class="subheading">From <a class="link-highlight" href="${link}" target="_blank">${link}</a></div>
        <div class="greeting">Hey ${userName}, you just received a new message on your portfolio 🎉</div>
  
        <div class="message-box">
          <div class="label">👤 Sender Name:</div>
          <div class="value">${senderName}</div>
  
          <div class="label">📧 Email:</div>
          <div class="value">${email}</div>
  
          <div class="label">📝 Subject:</div>
          <div class="value">${subject}</div>
  
          <div class="label">💬 Message:</div>
          <div class="value">${message}</div>
        </div>
  
        <div class="footer">
          Need help? Contact us at
          <a href="mailto:support@myportfoliogenerator.com">support@myportfoliogenerator.com</a>
        </div>
      </div>
    </body>
    </html>`;
  };
  
  module.exports = messageTemplate;
  