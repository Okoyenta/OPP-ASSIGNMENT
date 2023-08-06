# Student Grade Information System

This project implements a Student Grade Information System in Node.js for managing and displaying student grades in different subjects. It uses an Express web server and the fs module for file operations.

## Installation

1. Clone the repository to your local machine:


2. Navigate to the project directory:


3. Install the dependencies: npm install (make sure nodejs is installed in your system)


4. Run the server: npm run start
the server will run on http://localhost:3000
upload your input file on http://localhost:3000/doc from postman add file as key, you will get an output file after processing


## Usage

1. Upload the data file containing student information and scores.

2. Access the following routes in your browser or via a tool like Postman:

   - `POST /doc` : Upload and process the student data file. Generates class-wise output files and offers a download link for the combined output.

## Configuration

- The `app.js` file contains the Express app and routes.
- The `output.txt` file will be generated to store the combined output of all classes.





