import { parentPort } from 'worker_threads';
import nodemailer from 'nodemailer';
import Subscriber from '../models/Subscribemodel.js'; // Adjust the path as necessary
import dotenv from 'dotenv';
dotenv.config();

parentPort.on('message', async (data) => {
  const { title, subtitle, url } = data;
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const subscribers = await Subscriber.find({ subscribed: true });

    for (let subscriber of subscribers) {
      let mailOptions = {
        from: '"Your Blog" <your-email@example.com>',
        to: subscriber.email,
        subject: 'New Blog Post Published!',
        text: `A new blog post has been published.\n\nTitle: ${title}\nSubtitle: ${subtitle}\nRead more at: ${url}`,
        html: `<p>A new blog post has been published.</p><h3>${title}</h3><h4>${subtitle}</h4><p>Read more at: <a href="${url}">${url}</a></p>`,
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error('Error sending email notifications:', error);
  }
});
