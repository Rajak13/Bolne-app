import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAllContacts } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/contacts", protectRoute, getAllContacts);
// router.get("/chats", getChatPartneers);
// router.get("/:id", getMessagesByUserId)

// router.get('/send/:id', sendMessage )

router.get('/receive', (res,req) =>{
    res.send("Receive Message Endpoint")
})

export default router;