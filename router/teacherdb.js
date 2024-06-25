import express from "express";
import  {  mentormodel } from "../db.utils/model.js";

const mentorRouter = express.Router();

mentorRouter.get("/", async (req, res) => {
  try {
    const teacher = await mentormodel.find();
    res.send(teacher);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

mentorRouter.post("/", async (req, res) => {
  const { body } = req;
  try {
    const Newteacher = await new mentormodel({
      ...body,
      id: Date.now().toString(),
    });
    await Newteacher.save();
    res.send({ msg: "Newteacher saved successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

mentorRouter.put("/:teacherId", async (req, res) => {
  const { body } = req;
  const { teacherId } = req.params;
  try {
    const teacherObj = {
      ...body,
      id: String(teacherId),
    };
    await new mentormodel(teacherObj).validate();
    await mentormodel.updateOne(
      { id:teacherId },
      { $set:(teacherObj) }
    );
    res.send({ msg: "updateTeacher successfully" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
mentorRouter.delete("/:teacherId", async (req, res) => {
 const {teacherId} = req.params;
  try {
   
    await mentormodel.deleteOne(
      { id:teacherId }
    );
    res.send({ msg: "delete successfully" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});
export default mentorRouter;
