import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import ExampleDBPedia from './components/chatbot/ExampleDBPedia.jsx'
import ChatBot from 'react-simple-chatbot';

createRoot(document.getElementById('root')).render(
  <div>
    <Toaster position="top-center"/>
   
    <App />
    </div>
)
