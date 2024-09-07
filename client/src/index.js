import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

// get root element from the DOm
const rootElement = document.getElementById('root');

// Create the root using createRoot and render the App component
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>
);