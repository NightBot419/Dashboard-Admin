import React, { useState } from 'react';
import admin from '../data/admin.json';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === admin.username && password === admin.pass) {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.branding}>
                    <h2 style={styles.title}>Drink Store Admin</h2>
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#eef2f6', // Softer light background
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '380px',
        padding: '45px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', // More pronounced shadow
        alignItems: 'center',
        transition: 'transform 0.3s ease-in-out',
    },
    branding: {
        marginBottom: '30px',
    },
    title: {
        color: '#2c3e50', // Darker, more professional title color
        fontSize: '28px',
        fontWeight: '600',
        margin: 0,
    },
    input: {
        width: '100%',
        padding: '14px 18px',
        marginBottom: '18px',
        border: '1px solid #dcdcdc', // Subtle border
        borderRadius: '7px',
        fontSize: '17px',
        color: '#34495e',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        outline: 'none',
    },
    button: {
        width: '100%',
        padding: '14px 18px',
        backgroundColor: '#3498db', // A vibrant blue
        color: 'white',
        border: 'none',
        borderRadius: '7px',
        fontSize: '19px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        marginTop: '10px',
    },
    error: {
        color: '#e74c3c',
        marginBottom: '20px',
        fontSize: '15px',
        fontWeight: '500',
    },
};

// Add hover effects dynamically if needed, or use a CSS file for more complex interactions
// For simplicity in this context, we'll keep it primarily inline.
// A real application would use a CSS file or styled components.

export default Login;



