import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
const { Configuration, OpenAIApi } = require("openai");
function App() {
  const [input,setInput] =useState(null);
  const [choice,setChoice] = useState(null);
  const [discussion,setDiscussion] = useState([]);
  const [string,setString] = useState("");
  const [refetch,setRefetch] = useState("")
  let arr = [];
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
console.log(process.env.REACT_APP_OPENAI_API_KEY,"key")

const handleRegenerateResponse =() =>{
  const response =async()=> await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You: ${refetch}?`,
    temperature: 0.5,
    max_tokens: 1500,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
    stop: ["You:"],
  }).then(resp=>{
    const {choices}= {...resp.data};
    setChoice(choices[0].text);
    discussion.pop();
    discussion.push(choices[0].text);
    setDiscussion([...discussion])
  });
  console.log("response",response());
}

const handleSort =()=>{
  return
  let reversedArr= [...discussion];
  reversedArr=reversedArr.reverse();
  setDiscussion(reversedArr)
} 
const handleClick=()=>{
   setRefetch(input);
  let promptString=`${string}\n${input}`;
  console.log("prompt string",promptString)
  setString(promptString);
arr.push(input)// setDiscussion([...discussion,input])
  const response =async()=> await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You: ${input}?`,
    temperature: 0.5,
    max_tokens: 1500,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
    stop: ["You:"],
  }).then(resp=>{
    console.log(resp)
    const {choices}= {...resp.data};
    console.log(choices[0].text);
    setChoice(choices[0].text);
    arr.push(choices[0].text)
    setDiscussion([...discussion,...arr])
    console.log(discussion,"dusc")
  });
  console.log("response",response());
  const completion=async() => await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: input}],
  }).then(resp=>{
    const {choices}={...resp.data};
    setChoice(choices[0].message.content)
  });
 // completion();
 
}
const openai = new OpenAIApi(configuration);
useEffect(()=>{
  console.log("I changed")
})
  return (
    <div className="App" style={{width: "100%",padding:"10px","marginLeft":"20px","position":"absolute","top":"20px"}}>
        <div className='row container-fluid'  >
          <h2>A simple QA answering machine based on OpenAIApi</h2>
      <div className='col col-6'>
        <input type ="text" style={{width: "100%",padding:"10px","margin":"10px"}} placeholder="Ask your question here" onChange={(e)=>{
setInput(e.target.value)
    }}/>
      </div>
            <div className='col col-3'>
              <button style = {{"marginTop":"10px","height":"50px","width":"70%"}} onClick={handleClick}>
                Ask me
              </button>
              
              <button  style = {{"marginTop":"10px","height":"50px","width":"30%",border:"10px solid white"}}onClick={handleRegenerateResponse}>
               Refresh
              </button>
            </div>
           
        
      </div>
      <div className='row container-fluid' style={{width: "80%",padding:"10px","margin":"10px"}}>
        <h4>{choice}</h4>
      </div>
      <br/>
      <div className="row">
        <div className="col col-8"> <h2>Conversations</h2></div>
        
        <div className="col col-2"><button style={{width: "80%",padding:"10px","margin":"10px"}} onClick={handleSort}>Sort me</button></div>
      </div>
     
     <div className="row container-fluid">
     {
        <ol>
          {
          discussion && discussion.map((item,index)=>{
            return(
            <div className='row container-fluid'style={{padding:"10px",border:"1px dotted black"}}>
              <div className='col'>{index%2===0?"You: ":""}{item}</div>
          </div>)
          })}
        </ol>
      }
     </div>
    </div>
  );
}

export default App;
