import React from 'react'

const Alert = (props) => {
    const capitalize = (word) => {
        if (word === 'danger') {
            return "Error"
        }
        else {
            const lower = word.toLowerCase();
            return lower.charAt(0).toUpperCase() + lower.slice(1)
        }

    }

    return (
        <div className="px-3 px-md-5" style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            zIndex: '1055', // higher than navbar
            pointerEvents: 'none'
        }}>
            {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show alert-top`} role="alert">
                <strong>{capitalize(props.alert.type)} :  </strong>{props.alert.msg}
            </div>}
        </div>
    )
}

export default Alert
