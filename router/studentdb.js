import express from "express";
import { studentmodel, mentormodel } from "../db.utils/model.js";

const studentRouter = express.Router();

// GET all students
studentRouter.get("/", async (req, res) => {
  try {
    const students = await studentmodel.find();
    res.send(students);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST a new student
studentRouter.post("/", async (req, res) => {
  const { body } = req;
  try {
    const newStudent = new studentmodel({
      ...body,
      id: Date.now().toString(),
    });
    await newStudent.save();
    res.send({ msg: "New student saved successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

/* put */
studentRouter.put("/:studentId", async (req, res) => {
  const { body } = req;

  const { studentId } = req.params;

  try {
    const studentObj = {
      ...body,
      id: studentId,
    };
    await new studentmodel(studentObj).validate();
    await studentmodel.updateOne({ id: studentId }, { $set: studentObj });
    res.send({ msg: "Student updated successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Error sending student" });
  }
});

/* delete */
studentRouter.delete("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    await studentmodel.deleteOne({ id: studentId });
    res.send({ msg: "delete successfully" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

/* assign single student to mentor */
studentRouter.post("/assignsingle/:mentorId/:studentId", async (req, res) => {
  const { mentorId, studentId } = req.params;

  try {
    // Find the mentor
    const mentor = await mentormodel.findOne({ id: mentorId });

    if (!mentor) {
      return res.status(404).send({ msg: "Mentor not found" });
    }

    // Find the student
    const student = await studentmodel.findOne({ id: studentId });

    if (!student) {
      return res.status(404).send({ msg: "Student not found" });
    }

    // Check if the student already has a mentor
    if (student.mentorId) {
      return res.status(400).send({ msg: "Student already assigned to a mentor" });
    }

    // Assign the mentor to the student
    student.mentorId = mentorId;
    await student.save();

    // Add the student to the mentor's list of students
    mentor.students.push(studentId);
    await mentor.save();

    res.send({ msg: "Student assigned to mentor successfully" });
  } catch (err) {
    console.error("Error assigning student to mentor:", err.message);
    res.status(500).send({ msg: "Error assigning student to mentor: " + err.message });
  }
});


// Assign multiple students to a mentor
studentRouter.post("/assignmultiple/:mentorId", async (req, res) => {
  const { mentorId } = req.params;
  const { studentIds } = req.body;

  try {
    // Find the mentor
    const mentor = await mentormodel.findOne({ id: mentorId });

    if (!mentor) {
      return res.status(404).send({ msg: "Mentor not found" });
    }

    // Find the students already assigned to a mentor

const assignedStudents = await studentmodel.find({ id: { $in: studentIds }, mentorId: { $ne: '' } });


    if (assignedStudents.length > 0) {
      return res.status(400).send({ msg: "Some students are already assigned to a mentor" });
    }

    // Find the students not already assigned to a mentor
    const unassignedStudents = await studentmodel.find({ id: { $in: studentIds }, mentorId: { $exists: false } });

    // Assign the mentor to the unassigned students
    for (const student of unassignedStudents) {
      student.mentorId = mentorId;
      await student.save();
    }

    // Add the unassigned students to the mentor's list of students
    mentor.students.push(...unassignedStudents.map(student => student.id));
    await mentor.save();

    res.send({ msg: "Students assigned to mentor successfully" });
  } catch (err) {
    console.error("Error assigning students to mentor:", err.message);
    res.status(500).send({ msg: "Error assigning students to mentor: " + err.message });
  }
});


// Assign or change mentor for a particular student
studentRouter.put("/assignorchange/:studentId/:mentorId", async (req, res) => {
  const { studentId, mentorId } = req.params;

  try {
    const student = await studentmodel.findOne({ id: studentId });
    if (!student) {
      return res.status(404).send({ msg: "Student not found" });
    }

    const newMentor = await mentormodel.findOne({ id: mentorId });
    if (!newMentor) {
      return res.status(404).send({ msg: "New mentor not found" });
    }

    const prevMentorId = student.mentorId;

    // Update previous mentors if there was a previous mentor
    if (prevMentorId && prevMentorId !== mentorId) {
      if (!student.previousMentors.includes(prevMentorId)) {
        student.previousMentors.push(prevMentorId);
      }
    }

    // Assign the new mentor to the student
    student.mentorId = mentorId;
    await student.save();

    // Remove the student from the previous mentor's list of students
    if (prevMentorId) {
      const prevMentor = await mentormodel.findOne({ id: prevMentorId });
      if (prevMentor) {
        prevMentor.students = prevMentor.students.filter(id => id !== studentId);
        await prevMentor.save();
      }
    }

    // Add the student to the new mentor's list of students
    if (!newMentor.students.includes(studentId)) {
      newMentor.students.push(studentId);
      await newMentor.save();
    }

    res.send({ msg: "Mentor assigned to student successfully" });
  } catch (err) {
    console.error("Error assigning mentor:", err.message);
    res.status(500).send({ msg: "Error assigning mentor: " + err.message });
  }
});

// Show all students for a particular mentor
studentRouter.get("/studentsbymentor/:mentorId", async (req, res) => {
  const { mentorId } = req.params;

  try {
    const students = await studentmodel.find({ mentorId: mentorId });
    res.send(students);
  } catch (err) {
    console.error("Error retrieving students:", err.message);
    res.status(500).send({ msg: "Error retrieving students: " + err.message });
  }
});

// Show the previously assigned mentors for a particular student
studentRouter.get("/previousmentors/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await studentmodel.findOne({ id: studentId });
    if (!student) {
      return res.status(404).send({ msg: "Student not found" });
    }

    res.send({ previousMentors: student.previousMentors });
  } catch (err) {
    console.error("Error retrieving previous mentors:", err.message);
    res.status(500).send({ msg: "Error retrieving previous mentors: " + err.message });
  }
});

export default studentRouter;
