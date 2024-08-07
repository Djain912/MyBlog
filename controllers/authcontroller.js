import Contact from '../models/contactmodel.js';
import Post from '../models/postmodel.js';
import Subscriber from "../models/Subscribemodel.js";
import validator from 'validator';

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const contact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Check if all fields are provided
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone (assuming it should be a 10-digit number)
    if (!validator.isMobilePhone(phone, 'en-IN') || phone.length !== 10) {
      return res.status(400).json({ message: 'Phone number should be a valid 10-digit number' });
    }

    // Check for minimum message length
    if (message.length < 5) {
      return res.status(400).json({ message: 'Message should be at least 10 characters long' });
    }

    // Create new contact entry
    const newContact = await Contact.create({ name, email, phone, message });
    return res.status(200).json({ message: 'Contacted Successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
///////////////////////////////////////////////////////////////
const sendEmailNotifications = async (title, subtitle, url) => {
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
};

const post = async (req, res) => {
  try {
    const { title, subtitle, description, category, image } = req.body;

    if (!title || !subtitle || !description || !category || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newPost = await Post.create({ title, subtitle, description, category, image });

    // Construct the blog URL
    const blogUrl = `http://localhost:5173/post/${newPost._id}`;

    // Send email notifications asynchronously
    setImmediate(() => {
      sendEmailNotifications(newPost.title, newPost.subtitle, blogUrl);
    });

    return res.status(200).json({ message: 'Posted Successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


// const post = async (req, res) => {
//   try {
//     const { title, subtitle, description, category, image } = req.body;

//     if (!title || !subtitle || !description || !category || !image) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const newPost = await Post.create({ title, subtitle, description, category, image });
//     return res.status(200).json({ message: 'Posted Successfully' });
//   } catch (err) {
//     return res.status(400).json({ message: err.message });
//   }
// };

const getposts = async (req, res) => {
  const { year, month, day, category, searchQuery } = req.query;

  let filter = {};

  if (year) {
    filter.createdAt = {
      ...filter.createdAt,
      $gte: new Date(`${year}-01-01`),
      $lt: new Date(`${parseInt(year) + 1}-01-01`),
    };
  }

  if (month) {
    filter.createdAt = {
      ...filter.createdAt,
      $gte: new Date(`${year}-${month.padStart(2, '0')}-01`),
      $lt: new Date(`${year}-${(parseInt(month) + 1).toString().padStart(2, '0')}-01`),
    };
  }

  if (day) {
    filter.createdAt = {
      ...filter.createdAt,
      $gte: new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`),
      $lt: new Date(`${year}-${month.padStart(2, '0')}-${(parseInt(day) + 1).toString().padStart(2, '0')}`),
    };
  }

  if (category) {
    filter.category = category;
  }

  if (searchQuery) {
    filter.$or = [
      { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on title
      { subtitle: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on subtitle
    ];
  }

  try {
    const posts = await Post.find(filter).sort({ createdAt: -1 }).exec();
    res.json(posts);
  } catch (err) {
    res.status(500).send(err);
  }
};


const getidpost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email is already subscribed' });
    }
    const subscriber = await Subscriber.create({ email, subscribed: true });
    return res.status(200).json({ message: 'Subscribed Successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getcontacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
}

const delcontact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (contact) {
      res.json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
}

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getrecentposts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(3); // Fetch the most recent 10 posts
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
}

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, category, image } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, { title, subtitle, description, category, image }, { new: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const totalpost = async (req, res) => {
  try {
    const total = await Post.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const totalcontacts = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export { contact, post, getposts,getrecentposts, getidpost,subscribe,getcontacts,delcontact,getPosts, getPostById, updatePost, deletePost,
  totalpost,totalcontacts
 };
