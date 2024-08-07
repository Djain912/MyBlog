import express from "express";
import router from "./router/auth.js";
import db from "./utils/db.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

import cors from "cors";
const app = express();
var corsOptions = {
    origin: 'http://localhost:5173',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  app.use(cors(corsOptions));
  app.use(bodyParser.json({ limit: '50mb' })); // Adjust '50mb' as per your requirement
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


app.use(express.json());
app.use("/", router);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

db().then(()=>{
    //listening
    app.listen(9000, () => {
        console.log(`DB Connected & Server is running on port ${9000}`);
    })
}).catch((err)=>{
    console.log(err);
})
