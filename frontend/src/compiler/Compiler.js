import axios from 'axios';

const runCode = (code, input, languageChoice) => {
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      'content-type': 'application/json',
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': 'cc9ecfc0a7msh8fc6a5c02301927p16ee94jsn5b0944765841',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    data: {
      language_id: languageChoice,
      source_code: btoa(code),
      stdin: btoa(input)
    }
  };
  return axios.request(options);
}

export const CodeStatus = {
    Running: 1,
    Finished: 2,
    Error: 3,
  };

  export const languageCode = {
    "Cpp": 52,
    Javascript: 63,
    Python: 71,
  };

  export default runCode;