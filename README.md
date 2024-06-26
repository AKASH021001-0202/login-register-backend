# Assign Mentor

This project provides APIs to assign mentors to students and manage mentor-student relationships.

## Getting Started

To get started with the project, follow these steps:



1. Clone the repository:


git clone https://github.com/AKASH021001-0202/assign-mentor.git


2. Install dependencies:

cd assign-mentor
npm install

markdown
Copy code

3. Start the server:

npm start

The server will start running on port 8000 by default. You can change the port by modifying the `PORT` environment variable.

# Assign Mentor API

This API provides endpoints to manage mentor-student relationships, including assigning mentors to students, updating mentor assignments, and retrieving information about students and mentors.

## Endpoints

- **GET /students**: Retrieve a list of all students.
- **POST /students**: Add a new student.
- **PUT /students/:studentId**: Update information about a student.
- **DELETE /students/:studentId**: Delete a student.
- **POST /students/assignsingle/:mentorId/:studentId**: Assign a single student to a mentor.
- **POST /students/assignmultiple/:mentorId**: Assign multiple students to a mentor.
- **PUT /students/assignorchange/:studentId/:mentorId**: Assign or change the mentor for a particular student.
- **GET /students/studentsbymentor/:mentorId**: Retrieve a list of students assigned to a particular mentor.
- **GET /students/previousmentors/:studentId**: Retrieve the previously assigned mentors for a particular student.

