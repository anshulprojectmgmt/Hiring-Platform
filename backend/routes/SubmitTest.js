const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();
const Candidate = require('../models/Candidates');

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_KEY,
});

const makeAPICall = async (object) => {
  try {

    const prompt = `For the given Python code, identify the bug, classify the bug as major or minor logical bug and give a score out of 10.

    Major Logical Bug: Major Logical bug includes using the wrong algorithm, incorrect data handling, code that does not give the right answer for any input and mishandling of conditional statements. If it does not work only for any particular test case, then that is not a major logical bug.
    Minor Logical Bug: Examples include code that does not handle edge cases, code that gives the right answer for most of the inputs but fails for only some particular input cases.
    
    Grade the severity of the bug as following:
    1. Major Logical bug - 7
    2. Minor Logical bug - 3
    
    Calculate the score using the formula: (10 - severity)
    
    If there are multiple bugs or the code does not provide a solution to the problem at all then give a score of 0.
    
    Q: Check if a given number is prime or not.
    
    Python Code:
    def is_prime(n):
        if n < 2:
            return True
        for i in range(2, n):
            if n % i == 0:
                return True
        return False
    
    A: This is an incorrect algorithm for the question and does not work for any input. The correct approach should return 'False' for numbers less than 2 and return 'True' only if no factors other than 1 and 'n' itself are found in the loop. Since it is a Major Logical Bug the severity is 7. Final Score is (10 - 7) = 3. Score = 3.
    
    Q: Given an array of integers and a target integer, return indices of the two numbers such that they add up to the target.
    
    Python Code:
    def two_sum(nums, target):
        num_indices = {}
        for index, num in enumerate(nums):
            complement = target - num
            if complement in num_indices:
                return [num_indices[complement], index]
            else:
                num_indices[num] = index
    
    A: There is a logical bug in the code. The program does not handle the case when no pair of indices is found that adds up equal to the target It should return None in that case. It fails only on edge cases so it is a Minor Logical bug the severity of the bug is 3. Therefore the final score is (10 - 3) = 7. Score : 7
    
    Q: Write a function to find the longest common prefix string amongst an array of strings.If no common prefix exists then return "None"
    
    Python Code:
    def main(strs):
        size=len(strs)
        if size==0:
            return None
        if size==1:
            return strs[0]
        strs.short()
        end=min(len(a)[0]),len(a[size-1])
        i=0
        while(i< end and a[0][i]==a[size-1[i]]):
            i+=1
        pr=a[0][0:i]
        return pre
        print("Hello World")
        
    input_str["flower","flour","flourish"]
    print(main(input_str))
    
    A: There are multiple bugs in the code. The function strs.short() is incorrect. It should be strs.sort() to sort the list of strings. The input_str variable should be assigned using the assignment operator '='. There are many more errors so the severity is 10. Therefore the final score is (10 - 10) = 0. Score : 0

    Q: Write a function to find the longest common prefix string amongst an array of strings.If no common prefix exists then return “None

    Python Code:
    def main():
        print("Hello World")
    
    main()

    A: The code does not provide a solution to the problem at all. Therefore, the score is 0.
    
    Q: ${object.question}
    
    Python Code:
${object.code}
    
    Score:`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.4,
    max_tokens: 300,
    frequency_penalty: 0.0,
    });
    const string = chatCompletion.choices[0].message.content;
    // console.log(string);
    const regex = /(\d+)(?:\.)?$/;
    // const regex = /(\d+)(?=\D*$)/;
    const match = regex.exec(string);
    // console.log('inside match', match)
    if (match && match[1]) {
      const score = match[1];
      object.score = score;
    } else {
      object.score = 0;
      console.log('evluation error');
    }
    
    return object;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

router.post("/submit-test", async (req, res) => {
  try {
    const Data = req.body.testData;
    const candidateEmail = req.body.candidateEmail;
    const testCode = req.body.testCode;
    const timetaken = req.body.timetaken;
    const tabswitch = req.body.tabswitch;
    const cam2 = req.body.cam2;
    // console.log('test data===' , Data, "  cam=",  cam2);
    if(cam2 === 2) {
      const candidateCam2 = await Candidate.updateOne({email: candidateEmail, testcode: testCode},{
        $set: {
          cam2: cam2,
          cam2Time:req.body.cam2Time 
        },
      });
      if (candidateCam2.acknowledged) {
        res.status(200).json({success:true, message: 'Cam2 submitted successfully'});
      } else {
        res.status(400).json({success:false, message: 'Cam2 not submitted'});
      }
    } else {

      const testData = Data.slice(1);
     
      const filteredTestData = await testData.filter(item => item.score === -1);
      // console.log(filteredTestData);
      const updatedTestData = await Promise.all(filteredTestData.map(makeAPICall));
      const combinedData = testData.map(originalItem => {
        const updatedItem = updatedTestData.find(updatedItem => updatedItem.queNumber === originalItem.queNumber);
        if (updatedItem) {
          return {
            ...originalItem,
            score: updatedItem.score,
          };
        } else {
          return originalItem;
        }
      });
      const candidate = await Candidate.updateOne({email: candidateEmail, testcode: testCode},{
        $set: {
          result: combinedData,
          timetaken: timetaken,
          tabswitch: tabswitch,
        },
      });

      console.log('candidate update==' , candidate);

      if (candidate.acknowledged) {
        res.status(200).json({success:true, message: 'Test submitted successfully'});
      } else {
        res.status(400).json({success:false, message: 'Test not submitted'});
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

router.post("/submit-mcqtest", async (req, res) => {
  const candidateEmail = req.body.candidateEmail;
  const data = req.body.testData;
    const testCode = req.body.testCode;
    const timetaken = req.body.timetaken;
    const tabswitch = req.body.tabswitch;
    console.log('test data===' , data);
    const testData = data.slice(1);
    console.log('test data after slice===' , testData, );
  try {
    const candidate = await Candidate.updateOne({email: candidateEmail, testcode: testCode},{
      $set: {               
        result: testData,
        timetaken: timetaken,
        tabswitch: tabswitch,
      },
    });
    console.log('candidate update==' , candidate);
    if (candidate.acknowledged) {
      res.status(200).json({success:true, message: 'Test submitted successfully'});
    } else {
      res.status(400).json({success:false, message: 'Test not submitted'});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
})

module.exports = router;
