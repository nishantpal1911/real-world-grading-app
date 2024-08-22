# Real-world class grading App

A real-world class grading application built with TypeORM.

The grading application is used to manage enrollment in online classes, tests (as in exams) for classes, and test results.

## Data model

The development of this project is driven by the database schema (also known as the data model).
The schema is first designed to represent the following concepts:

- **User**: this can be a student or a teacher, or both. The role of the user is determined through their association with a course.
- **Course**: represent a course that can have multiple students/teachers. Each user can be associated with multiple courses either as a student or as a teacher.
- **Test**: Each course can have many tests
- **TestResult**: Each Test can have many TestReusults that is associated with a student

## Tech Stack

- Backend:
  - PostgreSQL
  - Node.js
  - TypeORM
  - TypeScript
  - Jest

## How to use

Install npm dependencies:

```
npm install
```
