import React, { useState, useRef, useEffect } from 'react'
import Card from '../components/Card';
import data from './data'
import "./SessionsPage.css"

function SessionsPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')

    const card = data.map(item => {
        return <Card image={item.img} name={item.name} des={item.des} but={item.but} />
    })

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleLogin = () => {
        console.log(name);
        console.log(desc);
        closePopup();
        window.location.href = '/';
    }

    return (
        <>
            <h1 className="heading"> My Sessions </h1>
            <div className='header_underline'></div>
            <div className='wrapper'>
                <div className='card'>
                    <img src="https://pngimg.com/d/plus_PNG96.png" />
                    <h3> new session </h3>
                    <p> Supported Environments: ipynb, py, csv </p>
                    <button onClick={openPopup} className="btn">
                        create session
                    </button>
                </div>
                {card}
            </div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <div className='x' onClick={closePopup}> x </div>
                        <h2>CREATE NEW SESSION</h2>
                        <div className='header_underline'></div>
                        <form onSubmit={handleLogin}>
                            <select id="dropdown">
                                <option value="" disabled selected>Development Environment</option>
                                <option value="option1">Notebook</option>
                                <option value="option2">Code File</option>
                                <option value="option3">Spreadsheet</option>
                            </select>
                            <label>
                                <input type="text" placeholder="Session Name" onChange={e => setName(e.target.value)} />
                            </label>
                            <label>
                                {/* <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ height: '40px' }} /> */}
                                <textarea placeholder="What are you working on?" rows="4" type="text" onChange={e => setDesc(e.target.value)}></textarea>
                            </label>
                            <button type="submit">Create Session</button>
                        </form>
                        <button onClick={handleLogin}>Close</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default SessionsPage
