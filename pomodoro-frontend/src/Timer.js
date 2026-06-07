import React, {useState, useEffect, useRef} from "react";
import alarmSound from "./sounds/alarm.mp3";
import tickingSound from "./sounds/ticking_sound.wav";
import usePomodoro from "./hooks/usePomodoro.js";
import Clock from "./components/Clock.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";


const Timer = () => {
    const timeRef = useRef(null);
    const [settingsMenu, setSettingsMenu] = useState(false);
    const [focusMenu, setFocusMenu] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loginError, setLoginError] = useState(false);

    const {
        session,
        secondsLeft,
        setSecondsLeft,
        sessionCount,
        sessionDuration,
        sessionType,
        setSessionDuration,
        startSession,
        pauseSession,
        resumeSession,
        cancelSession,
        enableNotifications
    } = usePomodoro();

    const handleLogin = async (email, password) => {
        try {
            const res = await fetch('http://localhost:8080/api/pomodoro/mock/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            if(res.ok) {
                const body = await res.json();
                localStorage.setItem("userToken", body.token);
                setShowLogin(false);
                setLoginError(false);
            }
            else {
                setShowLogin(true);
                setLoginError(true);
            }
        }
        catch {
                setShowLogin(true);
                setLoginError(true);
                console.log("Login failed");
        }
    }

    return( 
        <div className= {`flex flex-col min-h-screen transition-colors duration-1000 text-gray-200 font-mono ${
                sessionType(sessionCount) === "FOCUS" && session && session.state === "ACTIVE" ? "bg-[#120713]" :
                sessionType(sessionCount) === "BREAK" && session && session.state === "ACTIVE" ? "bg-[#030f13]" :
                sessionType(sessionCount) === "LONG_BREAK" && session && session.state === "ACTIVE" ?"bg-[#040F1D]":
                "bg-gray-950"
        }`}>
            <Navbar
                session = {session} 
                secondsLeft = {secondsLeft}
                setSecondsLeft = {setSecondsLeft}
                sessionCount = {sessionCount}
                sessionDuration = {sessionDuration}
                sessionType = {sessionType}
                setSessionDuration = {setSessionDuration}
                timeRef = {timeRef}
                settingsMenu = {settingsMenu}
                setSettingsMenu = {setSettingsMenu}
                focusMenu = {focusMenu}
                setFocusMenu = {setFocusMenu}
                showLogin = {showLogin}
                setShowLogin = {setShowLogin}
            />
            <Clock
                session = {session}
                secondsLeft = {secondsLeft}
                setSecondsLeft = {setSecondsLeft}
                sessionCount = {sessionCount}
                sessionDuration = {sessionDuration}
                sessionType = {sessionType}
                setSessionDuration = {setSessionDuration}
                startSession = {startSession}
                pauseSession = {pauseSession}
                resumeSession = {resumeSession}
                cancelSession = {cancelSession}
                enableNotifications = {enableNotifications}
            />
            {showLogin && (
                <Login
                    email = {email}
                    password = {password}
                    showLogin = {showLogin}
                    loginError = {loginError}
                    setEmail = {setEmail}
                    setPassword = {setPassword}
                    setShowLogin = {setShowLogin}
                    setLoginError = {setLoginError}
                />
            )}
        </div>
    )
}
export default Timer;