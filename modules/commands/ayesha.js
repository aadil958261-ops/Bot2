const axios = require("axios");
const fs = require("fs");
const path = require("path");

const GROQ_API_KEY = "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";
const MODEL = "llama-3.3-70b-versatile";

const STATUS_FILE = path.join(__dirname, "cache", "ayesha_status.json");

const SYSTEM_PROMPT = `Tumhara naam Ayesha hai.
Tum cute naughty aur flirty girlfriend ki tarah baat karti ho.
Tumhara owner Attaullah Khuharo hai.
Tum chote 1-2 line ke jawab deti ho.
Hinglish me baat karti ho.`;


// STATUS FILE
function readStatus(){
 if(!fs.existsSync(STATUS_FILE)) fs.writeFileSync(STATUS_FILE,"{}");
 return JSON.parse(fs.readFileSync(STATUS_FILE));
}

function saveStatus(data){
 fs.writeFileSync(STATUS_FILE,JSON.stringify(data,null,2));
}

function isOn(threadID){
 const data = readStatus();
 return data[threadID] === true;
}


// AI REQUEST
async function askAI(prompt){

 const res = await axios.post(
 "https://api.groq.com/openai/v1/chat/completions",
 {
  model: MODEL,
  messages:[
   {role:"system",content:SYSTEM_PROMPT},
   {role:"user",content:prompt}
  ]
 },
 {
  headers:{
   Authorization:`Bearer ${GROQ_API_KEY}`,
   "Content-Type":"application/json"
  }
 });

 return res.data.choices[0].message.content;
}


module.exports = {

config:{
 name:"ayesha",
 version:"1.0.0",
 hasPermssion:0,
 credits:"Fix by Attaullah",
 description:"Auto Ayesha AI",
 commandCategory:"AI",
 usages:"ayesha on/off",
 cooldowns:5
},


// ON OFF
run:async function({api,event,args}){

 const {threadID,messageID} = event;
 const data = readStatus();

 if(args[0] === "on"){
  data[threadID] = true;
  saveStatus(data);
  return api.sendMessage("💋 Ayesha AI ON ho gayi",threadID,messageID);
 }

 if(args[0] === "off"){
  data[threadID] = false;
  saveStatus(data);
  return api.sendMessage("😶 Ayesha AI OFF ho gayi",threadID,messageID);
 }

},


// AUTO CHAT
handleEvent:async function({api,event}){

 const {threadID,senderID,body} = event;

 if(!body) return;
 if(!isOn(threadID)) return;

 const text = body.toLowerCase();

 if(!text.includes("bot")) return;

 try{

 const reply = await askAI(body);

 api.sendMessage(reply,threadID);

 }catch(e){

 console.log(e.message);

 }

}

};
