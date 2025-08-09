import React from 'react'

function Loader({ show }) {
    return (
        <>
            {show && (<div className="loading">Loading&#8230;</div>)}

        </>
    )
}

export default Loader