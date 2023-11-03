document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.querySelector(".drop-area");
    const fileInput = document.getElementById("file-input");
    const queryInput = document.getElementById("query-input");
    const parseButton = document.getElementById("parseButton");
    const resultDiv = document.getElementById("result");
    const displayRows = 5; // Set the number of rows to display
    const apiKey = 'NULL'; // Replace with your OpenAI API key
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

    // Prevent the default behavior when files are dropped
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("drag-over");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("drag-over");
    });

    // Handle the file drop
    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("drag-over");
        const file = e.dataTransfer.files[0];
        fileInput.files = e.dataTransfer.files;

        if (file) {
            parseButton.disabled = false; // Enable the "Parse CSV" button after file selection
        }
    });

    // Handle file selection using the file input
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];

        if (file) {
            parseButton.disabled = false; // Enable the "Parse CSV" button after file selection
        }
    });

    parseButton.addEventListener("click", () => {
        const file = fileInput.files[0];
        const userQuery = queryInput.value;

        if (file) {
            parseCSV(file)
                .then(parsedData => {
                    if (apiKey !== 'NULL') {
                        queryChatGPT(parsedData, userQuery, apiKey, apiUrl)
                            .then(response => {
                                // Display the ChatGPT response
                                resultDiv.innerHTML = response;
                            })
                            .catch(error => {
                                resultDiv.innerHTML = `OpenAI API Error: ${error.message}`;
                            });
                    } else {
                        resultDiv.innerHTML = "API key is not configured. Please set a valid API key.";
                    }
                    // Display the parsed data
                    displayParsedData(parsedData);
                })
                .catch(error => {
                    resultDiv.innerHTML = error.message;
                });
        }
    });

    function parseCSV(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    if (results.data && results.data.length > 0) {
                        resolve(results.data);
                    } else {
                        reject(new Error("No data found in the CSV file."));
                    }
                },
                error: function (error) {
                    reject(new Error("Error parsing the CSV file. Please check the file format."));
                },
            });
        });
    }

    function queryChatGPT(parsedData, userQuery, apiKey, apiUrl) {
        return new Promise((resolve, reject) => {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: userQuery,
                        },
                        {
                            role: 'system',
                            content: 'You are a data analyst. Analyze the following data:',
                        },
                        {
                            role: 'assistant',
                            content: JSON.stringify(parsedData),
                        },
                    ],
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    return response.json();
                })
                .then(result => {
                    resolve(result.choices[0].message.content);
                })
                .catch(error => {
                    reject(new Error(`OpenAI API Error: ${error.message}`));
                });
        });
    }

    function displayParsedData(parsedData) {
        // Create a table to display the parsed data
        const table = document.createElement("table");
        table.className = "parsed-data-table";

        // Create table header
        const headerRow = table.insertRow(0);
        for (const key in parsedData[0]) {
            const headerCell = headerRow.insertCell();
            headerCell.textContent = key;
        }

        // Create table rows
        for (let i = 0; i < Math.min(displayRows, parsedData.length); i++) {
            const row = table.insertRow();
            for (const key in parsedData[i]) {
                const cell = row.insertCell();
                cell.textContent = parsedData[i][key];
            }
        }

        // Clear any previous data
        resultDiv.innerHTML = "";

        // Append the table to the resultDiv
        resultDiv.appendChild(table);
    }
});
