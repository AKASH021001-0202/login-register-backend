import express from "express";
import bcrypt from "bcrypt";
import { Registermodel } from "../../db.utils/model.js";
import jwt from "jsonwebtoken";

const LoginRouter = express.Router();

LoginRouter.post("/", async (req, res) => {
  const LoginData = req.body;

  try {
    const registerUserObj = await Registermodel.findOne({
      email: LoginData.email,
    });

    if (registerUserObj) {
      bcrypt.compare(
        LoginData.password,
        registerUserObj.password,
        async (err, result) => {
          if (err) {
            return res.status(500).send({ message: "Something went wrong" });
          } else if (result) {
            const user = await Registermodel.findOne(
              { email: LoginData.email },
              { _id: 0, __v: 0, updatedAt: 0, password: 0 }
            );

            var token = jwt.sign({ user }, process.env.JWT_SECRET);

            return res
              .status(200)
              .send({ msg: "Login successful", code: 0, token });
            console.log(token);
          } else {
            return res
              .status(401)
              .send({ msg: "Invalid credentials", code: 1 });
          }
        }
      );
    } else {
      return res.status(401).send({ msg: "Invalid credentials", code: 1 });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

LoginRouter.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
export default LoginRouter;
