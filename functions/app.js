const express = require('express');
const fs = require('fs')
const multer = require('multer');
const serverless = require('serverless-http');


const upload = multer()
const app = express();
const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//read text file and calclate the number of words
router.post('/doc', upload.single('file'), async (req, res, next) => {
    try {
      var writeStream = fs.createWriteStream("output.txt");
    const k1 = req.file 
    if (!k1) {
        return res.status(400).send('No files were uploaded.');
    }
    const ks = k1.buffer.toString()
    const k2 = ks.split("\n")
    let people = { }
    const totalPeople = parseInt(k2.shift(), 10)
    //process each line of the file to get the name and the number, subject and score
    let currentPerson = null
    const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0 };

    k2.forEach((line, index) => {
        if (index % 2 === 0) {
            // Even index means a person's name
            const [lastName, firstName] = line.split(',');
            const fullName = `${firstName.trim()} ${lastName.trim()}`;
            currentPerson = fullName;
            people[fullName] = {};
          } else {
            // Odd index means scores and subject
            if (currentPerson) {
              const [subject, ...scores] = line.split(' ');
              people[currentPerson][subject] = scores.map(score => parseInt(score, 10));
            }
          }
    })

    // Step 5: Calculate and display the total score for each person by subject
  for (const person in people) {
    //console.log(`${person}:`);
    for (const subject in people[person]) {
      const scores = people[person][subject];

      let finalGrade = 0;
      let ExamGrade = 0;
      let grader = null

    // Function to calculate letter grade based on a 10-point scale
    const grade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    if (score >= 50) return 'E';
    if (score >= 40) return 'F';
    if (score >= 30) return 'G';
    if (score >= 20) return 'H';
    if (score >= 10) return 'I';
    return 'J';
  };


      switch (subject) {
        case 'English':
          // Calculate the total score for each part of the English subject
          const termPaperScore = scores[0];
          const midtermScore = scores[1];
          const finalExamScore = scores[2];

          // Apply weightings and calculate final grade
          finalGrade = termPaperScore * 0.25 + midtermScore * 0.35 + finalExamScore * 0.4;
          ExamGrade = finalExamScore
          grader = grade(finalGrade)
          gradeDistribution[grader]++;
          people[person][subject] = { ExamGrade, finalGrade: finalGrade.toFixed(2), letterGrade: grader };
          break;

        case 'History':
          // Calculate the total score for each part of the History subject
          const attendanceScore = scores[0];
          const projectScore = scores[1];
          const historyMidtermScore = scores[2];
          const historyFinalExamScore = scores[3];

          // Apply weightings and calculate final grade
          finalGrade = attendanceScore * 0.1 + projectScore * 0.3 + historyMidtermScore * 0.3 + historyFinalExamScore * 0.3;
          ExamGrade = historyFinalExamScore
          grader = grade(finalGrade)
          gradeDistribution[grader]++;
          people[person][subject] = { ExamGrade, finalGrade: finalGrade.toFixed(2), letterGrade: grader };
          break;

        case 'Math':
          // Calculate the total score for each part of the Math subject
          const quizAverage = scores.slice(0, 5).reduce((sum, score) => sum + score, 0) / 5;
          const test1Score = scores[5];
          const test2Score = scores[6];
          const mathFinalExamScore = scores[7];

          // Apply weightings and calculate final grade
          finalGrade = quizAverage * 0.15 + test1Score * 0.25 + test2Score * 0.25 + mathFinalExamScore * 0.35;
          ExamGrade = mathFinalExamScore
          grader = grade(finalGrade)
          gradeDistribution[grader]++;
          people[person][subject] = { ExamGrade, finalGrade: finalGrade.toFixed(2), letterGrade: grader };
          break;

        default:
          console.log(`Unknown subject: ${subject}`);
      }


      console.log(`${person} =>  ${subject}: Final Grade - ${finalGrade.toFixed(2)}, Exam Grade - ${ExamGrade}, Grade - ${grader}`);
      
      //const totalScore = scores.reduce((sum, score) => sum + score, 0);
      //console.log(`  ${subject}: Total Score - ${totalScore}`);
    }
  }

    console.log(people)  

    
    //output th english
    const header1 = "\nENGLISH CLASS\n\n" +
                            "Student                                   Final   Final   Letter\n" +
                            "Name                                      Exam    Avg     Grade\n"  +
                            "----------------------------------------------------------------\n"

    writeStream.write(header1);

        for (const person in people) {
            if (people[person].English) {
                const finalGrade = people[person].English.finalGrade;
                const examGrade = people[person].English.ExamGrade;
                const letterGrade = people[person].English.letterGrade;
                const studentLine1 = `${person.padEnd(42)} ${examGrade.toString().padEnd(8)} ${finalGrade.padEnd(8)} ${letterGrade}\n`;
                writeStream.write(studentLine1);
            }
        }

        //output the history
        const header2 = "\nHISTORY CLASS\n\n" +
                            "Student                                   Final   Final   Letter\n" +
                            "Name                                      Exam    Avg     Grade\n"  +
                            "----------------------------------------------------------------\n"

        writeStream.write(header2);

        for (const person in people) {
            if (people[person].History) {
                const finalGrade = people[person].History.finalGrade;
                const examGrade = people[person].History.ExamGrade;
                const letterGrade = people[person].History.letterGrade;
                const studentLine2 = `${person.padEnd(42)} ${examGrade.toString().padEnd(8)} ${finalGrade.padEnd(8)} ${letterGrade}\n`;
                writeStream.write(studentLine2)
            }
        }
                 
        //output the math
        const header3 = "\nMATH CLASS\n\n" +
                            "Student                                   Final   Final   Letter\n" +
                            "Name                                      Exam    Avg     Grade\n"  +
                            "----------------------------------------------------------------\n"

        writeStream.write(header3);

        for (const person in people) {
            if (people[person].Math) {
                const finalGrade = people[person].Math.finalGrade;
                const examGrade = people[person].Math.ExamGrade;
                const letterGrade = people[person].Math.letterGrade;
                const studentLine3 = `${person.padEnd(42)} ${examGrade.toString().padEnd(8)} ${finalGrade.padEnd(8)} ${letterGrade}\n`;
                writeStream.write(studentLine3);
            }
        }

        writeStream.write('\nOVERALL GRADE DISTRIBUTION:\n\n')
  for (const grade in gradeDistribution) {
    writeStream.write(`  ${grade}: ${gradeDistribution[grade]}\n`);
  }

        
        await new Promise((resolve, reject) => {
          writeStream.end();
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
        
        res.download('output.txt', (err) => {
            if (err) {
                console.error('Error sending the file:', err);
                res.status(500).send('Error sending the file.');
            }
        });

    } catch (err) {
        console.log(err);
    }
})

router.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/.netlify/functions/api', router);  // path must route to lambda

module.exports = app
module.exports.handler = serverless(app)
