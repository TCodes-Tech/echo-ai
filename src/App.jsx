import { useState, useRef } from "react";
import Orb from "./components/Orb";
import "./App.css";

function App() {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("Tap the orb and talk to me.");
  const [response, setResponse] = useState("");

  const recognitionRef = useRef(null);

  function speak(text) {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.onstart = () => setState("speaking");
    speech.onend = () => setState("idle");

    window.speechSynthesis.speak(speech);
  }

  function processCommand(command) {
    setState("thinking");
    setMessage(command);

    let answer;

    const calculation = command.match(
  /(-?\d+(?:\.\d+)?)\s*(plus|added to|\+|minus|-|times|multiplied by|\*|divided by|\/)\s*(-?\d+(?:\.\d+)?)/i
);

if (calculation) {
  const a = Number(calculation[1]);
  const operator = calculation[2].toLowerCase();
  const b = Number(calculation[3]);

  let result;

  if (["plus", "added to", "+"].includes(operator)) result = a + b;
  else if (["minus", "-"].includes(operator)) result = a - b;
  else if (["times", "multiplied by", "*"].includes(operator)) result = a * b;
  else if (["divided by", "/"].includes(operator)) {
    result = b === 0 ? "undefined because division by zero is not allowed" : a / b;
  }

  answer = `The answer is ${result}`;
}

    if (!answer && (command.includes("hello") || command.includes("hi"))) {
      answer = "Hey! Nice to hear from you.";
    } else if (!answer && command.includes("your name")) {
      answer = "I'm Echo, your personal voice assistant.";
    } else if (!answer &&command.includes("time")) {
      answer = `The time is ${new Date().toLocaleTimeString()}`;
    } else if (!answer &&command.includes("date")) {
      answer = `Today is ${new Date().toDateString()}`;
    } else if (!answer &&command.includes("how are you")) {
      answer = "I'm doing great. How can I help you?";
    } else if (!answer) {
        answer = "I don't know that command yet. We're still teaching me new things.";
    }

    setResponse(answer);
    speak(answer);
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage("Speech recognition isn't supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setState("listening");
      setMessage("I'm listening...");
      setResponse("");
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      processCommand(command);
    };

    recognition.onerror = () => {
      setState("idle");
      setMessage("Couldn't hear you. Try again.");
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  return (
    <main className="app">
      <header>
        <h2>echo<span>.</span></h2>
        <p>Your personal assistant</p>
      </header>

      <section className="assistant">
        <Orb state={state} onClick={startListening} />

        <h1>
          {state === "idle" && "Hey, I'm Echo."}
          {state === "listening" && "I'm listening."}
          {state === "thinking" && "Let me think..."}
          {state === "speaking" && "Here's what I found."}
        </h1>

        <p className="status">{message}</p>

        {response && <p className="response">{response}</p>}

        <p className="hint">Tap the glowing orb to speak</p>
      </section>

      <footer>Designed to make life easier.</footer>
    </main>
  );
}

export default App;