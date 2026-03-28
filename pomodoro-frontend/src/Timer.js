import React, {useState, useEffect} from "react";


const Timer = () => {
    const [session, setSession] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(null);
    const [sessionCount, setSessionCount] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [focusMenu, setFocusMenu] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(1500);

    const sessionType = (count) => {
        if(count % 6 === 0)
            return sessionValues[3];
        else if(count % 2 === 0)
            return sessionValues[2];
        else
            return sessionValues[1];
    }
    const findSessionDuration = (type) => {
        if(type === "FOCUS")
            return sessionDuration;
        else if(type === "BREAK")
            return sessionDuration * 0.2;
        else
            return sessionDuration * 0.6;
    };

    const putSessionDuration = (type, duration) => {
        if(type === "FOCUS")
            return duration;
        else if(type === "BREAK")
            return duration * 5;
        else 
            return duration * 5 / 3;
    }

    const sessionValues = {
        1: "FOCUS",
        2: "BREAK",
        3: "LONG_BREAK"
    };

    //For every re-render this useEffect will run.
    useEffect(() => {
        fetch('http://localhost:8080/api/pomodoro/current')
        .then(res => res.ok? res.json(): null)
        .then(data => {
            if(data) {
                setSession(data);
                console.log(data);
                let timeElapsed;
                if(data.state === "ACTIVE")
                    timeElapsed = Math.floor(
                        (new Date() - new Date(data.startTime) - data.totalPauseDuration) / 1000);
                else if(data.state === "PAUSED")
                    timeElapsed = Math.floor((new Date(data.pauseTime) - new Date(data.startTime))/1000);
                else if(data.state === "COMPLETED")
                    timeElapsed = 0;

                setSessionDuration(data.type, data.sessionTime);
                setSecondsLeft(data.sessionTime - timeElapsed);
                setSessionCount(data.state === "COMPLETED"? data.streak + 1: data.streak);
            }
        })
        .catch(
            setSessionCount(1)
        );
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
        setSecondsLeft(findSessionDuration(type));
    }, [sessionCount])

    //Sets the session from the first instance
    useEffect(() => {
        if(session && session.state === "ACTIVE") {
            console.log("I'm in");
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
            fetch('http://localhost:8080/api/pomodoro/complete', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(data => {
                setSession(data);
                setSessionCount(data.streak + 1);
                setSecondsLeft(findSessionDuration(sessionType(data.streak + 1)));
            })
            .catch(err => console.log("No active session"));
        }
    },[secondsLeft, session])

    const startSession = (type, sessionTime, streak) => {
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
            console.log(data);
        })
        .catch(err => console.error(err));
    };

    const cancelSession = () => {
        fetch('http://localhost:8080/api/pomodoro/cancel', {
            method: 'POST'
        })
        .then((res) => res.json())
        .then((data) => {
            setSession(data);
            setSessionCount(1);
            setSecondsLeft(findSessionDuration("FOCUS"));
        })
        .catch(err => console.log("No active session"));
    }

    const pauseSession = () => {
        fetch('http://localhost:8080/api/pomodoro/pause', {
            method: 'POST'
        })
        .then(res => res.json())
        .then((data) => setSession(data))
        .catch(err => console.log(err));
    }

    const resumeSession = () => {
        fetch('http://localhost:8080/api/pomodoro/resume', {
            method: 'POST'
        })
        .then(res => res.json())
        .then((data) => setSession(data))
        .catch(err => console.log(err));
    }

    return( 
        <div className= {`flex flex-col min-h-screen transition-colors duration-1000 text-gray-200 font-mono ${
                sessionType(sessionCount) === "FOCUS" && session && session.state === "ACTIVE" ? "bg-[#100810]" :
                sessionType(sessionCount) === "BREAK" && session && session.state === "ACTIVE" ? "bg-[#030f13]" :
                sessionType(sessionCount) === "LONG_BREAK" && session && session.state === "ACTIVE" ?"bg-[#040F1D]":
                "bg-gray-950"
        }`}>
            <nav className= {`flex flex-row items-center transition-colors duration-1000 backdrop-blur-md justify-between px-6 py-1 shadow-md ${
                sessionType(sessionCount) === "FOCUS" && session &&  session.state === "ACTIVE"? "bg-red-900/10":
                sessionType(sessionCount) === "BREAK" && session && session.state === "ACTIVE"?"bg-green-900/10":
                sessionType(sessionCount) === "LONG_BREAK" && session && session.state === "ACTIVE"? "bg-sky-900/10":
                "bg-gray-900/50"
            } backdrop-blur-md`}>
                    <button className="hover:text-white hover:[text-shadow:0_0_10px_white] p-2 mx-8">Pomodoro Timer</button>
                    <button 
                        className="mx-8  hover:[text-shadow:0_0_10px_white] hover:text-rose-500 p-2"
                        onClick= {() => {
                            setSettingsOpen(!settingsOpen);
                            setFocusMenu(false);
                        }}>
                            
                        Settings
                    </button>
                    {
                        settingsOpen && (
                            <div className="absolute top-full right-8 mt-2 w-60 bg-white/10 rounded-xl shadow-lg py-2 text-gray-100">
                                <button 
                                    className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setSettingsOpen(!settingsOpen);
                                        setFocusMenu(!focusMenu);
                                        }}>
                                    Focus Level
                                </button>
                            </div>
                        )
                    }
                    {
                        focusMenu && (
                            <div className="absolute top-full right-8 mt-2 w-60 bg-white/10 rounded-xl shadow-lg py-2 text-gray-100">
                                <button 
                                    className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setFocusMenu(!focusMenu);
                                        setSessionDuration(600);
                                        if(!(session && session.type === "ACTIVE"))
                                            setSecondsLeft(600);
                                        }}>
                                    Beginner level
                                </button>
                                <button 
                                    className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setFocusMenu(!focusMenu);
                                        setSessionDuration(1500);
                                        if(!(session && session.type === "ACTIVE"))
                                            setSecondsLeft(1500);
                                        }}>
                                    Intermediate level
                                </button>
                                <button 
                                    className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setFocusMenu(!focusMenu);
                                        setSessionDuration(3600);
                                        if(!(session && session.type === "ACTIVE"))
                                            setSecondsLeft(3600);
                                        }}>
                                    Advanced level
                                </button>
                                <button 
                                    className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]" 
                                    onClick={() => {
                                        setFocusMenu(!focusMenu);
                                        setSessionDuration(5400);
                                        if(!(session && session.type === "ACTIVE"))
                                            setSecondsLeft(5400);
                                        }}>
                                    Master level
                                </button>
                            </div>
                        )
                    }
            </nav>
            <div className={`mx-auto mt-32 w-1/3 p-8 rounded-lg shadow-lg text-center space-y-4  ${
                sessionType(sessionCount) === "FOCUS" && session &&  session.state === "ACTIVE"? "bg-red-100/10":
                sessionType(sessionCount) === "BREAK" && session && session.state === "ACTIVE"?"bg-green-100/10":
                sessionType(sessionCount) === "LONG_BREAK" && session && session.state === "ACTIVE"? "bg-sky-100/10":
                "bg-gray-100/10"

            }`}>
                <h1 className= {
                    `text-3xl font-bold tracking-wide ${
                        sessionType(sessionCount) === "FOCUS" ? "text-red-700" :
                        sessionType(sessionCount) === "BREAK" ? "text-green-700" :
                        "text-sky-700"
                    }`}>{sessionType(sessionCount) === "LONG_BREAK"? "LONG BREAK": sessionType(sessionCount)}</h1>
                <div className="font-bold text-8xl">
                    {Math.floor(secondsLeft/60)}:
                    {(secondsLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex flex-row">
                {!session || session.state === "COMPLETED" || session.state === "CANCELLED" ? (
                    <button onClick={() => startSession(sessionType(sessionCount), secondsLeft, sessionCount)} 
                    className= {`flex-auto bg-gray-700 shadow-lg ${
                        sessionType(sessionCount) === "FOCUS" ? "hover:bg-red-100 hover:text-red-700 transition rounded-lg py-2 font-medium" :
                        sessionType(sessionCount) === "BREAK" ? "hover:bg-green-100 hover:text-green-700 transition rounded-lg py-2 font-medium" :
                        "hover:bg-sky-100 hover:text-sky-700 transition rounded-lg py-2 font-medium"
                    }`}
                    >
                    Start</button>
                ) : session.state === "ACTIVE" ?(
                    <>
                    <button onClick = {() => pauseSession()}
                    className= {`flex-auto text-gray-100 hover:bg-yellow-100 hover:text-yellow-500 transition rounded-lg py-2 font-medium ${
                        sessionType(sessionCount) === "FOCUS" ? "bg-[#443D4C]" :
                        sessionType(sessionCount) === "BREAK" ? "bg-[#34474F]" :
                        "bg-[#324559]"

                    }`}
                        >Pause</button>
                    <div className="flex-auto"></div>
                    <button onClick ={() =>cancelSession()}
                    className="flex-auto bg-red-600 text-red-100 hover:bg-red-100 hover:text-red-600 transition rounded-lg py-2 font-medium"
                        >Exit</button>
                    </>
                ) : session.state === "PAUSED" ? (
                    <>
                    <button onClick = {() => resumeSession()}
                    className="flex-auto bg-gray-700 text-gray-100 hover:bg-green-100 hover:text-green-500 transition rounded-lg py-2 font-medium"
                    >Resume</button>
                    <div className="flex-auto"></div>
                    <button onClick ={() =>cancelSession()}
                    className="flex-auto bg-red-600 text-red-100 hover:bg-red-100 hover:text-red-600 transition rounded-lg py-2 font-medium"
                        >Exit</button>
                    </>

                ) : null
                }
                </div>
            </div>
        </div>

    )
}

export default Timer;