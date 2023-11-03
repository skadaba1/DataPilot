import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from '@/styles/Home.module.css'
import axios from 'axios';
// import TypingAnimation from "../components/TypingAnimation";

// const inter = Inter({ subsets: ['latin'] })

export default function Copilot() {
    const [inputValue, setInputValue] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }])

        sendMessage(inputValue);

        setInputValue('');
    }

    const sendMessage = (message) => {
        const url = '/api/chat';

        const data = {
            model: "gpt-3.5-turbo-0301",
            messages: [{ "role": "user", "content": message }]
        };

        setIsLoading(true);

        axios.post(url, data).then((response) => {
            console.log(response);
            setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.choices[0].message.content }])
            setIsLoading(false);
        }).catch((error) => {
            setIsLoading(false);
            console.log(error);
        })
    }

    return (
        <div className="container mx-auto max-w-[700px]">
            <div className="flex flex-col h-screen bg-gray-900" style={{ maxHeight: "85vh", backgroundColor: "#efefef" }}>
                <h2 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-2xl">Harvest Copilot</h2>
                <img src="../../public/harvest_logo.png" alt="Your Image Description" className="text-center py-3 font-bold text-2xl" />
                <div className="flex-grow p-6">
                    <div className="flex flex-col space-y-4">
                        {
                            chatLog.map((message, index) => (
                                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                    }`}>
                                    <div className={`${message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'
                                        } rounded-lg p-4 text-white max-w-sm`}>
                                        {message.message}
                                    </div>
                                </div>
                            ))
                        }
                        {
                            isLoading &&
                            <div key={chatLog.length} className="flex justify-start">
                                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                                    {/* <TypingAnimation /> */}
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