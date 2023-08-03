const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Sets the passkey
const passKey = process.env.PASS_KEY;

// Set the sender's email address
const senderEmail = process.env.SENDER_EMAIL;

// Set the recipient's email address
const recipientEmail = process.env.RECIPIENT_EMAIL;

// Set the email's subject line
const subjectLine = process.env.SUBJECT_LINE;

// Email Service
emailService = process.env.EMAIL_SERVICE;

const app = express();
const port = 3000; // Change this to your desired port number

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  console.log(req.body);
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, device, problem } = req.body;
  console.log(req.body);

  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use your email service provider here
    host: emailService,
    port: 465,
    secure: true,
    auth: {
      user: senderEmail, // Replace with your email address
      pass: passKey, // Replace with your email password
    },
  });

  // Setup email data
  const mailOptions = {
    from: senderEmail, // Sender email address (must be the same as the authenticated user)
    to: recipientEmail, // Receiver email address (your website owner's email)
    subject: subjectLine,
    text: `Name: ${name}\nEmail: ${email}\nDevice: ${device}\nProblem: ${problem}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.send('Request submitted successfully!');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
