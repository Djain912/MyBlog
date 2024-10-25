import express from 'express';
import router from './router/auth.js';
import db from './utils/db.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['https://codeitupblogs.netlify.app','http://localhost:5173'] ,// Update this to your frontend URL after deployment
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/', router);

const PORT = process.env.PORT || 3007;

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB Connected & Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Exit the process with failure
  });
