import mongoose from "mongoose";

// Define the Student Schema
const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  mentorId: {
    type: String, // Single string, not an array
    required: false,
  },
  previousMentors: {
    type: Array, // Array of strings to store previous mentors
    required: false,
    default: [],
  },
});

// Define the Student Model
const studentmodel = mongoose.model("student", studentSchema, "students");

// Define the mentor Schema
const mentorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  students: {
    type: [String], // Array of strings to store student IDs
    required: false,
    default: [],
  },
});

// Define the mentor Model
const mentormodel = mongoose.model("mentor", mentorSchema, "mentors");

const registerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Simple regex for email validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Admin", "Teacher", "Student"],
   
      required: true,
    },
  }
);



// Create the model
const Registermodel = mongoose.model("register", registerSchema, "registers");

// Export the models
export { studentmodel, mentormodel, Registermodel };
