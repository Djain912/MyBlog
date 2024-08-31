import express from "express";

const router = express.Router();
import {contact,post,getposts,getrecentposts,getidpost,subscribe,getcontacts,delcontact,
    getPosts,getPostById,updatePost,deletePost,totalcontacts,totalpost
} from "../controllers/authcontroller.js";

import login from "../controllers/logincontroller.js";


router.route("/contact").post(contact);
router.route("/createpost").post(post);
router.route("/getposts").get(getposts);
router.route("/getposts/:id").get(getidpost);
router.route("/subscribe").post(subscribe);
router.route("/getcontacts").get(getcontacts);
router.route("/delcontact/:id").delete(delcontact);

router.get('/getposts', getPosts);
router.get('/getposts/:id', getPostById);
router.put('/updatepost/:id', updatePost);
router.delete('/delpost/:id', deletePost);
router.route("/getrecentposts").get(getrecentposts);
// router.route("/sendemail").post(email);

router.route("/totalposts").get(totalpost);
router.route("/totalcontacts").get(totalcontacts);

router.route("/login").post(login);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  


export default router;
