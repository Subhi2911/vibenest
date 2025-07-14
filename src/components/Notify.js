import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Notify = () => {
    const token = localStorage.getItem('token');
    const navigate=useNavigate();
    useEffect(()=>{
        if (!token || token === null || token === undefined){
            return navigate('/login')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <div>

        </div>
    )
}

export default Notify
