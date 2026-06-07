import React,{useEffect, useRef, useState} from "react"; 
import tickingSound from '../sounds/ticking_sound.wav';
import alarmSound from '../sounds/alarm.mp3'

const usePomodoro = () => {
    //Session variables
    const [session, setSession] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(null);
    const [sessionCount, setSessionCount] = useState(1);
    const [sessionDuration, setSessionDuration] = useState(600);

    //Notification variables
    const [notiPerm, setNotiPerm] = useState(null);
    const ticking = useRef(null);
    const permission = useRef(null);


    //Finds the actual session type
    const sessionValues = {
        1: "FOCUS",
        2: "BREAK",
        3: "LONG_BREAK"
    };

    const sessionType = (count) => {
        if(count % 6 === 0)
            return sessionValues[3];
        else if(count % 2 === 0)
            return sessionValues[2];
        else
            return sessionValues[1];
    }

    //Calculates the session duration based on the user set duration for focus.
    const calcSessionDuration = (type) => {
        if(type === "FOCUS")
            return sessionDuration;
        else if(type === "BREAK")
            return sessionDuration * 0.2;
        else
            return sessionDuration * 0.6;
    };

    //Calculates the remaining seconds left
    const calcSecondsLeft = (data) => {
        let timeElapsed;
        if(data.state === "ACTIVE")
            timeElapsed = Math.floor((new Date() - new Date(data.startTime) - data.totalPauseDuration)/1000);
        else
            timeElapsed = Math.floor((new Date(data.pauseTime) - new Date(data.startTime) - data.totalPauseDuration)/1000);
        return data.sessionTime - timeElapsed;
    }

    //Deals with the browser notification portion.
    const enableNotifications = async() => {
        const newPerm = await Notification.requestPermission();
        permission.current = newPerm;
    }

    //Ticking sound
    const triggerTicking = (input) => {
        if(!ticking.current) {
            ticking.current = new Audio(tickingSound);
            ticking.current.loop = true;
            ticking.current.addEventListener('error', (err) => {
                console.error(err);
            });
        }
        
        if(input === "play") {
            ticking.current.play();
        }
        else if(input === "pause") {
            ticking.current.pause();
        }
        else {
            console.log("The alarm sound failed");
        }
    }


    //Alarm sound
    const triggerNotification = (type) => {
        const alarm = new Audio(alarmSound);

        alarm.addEventListener('error', (err) => {
            console.error(err);
        });

        alarm.play().catch((err) => console.log("Audio playback failed", err));

        if(permission.current === "granted") {
            const clearerType = (type) => {
                if(type === "FOCUS")
                    return "Focus";
                else if(type === "BREAK")
                    return "Break";
                else if(type === "LONG_BREAK")
                    return "Long Break";
                
            }
            const notification = new Notification("Pomodoro", {
                body: `Your ${clearerType(type)} session has completed`,
                tag: "pomodoro-notification"
            });

            notification.onclick = () => {
                window.focus();
                alarm.pause();
                notification.close();
            }
        }
    }

    //Sets the clock on the first trigger
    useEffect(() => {
        if(session && session.state === "ACTIVE") {
            const interval = setInterval(async () => {
                setSecondsLeft(await calcSecondsLeft(session));
            },1000);
            return () => clearInterval(interval);
        }
    },[session])

    //setting up the clock on the first run
    const initClock = () => {
        setSessionCount(1);
        setSecondsLeft(calcSessionDuration(sessionType(1)));
    }

    //Fetch the current state from the server
    useEffect(()=> {
        fetch('http://localhost:8080/api/pomodoro/current')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            if(data) {
                setSession(data);
                if(data.state === "ACTIVE" || data.state === "PAUSED") {
                    setSecondsLeft(calcSecondsLeft(data));
                    setSessionCount(data.streak);
                }
                else if (data.state === "COMPLETED") {
                    setSecondsLeft(calcSessionDuration(sessionType(data.streak + 1)));
                    setSessionCount(data.streak + 1);
                }
                else if (data.state === "CANCELLED") {
                    setSession(null);
                    setSecondsLeft(calcSessionDuration(sessionType(1)));
                    setSessionCount(1);
                }
            }
        })
        .catch(initClock());
    }, []);
    
    //Marking the current session to completed
    useEffect(() => {
        if(session && session.state === "ACTIVE" && secondsLeft <= 0) {
            fetch('http://localhost:8080/api/pomodoro/complete', {
                method: 'POST',
                headers: {'Content-type': 'application/json'}
            })
            .then(res => res.json())
            .then((data) => {
                if(data) {
                    setSession(data);
                    const newStreak = data.streak + 1
                    setSecondsLeft(calcSessionDuration(sessionType(newStreak)));
                    setSessionCount(newStreak);
                    triggerTicking("pause");
                    triggerNotification(sessionType(newStreak));
                }
            })
            .catch(() => console.log("Failed to connect to the server"));
        }

    }, [session, secondsLeft]);

    //Cancelling the current session
    const cancelSession = () => {
        fetch('http://localhost:8080/api/pomodoro/cancel', {
            method: 'POST',
            headers: {'Content-Type':'application/json'}
        })
        .then(res => {
            if(!res.ok)
                throw new Error(`Server rejected the request with status: ${res.status}`);
                
            res.json()
        })
        .then((data) => {
            setSession(null);
            setSecondsLeft(calcSessionDuration("FOCUS"));
            setSessionCount(1);
            triggerTicking("pause");
        })
        .catch(() => console.log("Failed to connect to the server"));
    };

    //Starting a new session
    const startSession = (type, sessionTime, streak) => {
        fetch('http://localhost:8080/api/pomodoro/start', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'type': type,
                'sessionTime': sessionTime,
                'streak': streak
            })
        })
        .then(res => res.json())
        .then((data) => {
            setSession(data);
            setSecondsLeft(calcSecondsLeft(data));
            setSessionCount(data.streak);
            if(data.type === "FOCUS")
                triggerTicking("play");
            })
    };

    //Pausing a session
    const pauseSession = () => {
        fetch('http://localhost:8080/api/pomodoro/pause', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })
        .then(res => res.json())
        .then((data) => {
            setSession(data);
            triggerTicking("pause");
        })
    };

    //Resuming a session 
    const resumeSession = () => {
        fetch('http://localhost:8080/api/pomodoro/resume', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })
        .then(res => res.json())
        .then((data) => {
            setSession(data);
            if(data.type === "FOCUS")
                triggerTicking("play");
        })
    }

    return ({
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
    })
}

export default usePomodoro;