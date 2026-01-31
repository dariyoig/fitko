import { useState, useRef, useEffect } from 'react'
import './App.css'
import logo from './assets/logo.png'

interface Message {
  id: number
  text: string
  sender: 'bot' | 'user'
}

type AuthMode = 'none' | 'login' | 'register'

let messageIdCounter = 1

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [authMode, setAuthMode] = useState<AuthMode>('none')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: messageIdCounter++,
      text: "Welcome to Fitko! I'm your AI fitness coach. I'll help you create a personalized workout plan and can recommend a real personal trainer to support your journey. This app is currently under development—stay tuned for more features soon!",
      sender: 'bot'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [authError, setAuthError] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auth form state
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (!inputValue.trim() || !isLoggedIn || isSending) return

    setIsSending(true)
    const userMessage: Message = {
      id: messageIdCounter++,
      text: inputValue,
      sender: 'user'
    }

    setMessages([...messages, userMessage])
    setInputValue('')

    // Show typing indicator
    setTimeout(() => {
      setIsTyping(true)
      setIsSending(false)
    }, 300)

    // Mock bot response after typing
    setTimeout(() => {
      const botResponse: Message = {
        id: messageIdCounter++,
        text: "Thanks for your message! I'm still under development, but soon I'll be able to help you with personalized fitness plans.",
        sender: 'bot'
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleAuthSubmit = () => {
    setAuthError('')

    if (authMode === 'register') {
      if (!authForm.name || !authForm.email || !authForm.password || !authForm.confirmPassword) {
        setAuthError('Please fill in all fields.')
        return
      }
      if (!isValidEmail(authForm.email)) {
        setAuthError('Please enter a valid email address.')
        return
      }
      if (authForm.password !== authForm.confirmPassword) {
        setAuthError('Passwords do not match.')
        return
      }
      // Mock registration success
      setUserName(authForm.name)
      setIsLoggedIn(true)
      setAuthMode('none')
      
      // Show typing indicator then welcome message
      setIsTyping(true)
      setTimeout(() => {
        setMessages([...messages, {
          id: messageIdCounter++,
          text: `Welcome, ${authForm.name}! You're now registered and logged in. How can I help you today?`,
          sender: 'bot'
        }])
        setIsTyping(false)
      }, 1200)
    } else if (authMode === 'login') {
      if (!authForm.email || !authForm.password) {
        setAuthError('Please fill in all fields.')
        return
      }
      if (!isValidEmail(authForm.email)) {
        setAuthError('Please enter a valid email address.')
        return
      }
      // Mock login success
      setUserName(authForm.email.split('@')[0])
      setIsLoggedIn(true)
      setAuthMode('none')
      
      // Show typing indicator then welcome message
      setIsTyping(true)
      setTimeout(() => {
        setMessages([...messages, {
          id: messageIdCounter++,
          text: `Welcome back! How can I help you today?`,
          sender: 'bot'
        }])
        setIsTyping(false)
      }, 1200)
    }

    setAuthForm({ name: '', email: '', password: '', confirmPassword: '' })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName('')
    setAuthMode('none')
    setMessages([{
      id: messageIdCounter++,
      text: "Welcome to Fitko! I'm your AI fitness coach. I'll help you create a personalized workout plan and can recommend a real personal trainer to support your journey. This app is currently under development—stay tuned for more features soon!",
      sender: 'bot'
    }])
  }

  const startAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setAuthError('')
    const promptText = mode === 'login' 
      ? "Please enter your email and password to log in."
      : "Let's get you registered! Please provide your details below."
    
    // Show typing indicator then prompt
    setIsTyping(true)
    setTimeout(() => {
      setMessages([...messages, { id: messageIdCounter++, text: promptText, sender: 'bot' }])
      setIsTyping(false)
    }, 800)
  }

  const cancelAuth = () => {
    setAuthMode('none')
    setAuthError('')
    setAuthForm({ name: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-left">
            <img src={logo} alt="Fitko Logo" className="logo" />
            <h1>Fitko</h1>
          </div>
          {isLoggedIn && (
            <div className="header-right">
              <span className="user-name">{userName}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
            >
              {message.text}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          {!isLoggedIn && authMode === 'none' && (
            <div className="auth-buttons">
              <button className="auth-btn login-btn" onClick={() => startAuth('login')}>
                Login
              </button>
              <button className="auth-btn register-btn" onClick={() => startAuth('register')}>
                Register
              </button>
            </div>
          )}

          {!isLoggedIn && authMode !== 'none' && (
            <div className="auth-form">
              {authError && <div className="auth-error">{authError}</div>}
              
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="auth-input"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="auth-input"
              />
              {authMode === 'register' && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                  className="auth-input"
                />
              )}
              <div className="auth-form-buttons">
                <button className="auth-btn cancel-btn" onClick={cancelAuth}>
                  Cancel
                </button>
                <button className="auth-btn submit-btn" onClick={handleAuthSubmit}>
                  {authMode === 'login' ? 'Login' : 'Register'}
                </button>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="message-input-container">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="message-input"
                disabled={isSending}
              />
              <button 
                className="send-btn" 
                onClick={handleSendMessage}
                disabled={isSending || !inputValue.trim()}
              >
                {isSending ? (
                  <>
                    Send
                    <span className="spinner"></span>
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
