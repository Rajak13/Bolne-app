import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req,res) => {
    const {fullName, email, password} = req.body

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: "Please fill in all the fields "}); 
        }
        if(password.length < 6 ){
            return res.status(400).json({message: "Password should be at least 6 characters"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({emai})
        if(user) return res.status(400).json({message: "User with email" + email + "already exists"})

        const salt = await bcyrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User ({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        }else{
            res.status(400).json({message: "Invalid details"})
        }
    } catch (error) {
        console.log("Error in signup controller: ",error);
        res.status(500).json({message: "Internal error occured"})
    }
};

export const login = async (req,res) => {
    res.send("Login Endpoint")
};