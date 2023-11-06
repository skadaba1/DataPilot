import React from 'react'
import { Link } from 'react-router-dom'

function Card(props) {
    return (
        <div className='card'>
            <img src={props.image} />
            <h3>{props.name}</h3>
            <p>{props.des}</p>
            <a href={`/${props.session_id}`} className='btn'> {props.but} </a>
            {/* <Link to={`/${props.id}`}> {props.but} </Link> */}
        </div>
    )
}

export default Card
