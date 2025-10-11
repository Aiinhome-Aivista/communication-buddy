import React from 'react'

function Loader({ show, text = 'Loading…' }) {
    return show ? (
        <div className="loading">{text}</div>
    ) : null;
}

export default Loader