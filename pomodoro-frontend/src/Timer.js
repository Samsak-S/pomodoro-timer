import React, {useState, useEffect} from "react";

const Timer = () => {
    const [session, setSession] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(1500);

    function setTime(data) {
        setSession(data);
        const timeElapsed =  Math.floor((new Date() - new Date(data.startTime) )/ 1000);
        setSecondsLeft(data.sessionTime -  timeElapsed);
        console.log(data);

    }
    //For every re-render this useEffect will run.
    useEffect(() => {
        fetch('http://localhost:8080/api/pomodoro/current')
        .then(res => res.ok? res.json(): null)
        .then(data => {
            if(data) {
                setSession(data);
                console.log(data);
            }
        })
        .catch(err => console.log("No active session"));
    },[]);

    //Sets the session from the first instance
    useEffect(() => {
        if(session && session.sessionStatus === "ACTIVE") {
            const interval = setInterval(() => {
                setSecondsLeft((prev) => prev > 0? prev - 1: 0);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [session]);

    useEffect(() => {
        if(secondsLeft === 0 && session) {
            fetch('http://localhost:8080/api/pomodoro/complete', {
                method: 'POST',
                headers: 'application/json'
            })
            .then(data => setSession(null))
            .catch(err => console.log("No active session"));
        }
        if(!session) {
            setSecondsLeft(0);
        }
        if(session) {
            const timeElapsed = Math.floor((new Date() - new Date(session.startTime))/1000);
            setSecondsLeft(session.sessionTime - timeElapsed);
        }
    },[secondsLeft, session])

    const startSession = (type, sessionTime) => {
        fetch('http://localhost:8080/api/pomodoro/start', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body:  JSON.stringify({
                "type": type,
                "sessionTime": sessionTime,
            }),
        })
        .then(res => res.json())
        .then(data => setSession(data))
    };

    const cancelSession = () => {
        fetch('http://localhost:8080/api/pomodoro/cancel', {
            method: 'POST'
        })
        .then(() => setSession(null))
        .catch(err => console.log("No active session"));
    }

    return( 
        <div style = {{ textAlign: 'center', marginTop: '50px'}}>
            <h1>{session ? session.type: "Ready?"}</h1>
            <div style = {{fontSize: '4rem'}}>
                {Math.floor(secondsLeft/60)}:
                {(secondsLeft % 60).toString().padStart(2, '0')}
            </div>
            {!session ? (
                <button onClick={() => startSession('FOCUS', 1500)}>Start Focus</button>
            ) : (
                <button onClick ={() =>cancelSession()}>Exit Session</button>
                )
            }
        </div>
    )
}

export default Timer;