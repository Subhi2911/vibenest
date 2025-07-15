import React from 'react'

const Spinner = () => {
    return (
        <div style={{marginTop:'5rem'}}>
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner
