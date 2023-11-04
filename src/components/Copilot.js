import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import harvest_logo from './copilot_logo_gray.png'; // Import the image
// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';

// const inter = Inter({ subsets: ['latin'] })

export default function Copilot({ editorContent }) {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const conversationRef = React.useRef([{ role: "system", content: "You are a helpful assistant." }]);

  useEffect(() => {
    // When the editor content changes, update the inputValue state
    setInputValue(editorContent);
    console.log(editorContent);
  }, [editorContent]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [...prevChatLog, { type: "user", message: inputValue }]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = (message) => {
    const url = "https://api.openai.com/v1/chat/completions";
    const apiKey = "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"; // Your OpenAI API key

    // Include user context using the ref
    conversationRef.current.push({ role: "user", content: message });

    const data = {
      model: "gpt-3.5-turbo-0301",
      messages: conversationRef.current, // Pass the entire conversation history here
    };

    setIsLoading(true);

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Add the bot's response to the conversation history using the ref
        conversationRef.current.push({ role: "assistant", content: response.data.choices[0].message.content });

        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: "bot", message: response.data.choices[0].message.content },
        ]);

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="container mx-auto max-w-[700px]">
        <div className="flex flex-col h-screen bg-gray-900" style={{ maxHeight: "85vh", backgroundColor: "#efefef" }}>
            <img
                src={harvest_logo}
                alt="Your Image Description"
                className="text-center py-3 font-bold text-2xl"
                style={{
                    width: '120px',
                    height: 'auto',
                    marginLeft: "15px"
                }}
            />
            <div className="flex-grow p-6">
                <div className="flex flex-col space-y-4">
                    {
                        chatLog.map((message, index) => (
                            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                }`}>
                                <div className={`${message.type === 'user' ? 'lighter-orange' : 'gray'} rounded-lg p-2 max-w-sm`}>
                                    {message.type === 'user' ? (
                                        message.message
                                    ) : (
                                        <TypeAnimation
                                            sequence={[
                                                message.message,
                                                () => {
                                                    console.log('Sequence completed');
                                                },
                                            ]}
                                            wrapper="span"
                                            cursor={false}
                                            style={{ fontSize: '1em', display: 'inline-block' }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    }
                    {
                        isLoading &&
                        <div key={chatLog.length} className="flex justify-start">
                            <div className="gray rounded-lg p-2 max-w-sm">
                                <TypeAnimation
                                    sequence={[
                                        '.', // Types 'One'
                                        100, // Waits 1s
                                        '..', // Deletes 'One' and types 'Two'
                                        200, // Waits 2s
                                        '...', // Types 'Three' without deleting 'Two'
                                        () => {
                                            console.log('Sequence completed');
                                        },
                                    ]}
                                    wrapper="span"
                                    cursor={true}
                                    repeat={5}
                                    style={{ fontSize: '1em', display: 'inline-block' }}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex-none p-6">
                <div style={{ position: 'relative' }}>
                    <div className="flex rounded-lg border border-white-700 bg-white-800">
                        <input type="text" className="flex-grow px-4 py-2 focus:outline-none" style={{ backgroundColor: "white", color: "gray", borderRadius: "8px" }} placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        <button
                            type="submit"
                            className="absolute right-0 top-0 bottom-0 m-auto rounded-lg px-4 py-2 font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                            style={{ background: 'transparent' }}
                            onMouseEnter={(e) => e.target.style.color = '#fd7013'}
                            onMouseLeave={(e) => e.target.style.color = 'black'}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
)
}
