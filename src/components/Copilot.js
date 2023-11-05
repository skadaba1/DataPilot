import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import harvest_logo from './copilot_gray.png'; // Import the image
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';

let currentCodeState = "";
let sendIntroduction = true;
export default function Copilot({ editorContent }) {

    // editorContent is current user code 

    const [inputValue, setInputValue] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    const conversationRef = React.useRef([{ role: "system", content: "You are the Harvest AI help assistant whose job is to help me, a data anlayst, with my workflow. Please greet me and tell me your role. Please be concise." }]);
    
    useEffect(() => {
        // When the editor content changes, update the inputValue state
        currentCodeState = editorContent;
        // add conditions here based on parsing code content to make suggestions
        if (sendIntroduction) {
            sendMessage(conversationRef.current);
            sendIntroduction = false;
        }
    }, [editorContent]);

    // Fetch all books on initial render
    useEffect(() => {
        fetchLogs()
    }, [])

    // Fetch all Logs
    const fetchLogs = async () => {
        // Send GET request to 'books/all' endpoint
        axios
        .get('http://localhost:4001/logs/all')
        .then(response => {
            // Update the books state
            setLogs(response.data)
            console.log(response.data)
            // Update loading state
            setLoading(false)
        })
        .catch(error => console.error(`There was an error retrieving the book list: ${error}`))
    }

    // Create new log
    const handleLogCreate = (rl, me) => {
    // Send POST request to 'books/create' endpoint
    axios
      .post('http://localhost:4001/logs/create', {
        role: rl,
        message: me,
      })
      .then(res => {
        console.log(res.data)

        // Fetch all books to refresh
        // the books on the bookshelf list
        fetchLogs()
      })
      .catch(error => console.error(`There was an error creating the log: ${error}`))
    }

    // Reset log list (remove all books)
    const handleLogReset = () => {
        // Send PUT request to 'books/reset' endpoint
        axios.put('http://localhost:4001/logs/reset')
        .then(() => {
        // Fetch all books to refresh
        // the books on the bookshelf list
        fetchLogs()
        })
        .catch(error => console.error(`There was an error resetting the logs: ${error}`))
    }

    const buildQuery = (userQuery) => {
        let codeIntro = "Here is my current code: ";
        let newline = "\n";
        let conciseRequest = "Please be concise in your response.";
        let message = codeIntro + newline + currentCodeState + newline + userQuery + newline + conciseRequest;
        return message;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setChatLog((prevChatLog) => [...prevChatLog, { type: "user", message: inputValue }]);

        //const flag = "add to chat log";
        const r = "user";
        const q = buildQuery(inputValue);
        conversationRef.current.push({role: r, content: q});
        sendMessage(conversationRef.current);
        setInputValue("");

        const clearLogs = "clearlogs"
        if(inputValue == clearLogs) {
            console.log("TEST PASSED")
            handleLogReset(r, q);
        } else {
            handleLogCreate(r, q);
        }

        
    };

    const sendMessage = (message) => {
        const url = "https://api.openai.com/v1/chat/completions";
        const apiKey = "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"; // Your OpenAI API key

        // Include user context using the ref
        // const preface = "Here is my current code: ";
        // const newline = "\n";
        // const postfix = "Please be concise in your reponse.";
        // let final = preface + newline + currentCodeState + newline + message + newline + postfix;
        //conversationRef.current.push({ role: "user", content: final });
        const data = {
            model: "gpt-3.5-turbo-0301",
            messages: message // Pass the entire conversation history here
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
                const r = "assistant";
                const q = response.data.choices[0].message.content;
                handleLogCreate(r, q);
                //if (flag == "add to chat log") {
                setChatLog((prevChatLog) => [
                    ...prevChatLog,
                    { type: "bot", message: response.data.choices[0].message.content },
                ]);
                //}

                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    };

    return (
        <div className="container mx-auto max-w-[700px]">
            <div className="flex flex-col h-screen bg-gray-900" style={{ maxHeight: "85vh", backgroundColor: "#e9e9e9" }}>
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
                <div className="flex-grow p-6" style={{ overflowY: "auto" }}>
                    <div className="flex flex-col space-y-4">
                        {
                            chatLog.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    style={{ fontFamily: "'Cerebri Sans', sans-serif", wordWrap: 'break-word' }}
                                >
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
