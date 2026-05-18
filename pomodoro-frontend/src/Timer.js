import React, {useState, useEffect, useRef} from "react";
import alarmSound from "./sounds/alarm.mp3";
import tickingSound from "./sounds/ticking_sound.wav";


const Timer = () => {
    const [session, setSession] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(null);
    const [sessionCount, setSessionCount] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [focusMenu, setFocusMenu] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(1500);
    const [showLogin, setShowLogin] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const timeRef = useRef(null);
    const [permission, setPermission] = useState(null);
    const ticking = useRef(null);
    const [loginError, setLoginError] = useState(false);

    const handleMouseEnter = () => {
        if(timeRef.current)
            clearTimeout(timeRef.current);
        setSettingsOpen(true);
    }

    const handleMouseLeave = () => {
        timeRef.current = setTimeout(() => {
            setSettingsOpen(false);
            setFocusMenu(false);
        }, 70);
    }

    const sessionType = (count) => {
        if(count % 6 === 0)
            return sessionValues[3];
        else if(count % 2 === 0)
            return sessionValues[2];
        else
            return sessionValues[1];
    }

    const calcSessionDuration = (type) => {
        if(type === "FOCUS")
            return sessionDuration;
        else if(type === "BREAK")
            return sessionDuration * 0.2;
        else
            return sessionDuration * 0.6;
    };

    const sessionValues = {
        1: "FOCUS",
        2: "BREAK",
        3: "LONG_BREAK"
    };

    const triggerNotification = (type) => {
        const alarm = new Audio(alarmSound);
        
        alarm.addEventListener('error', e => {
            console.error("Audio error details:", alarm.error);
        })

        alarm.play().catch(err => console.log("audio playback failed:", err));
        if(permission === "granted") {
            const notification = new Notification("Pomodoro", {
                body: `Your ${type} session is over!`,
                tag: "pomodoro-notification"
            });
            
            notification.onclick = () => {
                window.focus();
                alarm.pause();
                notification.close();
            };
        }

    }

    const triggerTicking = (inp) => {
        if(!ticking.current) {
            ticking.current = new Audio(tickingSound);
            ticking.current.loop = true;
            ticking.current.addEventListener('error', () => {
                console.error("Audio error details", ticking.current.error);
            });
        }

        if(inp === "play")
            ticking.current.play().catch(e => console.log("Playback Blocked", e));
        else if(inp === "pause")
            ticking.current.pause();
        else
            console.log("Invalid audio trigger");
    }

    async function enableNotifications() {
        const newPerm = await Notification.requestPermission();
        setPermission(newPerm);
    }

    //For every re-render this useEffect will run.
    useEffect(() => {
        fetch('http://localhost:8080/api/pomodoro/current')
        .then(res => res.ok? res.json(): null)
        .then(data => {
            if(data) {
                setSession(data);
                let timeElapsed;
                if(data.state === "ACTIVE")
                    timeElapsed = Math.floor(
                        (new Date() - new Date(data.startTime) - data.totalPauseDuration) / 1000);
                else if(data.state === "PAUSED")
                    timeElapsed = Math.floor((new Date(data.pauseTime) - new Date(data.startTime))/1000);
                else if(data.state === "COMPLETED")
                    timeElapsed = 0;
                   
                let nextTime;
                if(data.state !== "COMPLETED" && data.state !== "CANCELLED")
                    nextTime = data.sessionTime;
                else
                    nextTime = calcSessionDuration(sessionType(data.streak + 1));

                setSecondsLeft(nextTime - timeElapsed);
                setSessionCount(data.state === "COMPLETED"? data.streak + 1: data.streak);

                if(data.state === "CANCELLED") {
                    setSessionCount(1);
                    setSecondsLeft(calcSessionDuration(sessionType(1)));
                    setSession(null);
                }
            }
        })
        .catch(() => {
            setSessionCount(1);
        });
    },[]);

    useEffect(() => {
        let type;
        if(sessionCount % 2 ===0 && sessionCount % 6 !== 0) {
            type = sessionValues[2];
        }
        else if(sessionCount % 6 === 0)
            type = sessionValues[3];
        else if(sessionCount % 2 === 1)
            type = sessionValues[1];
        setSecondsLeft(calcSessionDuration(type));
    }, [sessionCount])

    //Sets the session from the first instance
    useEffect(() => {
        if(session && session.state === "ACTIVE") {
            const interval = setInterval(() => {
                const elapsed = Math.floor(
                        (new Date() - new Date(session.startTime) - session.totalPauseDuration) / 1000);
                setSecondsLeft(session.sessionTime - elapsed);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [session]);

    useEffect(() => {
        if(secondsLeft <= 0 && session && session.state === "ACTIVE") {
            if(session.type === "FOCUS")
                triggerTicking("pause");
            fetch('http://localhost:8080/api/pomodoro/complete', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(data => {
                setSession(data);
                setSessionCount(data.streak + 1);
                setSecondsLeft(calcSessionDuration(sessionType(data.streak + 1)));
                triggerNotification(sessionType(data.streak));
            })
            .catch(err => console.log("No active session"));
        }
    },[secondsLeft, session])

    const startSession = (type, sessionTime, streak) => {
        if(type === "FOCUS")
            triggerTicking("play");
        fetch('http://localhost:8080/api/pomodoro/start', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body:  JSON.stringify({
                "type": type,
                "sessionTime": sessionTime,
                "streak": streak
            }),
        })
        .then(res => res.json())
        .then(data => {
            setSession(data);
            const timeElapsed =  Math.floor((new Date() - new Date(data.startTime) )/ 1000);
            setSecondsLeft(data.sessionTime -  timeElapsed);
        })
        .catch(err => console.error(err));
    };

    const cancelSession = () => {
        if(session.type === "FOCUS")
            triggerTicking("pause");
        fetch('http://localhost:8080/api/pomodoro/cancel', {
            method: 'POST'
        })
        .then((res) => res.json())
        .then((data) => {
            setSession(null);
            setSessionCount(1);
            setSecondsLeft(calcSessionDuration("FOCUS"));
        })
        .catch(err => console.log("No active session"));
    }

    const pauseSession = () => {
        if(session.type === "FOCUS")
            triggerTicking("pause");
        fetch('http://localhost:8080/api/pomodoro/pause', {
            method: 'POST'
        })
        .then(res => res.json())
        .then((data) => {
            setSession(data);
        } )
        .catch(err => console.log(err));
    }

    const resumeSession = () => {
        if(session.type === "FOCUS") {
            triggerTicking("play");
        }
        fetch('http://localhost:8080/api/pomodoro/resume', {
            method: 'POST'
        })
        .then(res => res.json())
        .then((data) => {
            setSession(data);
        } )
        .catch(err => console.log(err));
    }

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

        }
    }


    return( 
        <div className= {`flex flex-col min-h-screen transition-colors duration-1000 text-gray-200 font-mono ${
                sessionType(sessionCount) === "FOCUS" && session && session.state === "ACTIVE" ? "bg-[#120713]" :
                sessionType(sessionCount) === "BREAK" && session && session.state === "ACTIVE" ? "bg-[#030f13]" :
                sessionType(sessionCount) === "LONG_BREAK" && session && session.state === "ACTIVE" ?"bg-[#040F1D]":
                "bg-gray-950"
        }`}>
            <nav className= {`flex flex-row items-center transition-colors duration-1000 backdrop-blur-md justify-between  px-6 py-1 shadow-md ${
                sessionType(sessionCount) === "FOCUS" && session &&  session.state === "ACTIVE"? "bg-rose-900/10":
                sessionType(sessionCount) === "BREAK" && session && session.state === "ACTIVE"?"bg-green-900/10":
                sessionType(sessionCount) === "LONG_BREAK" && session && session.state === "ACTIVE"? "bg-sky-900/10":
                "bg-gray-900/50"
            } backdrop-blur-md`}>
                    <button className="hover:text-white hover:[text-shadow:0_0_10px_white] p-2 mx-8">Pomodoro Timer</button>
                    <button 
                        className="mx-8  hover:[text-shadow:0_0_10px_white] hover:text-rose-500 p-2"
                        onMouseEnter= {() => {
                            handleMouseEnter();
                            setFocusMenu(false);
                        }}
                        onMouseLeave= {() => {
                            handleMouseLeave();
                        }}>
                            
                        Settings
                    </button>
                    {
                        settingsOpen && (
                            <div className="absolute top-full right-8 mt-1 w-60 bg-white/10 rounded-xl shadow-lg py-2 text-gray-100"
                                    onMouseEnter={() => {
                                        handleMouseEnter();
                                    }}
                                    onMouseLeave={() => {
                                        handleMouseLeave();
                                    }}
                                    onClick={() => {
                                        setSettingsOpen(!settingsOpen);
                                        }}>
                                <button 
                                    className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]"
                                     onClick={() => {
                                        setSettingsOpen(!settingsOpen);
                                        setFocusMenu(!focusMenu);
                                        }}>                                   
                                        Focus time
                                </button>
                                <button 
                                    className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]"
                                     onClick={() => {
                                        setSettingsOpen(!settingsOpen);
                                        setShowLogin(!showLogin);
                                        }}>                                   
                                        Login                                    
                                </button>
                            </div>
                        )
                    }
                    {
                        focusMenu && (
                            <div className="absolute top-full right-8 mt-2 w-60 bg-white/10 rounded-xl shadow-lg py-2 text-gray-100"
                                    onMouseLeave={() => {
                                        handleMouseLeave();
                                    }}>
                                <button 
                                    className="flex w-full text-left justify-between px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setFocusMenu(!focusMenu);
                                        setSessionDuration(600);
                                        if(!(session && session.state === "ACTIVE"))
                                            setSecondsLeft(600);
                                        }}>
                                        <div className="text-sm">Beginner Level</div>
                                        <div className="text-white/50 text-xs" >10 mins</div>
                                </button>
                                <button 
                                    className="flex w-full text-left justify-between px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setFocusMenu(!focusMenu);
                                        setSessionDuration(1500);
                                        if(!(session && session.state === "ACTIVE"))
                                            setSecondsLeft(1500);
                                        }}>
                                        <div className="text-sm">Intermediate Level</div>
                                        <div className="text-white/50 text-xs" >25 mins</div>
                                </button>
                                <button 
                                    className="flex w-full text-left justify-between px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setFocusMenu(!focusMenu);
                                        setSessionDuration(3600);
                                        if(!(session && session.state === "ACTIVE"))
                                            setSecondsLeft(3600);
                                        }}>
                                        <div className="text-sm">Advanced Level</div>
                                        <div className="text-white/50 text-xs" >60 mins</div>
                                </button>
                                <button 
                                    className="flex w-full text-left justify-between px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setFocusMenu(!focusMenu);
                                        setSessionDuration(5400);
                                        if(!(session && session.state === "ACTIVE"))
                                            setSecondsLeft(5400);
                                        }}>
                                        <div className="text-sm">Master Level</div>
                                        <div className="text-white/50 text-xs" >90 mins</div>
                                </button>
                            </div>
                        )
                    }
            </nav>
            <div className={`mx-auto mt-32 w-1/3 p-8 rounded-lg shadow-lg text-center space-y-4  ${
                sessionType(sessionCount) === "FOCUS" && session &&  session.state === "ACTIVE"? "bg-rose-100/10":
                sessionType(sessionCount) === "BREAK" && session && session.state === "ACTIVE"?"bg-green-100/10":
                sessionType(sessionCount) === "LONG_BREAK" && session && session.state === "ACTIVE"? "bg-sky-100/10":
                "bg-gray-100/10"

            }`}>
                <h1 className= {
                    `text-3xl font-bold tracking-wide ${
                        sessionType(sessionCount) === "FOCUS" ? "text-rose-700" :
                        sessionType(sessionCount) === "BREAK" ? "text-green-700" :
                        "text-sky-700"
                    }`}>{sessionType(sessionCount) === "LONG_BREAK"? "LONG BREAK": sessionType(sessionCount)}</h1>
                <div className="font-bold text-8xl">
                    {Math.floor(secondsLeft/60)}:
                    {(secondsLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex flex-row">
                {!session || session.state === "COMPLETED" || session.state === "CANCELLED" ? (
                    <button onClick={() => {
                        startSession(sessionType(sessionCount), secondsLeft, sessionCount);
                        enableNotifications();
                    }} 
                    className= {`flex-auto bg-gray-700 shadow-lg ${
                        sessionType(sessionCount) === "FOCUS" ? "hover:bg-rose-200 hover:text-rose-900 transition rounded-lg py-2 font-medium" :
                        sessionType(sessionCount) === "BREAK" ? "hover:bg-green-200 hover:text-green-900 transition rounded-lg py-2 font-medium" :
                        "hover:bg-sky-300 hover:text-black transition rounded-lg py-2 font-medium"
                    }`}
                    >
                    Start</button>
                ) : session.state === "ACTIVE" ?(
                    <>
                    <button onClick = {() => pauseSession()}
                    className= {`flex-auto text-gray-100 hover:bg-yellow-200 hover:text-yellow-600 transition rounded-lg py-2 font-medium ${
                        sessionType(sessionCount) === "FOCUS" ? "bg-[#443D4C]" :
                        sessionType(sessionCount) === "BREAK" ? "bg-[#34474F]" :
                        "bg-[#324559]"

                    }`}
                        >Pause</button>
                    <div className="flex-auto"></div>
                    <button onClick ={() =>cancelSession()}
                    className="flex-auto bg-rose-600 text-rose-100 hover:bg-rose-200 hover:text-rose-600 transition rounded-lg py-2 font-medium"
                        >Exit</button>
                    </>
                ) : session.state === "PAUSED" ? (
                    <>
                    <button onClick = {() => resumeSession()}
                    className="flex-auto bg-gray-600 text-gray-100 hover:bg-green-200 hover:text-green-600 transition rounded-lg py-2 font-medium"
                    >Resume</button>
                    <div className="flex-auto"></div>
                    <button onClick ={() =>cancelSession()}
                    className="flex-auto bg-rose-600 text-rose-100 hover:bg-rose-200 hover:text-rose-600 transition rounded-lg py-2 font-medium"
                        >Exit</button>
                    </>

                ) : null
                }
                {showLogin && (
                    /* This outer div is the "overlay" that covers the whole screen */
                    /* Increased blur to backdrop-blur-md and made the black tint slightly heavier */
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md transition-all">
                        

                        <div className="bg-gray-900/90 border border-white/10 p-8 rounded-2xl shadow-2xl w-96 text-gray-200 font-mono">
                            <h2 className="text-2xl font-bold mb-6 text-center text-rose-500 tracking-wide">Login</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-1 text-gray-400">Email</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:placeholder:text-transparent focus:outline-none focus:border-white/50 transition"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm mb-1 text-gray-400">Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full px-4 py-2 text-sm bg-black/50 border border-gray-700 border-white/10 rounded-lg focus:placeholder:text-transparent focus:outline-none focus:border-white/50 transition"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                    />
                                </div>
                                <div className="flex flex-row space-x-4 mt-8">
                                    {loginError && (
                                        <p className="flex justify-between text-sm text-rose-400">Invalid email or password.</p>
                                    )}
                                        <button 
                                            onClick={() => setShowLogin(false)}
                                            className="flex-auto bg-gray-800 text-gray-300 hover:bg-gray-700 transition rounded-lg py-2"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => {
                                                handleLogin(email, password);
                                            }}
                                            className="flex-auto bg-rose-600 text-white hover:bg-rose-500 transition rounded-lg py-2 font-medium shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                                            Sign In
                                        </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>

    )
}

export default Timer;