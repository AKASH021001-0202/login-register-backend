import express from "express";
import bcrypt from "bcrypt";
import { Registermodel } from "../../db.utils/model.js";
import { transport, mailOptions } from "../../mail.util.js";

const RegisterRouter = express.Router();

RegisterRouter.post("/", async (req, res) => {
  const registerUserData = req.body;

  try {
    const registerUserObj = await Registermodel.findOne({
      email: registerUserData.email,
    });

    if (registerUserObj) {
      return res.status(400).send({ msg: "User already registered" });
    } else {
      bcrypt.hash(registerUserData.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        } else {
          // Generate id
          const id = Date.now().toString();

          // Create new Registermodel instance
          const newRegister = await new Registermodel({
            ...registerUserData,
            password: hash,
            id: id,
          });
          await newRegister.save();
          await transport.sendMail({
            ...mailOptions,
            to: registerUserData.email,//to from mail options is overwritten
            subject:"welcome to your application"
            
          });
          res.status(201).send({ msg: "User registered successfully" });
        }
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default RegisterRouter;
