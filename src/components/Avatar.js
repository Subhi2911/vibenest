import React from 'react';

export default function Avatar({ name = "", size = 50, width = 11,
    height = 11, theme = "light" }) {
    // Get initials (e.g., "Subhi Chiku" => "SC")
    const initials = name
        .trim()
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();


    const background = theme === 'light' ? '#0B1D51' : '#F1E7E7';
    const color = theme === 'light' ? '#F1E7E7' : '#0B1D51';

    const avatarStyle = {
        width: `${width}rem`,
        height: `${height}rem`,
        borderRadius: '50%',
        backgroundColor: background,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: `${size}px`,
        cursor: 'pointer',
        userSelect: 'none',

    };


    return <div style={avatarStyle}>{initials}</div>;
}
