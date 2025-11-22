import React, { useState } from 'react'

function SignInSignUp() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState('')
  // --- added state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // BACKEND BASE URL (change if different)
  const API = 'http://localhost:8000' // ← your FastAPI base

  // --- sign in handler
  async function handleSignIn(e) {
    e.preventDefault()

    // OAuth2PasswordRequestForm expects application/x-www-form-urlencoded
    const body = new URLSearchParams({
      username: email,
      password: password
    })

    try {
      const res = await fetch(`${API}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // token received
        const token = data.access_token
        // store token for later requests (localStorage used for demo; secure storage recommended)
        localStorage.setItem('access_token', token)

        // show success alert
        alert('Sign in successful ✅')
      } else {
        // show error message from backend if present
        alert(data.detail || 'Invalid credentials ❌')
      }
    } catch (err) {
      console.error(err)
      alert('Network error — cannot reach server')
    }
  }

  // --- sign up handler (create user)
  async function handleSignUp(e) {
    e.preventDefault()

    const payload = {
      name:fullName,
      email: email,
      password: password,
    }

    try {
      const res = await fetch(`${API}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // backend returned created user (or success)
        alert('User created ✅')
        setIsSignUp(false) // switch to sign-in flow if you like
      } else {
        // show backend error (e.g., duplicate)
        alert(data.detail || 'Could not create user')
      }
    } catch (err) {
      console.error(err)
      alert('Network error — cannot reach server')
    }
  }

  // --- protected route example (call when needed)
  async function callProtectedRoute() {
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('No token, please sign in')
      return
    }
    try {
      const res = await fetch(`${API}/login`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        alert(`Protected call OK — welcome ${data.user_info || ''}`)
      } else {
        alert(data.detail || 'Protected route denied (401)')
      }
    } catch (err) {
      console.error(err)
      alert('Network error on protected call')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-8 
    relative">
      <div className='absolute top-0 left-0 w-full h-full '>
        <div className='absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow'></div>
        <div className='absolute bottom-[20%] right-[10%] w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow animation-delay-2000'></div>
        <div className='absolute top-[45%] left-[50%] -translate-x-1/2 w-84 h-84 rounded-full bg-radial from-yellow-400/40 to-transparent blur-3xl animate-pulse-slow animation-delay-3000'></div>
      </div>
      <div className='@container max-w-md w-full p-8 bg-blue-950/30 rounded-2xl shadow-[0_20px_50px_rgba(0,29,61,0.7)] backdrop-blur-xl border border-blue-800/50 relative overflow-hidden animate-fade-in'>


        <div className='absolute inset-0 bg-gradient-to-br from-blue-800/20 to-transparent rounded-2xl pointer-events-none'></div>


        <div className='relative z-10'>
          <h2 className='text-3xl font-extrabold text-yellow-300 text-center mb-2 tracking-tight'>
             {isSignUp ?'Create Account':'Welcome Back'}
          </h2>
          <p className='text-blue-200 text-center mb-8'>
            {isSignUp ? 'Join our community today':'Sign in to continue your journey'}
          </p>

          <form className='mt-8 space-y-5 perspective-1000' onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            {isSignUp && (<div className='group'>
              <input
                type="text"
                placeholder='Full Name'
                value={fullName}
                onChange={(e)=>setFullName(e.target.value)}
                className='w-full p-4 bg-blue-900/30 rounded-xl border border-blue-700/50 text-white placeholder-blue-300/50 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all'
              />
            </div>)}
            
            <div className='group'>
              <input
                type="email"
                placeholder='Email Address'
                className='w-full p-4 bg-blue-900/30 rounded-xl border border-blue-700/50 text-white placeholder-blue-300/50 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all' value={email} onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <div className='group'>
              <input
                type="password"
                placeholder='Password'
                className='w-full p-4 bg-blue-900/30 rounded-xl border border-blue-700/50 text-white placeholder-blue-300/50 outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all' value={password} onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <button className='group w-full p-4 mt-6 bg-gradient-to-r from-yellow-500 to-yellow-400 text-blue-950 rounded-xl font-bold shadow-lg hover:shadow-yellow-400/40 overflow-hidden transform transform-style-3d hover:-translate-y-.5 hover:scale-105 hover:translate-z-20 transition-all duration-300 relative'>
              <span className='relative z-10 pointer-events-none '>{isSignUp ? "Create Account":"Sign In"}</span>
              <span className="absolute inset-0 bg-linear-to-r from-yellow-500 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></span>
            </button>
          </form>
          <p className='mt-8 text-blue-200/80 text-center'>
            {isSignUp ? 'Already have an account?':"Don't have an account?"}
            <span className='text-yellow-300 font-bold cursor-pointer hover:text-yellow-400 ml-1 transition-colors ' onClick={()=>setIsSignUp(!isSignUp)}>{isSignUp ? "Sign In":"Sign Up"}</span>
          </p>
          <div className='mt-8 pt-6 border-t border-blue-800/30 '>
            <p className='text-blue-200/70 text-center text-sm mb-4 '>Or continue with </p>
            <div className='flex justify-center space-x-6 '>
              <button className='p-3 bg-blue-900/40 rounded-lg hover:bg-blue-800/50 transition-colors text-yellow-400 hover:text-yellow-300 '>
                <i className='bx bxl-google text-2xl'></i>
              </button>
              <button className='p-3 bg-blue-900/40 rounded-lg hover:bg-blue-800/50 transition-colors text-yellow-400 hover:text-yellow-300 '>
                <i className='bx bxl-apple text-2xl'></i>
              </button>
              <button className='p-3 bg-blue-900/40 rounded-lg hover:bg-blue-800/50 transition-colors text-yellow-400 hover:text-yellow-300 '>
                <i className='bx bxl-facebook text-2xl'></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SignInSignUp
