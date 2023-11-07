import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import harvest_logo from './copilot_gray.png'; // Import the image
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';

let allDatasets = [];
let sendIntroduction = true;
let task = "";
let context = "";
let name = "";
let datasets = "";
let chatLogPersistent = [];
export default function Copilot({ editorContent, idFromLanding }) {
    // editorContent is current user code 
    // datasets is new datasets which have been uploaded

    const [inputValue, setInputValue] = useState("");
    const [chatLog, setChatLog] = useState(chatLogPersistent);    

    const [isLoading, setIsLoading] = useState(false);

    const [logs, setLogs] = useState("")
    const [loading, setLoading] = useState(true)
    const [counter, setCounter] = useState(0);

    const [isLoadingInit, setIsLoadingInit] = useState(true);
    const conversationRef = React.useRef([{ role: "system", content: "" }]);

    const buildNewDatasetQuery = (datasets) => {
        let command = "";
        if(datasets != null && datasets != "") {
            let intro = "Here is a new dataset";
            let prompt = "When you receive it provide me with a summary of the dataset. Please be concise in your response."
            let newline = "\n";
            command = intro + newline + datasets + newline + prompt;
        } else {
            command = "Please summarize my task."
        }
        return command
    }

    // Fetch last log
    const fetchOne = async () => {
        try {
        const response = await axios.get(`http://localhost:4001/logs/one?id=${idFromLanding}`);
        console.log(response);
        task = response.data.task;
        name = response.data.name;
        datasets = response.data.datasets;
        let initInstruction = "";
        if(idFromLanding != null && idFromLanding > 0) {
        initInstruction =
             " \n The task I am trying to accomplish this session is: " +
             JSON.stringify(response.data.task) +
             "\n" + buildNewDatasetQuery(datasets);
        } else {
            initInstruction =
            "You are Bo, the Harvest AI help assistant. Your job is to help me, a data analyst, with my workflow. Please greet me and tell me your role. Please be concise."
        }
        console.log(initInstruction);
        conversationRef.current = [
            { role: "system", content: initInstruction },
        ];
        if (sendIntroduction) {
            sendMessage(conversationRef.current);
            sendIntroduction = false;
        }
        } catch (error) {
        console.error(`There was an error retrieving the last log: ${error}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            await fetchOne();
            setIsLoadingInit(false);
        } catch (error) {
            console.error('Error:', error);
        }
        };
        fetchData();
    }, []);
   

    const evaluateState = (currentCodeState) => {
        const prefix = "1) Here is my current code: " + "\n" + currentCodeState
        const iterim = "2) My original task was to + " + task + "\n" + ", 3) the datasets I am using are: " + "\n" + datasets + "\n";
        const instruct = "4) Please check if the code makes sense given the data and suggest any changes that would put me on the right track";
        const concise = "Please be concise."
        let query = prefix  + iterim + instruct + concise;
        return query
    }
    
    // for when the editor content changes
    useEffect(() => {
        if(counter >= 100) {
            setCounter(0);
            //const flag = "add to chat log";
            const q = evaluateState(editorContent);
            conversationRef.current.push({role: "user", content: q});
            const flag = 0;
            sendMessage(conversationRef.current, flag);
            return;
        }
        setCounter(counter + 1);
    }, [editorContent]);

    // Fetch all Logs
    const fetchLogs = async () => {
        // Send GET request to 'books/all' endpoint
        axios
        .get('http://localhost:4001/logs/all')
        .then(response => {
            // Update the books state
            setLogs(JSON.stringify(response.data.session_content))
            // Update loading state
            setLoading(false)
        })
        .catch(error => console.error(`There was an error retrieving the book list: ${error}`))
    }

    // Fetch all Logs
    const handleUpdate = (new_content) => {
        // Send GET request to 'books/one' endpoint
        axios
        .put('http://localhost:4001/logs/update', {
            id: idFromLanding,
            session_content: new_content, 
            task: task, 
            name: name,
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => console.error(`There was an error updating the logs: ${error}`))
    }

    // Create new log
    const handleLogCreate = (logToStore, task, name) => {
    // Send POST request to 'books/create' endpoint
    axios
      .post('http://localhost:4001/logs/create', {
        session_content: logToStore,
        name: name, 
        task: task,
      })
      .then(res => {
        console.log(res.data)

        // Fetch all books to refresh
        // the books on the bookshelf list
        fetchLogs()
      })
      .catch(error => console.error(`There was an error creating the log: ${error}`))
    }

    // Delete single entry
    const handleLogDelete = (idToDel) => {
    // Send POST request to 'books/create' endpoint
    axios
        .put('http://localhost:4001/logs/delete', {
        id: idToDel,
        })
        .then(res => {

        // Fetch all books to refresh
        // the books on the bookshelf list
        fetchLogs()
        })
        .catch(error => console.error(`There was an error creating the log: ${error}`))
    }

    // Reset log list (remove all logs)
    const handleLogDeleteAll = () => {
        // Send PUT request to 'books/reset' endpoint
        axios.put('http://localhost:4001/logs/deleteAll')
        .then(() => {
        // Fetch all books to refresh
        // the books on the bookshelf list
        fetchLogs()
        })
        .catch(error => console.error(`There was an error deleting the logs: ${error}`))
    }

    // DOES NOT USE LOGS RIGHT NOW
    const buildQuery = (userQuery) => {
        let intro = "I am going to ask you about my current dataset or about my code \n"
        let codeIntro = "Here is my current code if it is relevant: \n BEGIN CODE {" + editorContent + "} END CODE \n";
        let datasetIntro = "Here is my current datasets if it is relevant: \n BEGIN DATASETS {" + datasets + "} END DATASETS \n";
        let query = "Here is my question: " + userQuery;
        let conciseRequest = "\n Please be very concise in your response.";
        let message = intro + codeIntro + datasetIntro + query + conciseRequest;
        return message;
    }


    const handleSubmit = (event) => {
        event.preventDefault();

        const newChat = {type: "user", message: inputValue};
        setChatLog((prevChatLog) => [...prevChatLog, newChat]);
        chatLogPersistent = [...chatLogPersistent, newChat];
        const clearLogs = "clearlogs";
        const flag = 0 | (inputValue == clearLogs); //(inputValue == "clearlogs") always supress output
        const concatenatedString = conversationRef.current.reduce((acc, item) => {
            return acc + item.role + ': ' + item.content + ', ';
            }, '');
        conversationRef.current.push({role: "user", content: buildQuery(inputValue)});
        sendMessage(conversationRef.current, flag);

        // error handling to manually call LogsReset
        if(inputValue == clearLogs) {
            handleLogDeleteAll();
        }

        setInputValue("");

    };

    const sendMessage = (message, flag) => {
        console.log("MESSAGE = " + JSON.stringify(message));
        const url = "https://api.openai.com/v1/chat/completions";
        const apiKey = "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"; // Your OpenAI API key
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
                if(!flag) {
                    conversationRef.current.push({ role: "assistant", content: response.data.choices[0].message.content });
                    const r = "assistant";
                    const q = response.data.choices[0].message.content;
                    const newChat = {type: "bot", message: response.data.choices[0].message.content};
                    setChatLog((prevChatLog) => [
                        ...prevChatLog,
                        newChat,
                    ]);
                    chatLogPersistent = [...chatLogPersistent, newChat];
                }

                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
            const concatenatedString = conversationRef.current.reduce((acc, item) => {
                return acc + item.role + ': ' + item.content + ', ';
                }, '');
            console.log("Current conversation = " + concatenatedString);
            handleUpdate(concatenatedString);
    };



    if(isLoadingInit) {
        return (
            <div>Loading...</div>
        )
    }
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
                                                typeSpeed={200}
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
                            <input type="text" className="flex-grow px-4 py-2 focus:outline-none" style={{ backgroundColor: "white", color: "gray", borderRadius: "8px", paddingRight: "40px"}} placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
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
