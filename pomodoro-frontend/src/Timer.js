import React, {useState, useEffect} from "react";

//Todo: Move the sessionCount logic over to the Backend
//Todo: Add some Tailwind css to make it look pretty

const Timer = () => {
    const [session, setSession] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(null);
    const [sessionCount, setSessionCount] = useState(null);

    const sessionType = () => {
        if(sessionCount % 6 === 0)
            return sessionValues[3];
        else if(sessionCount % 2 === 0)
            return sessionValues[2];
        else
            return sessionValues[1];
    }
    const sessionDuration = {
        "FOCUS": 1500,
        "BREAK": 300,
        "LONG_BREAK": 900
    };

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
                        (new Date() - new Date(data.startTime)) / 1000 - data.totalPauseDuration);
                else if(data.state === "PAUSED")
                    timeElapsed = Math.floor((new Date(data.pauseTime) - new Date(data.startTime))/1000);
                else
                    timeElapsed = data.sessionTime;

                setSecondsLeft(data.sessionTime - timeElapsed);
                setSessionCount(data.streak);
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
        setSecondsLeft(sessionDuration[type]);
    }, [sessionCount])

    //Sets the session from the first instance
    useEffect(() => {
        if(session && session.state === "ACTIVE") {
            console.log("I'm in");
            const interval = setInterval(() => {
                const elapsed = Math.floor(
                    (new Date() - new Date(session.startTime)) / 1000 - session.totalPauseDuration);
                console.log(session.totalPauseDuration);
                setSecondsLeft(session.sessionTime - elapsed);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [session]);

    useEffect(() => {
        if(secondsLeft === 0 && session && session.state === "ACTIVE") {
            fetch('http://localhost:8080/api/pomodoro/complete', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(data => {
                setSession(data);
                setSessionCount(sessionCount + 1);
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
            setSecondsLeft(sessionDuration["FOCUS"]);
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
        <div style = {{ textAlign: 'center', marginTop: '50px'}}>
            <h1>{sessionType() === "LONG_BREAK"? "LONG BREAK": sessionType()}</h1>
            <div style = {{fontSize: '4rem'}}>
                {Math.floor(secondsLeft/60)}:
                {(secondsLeft % 60).toString().padStart(2, '0')}
            </div>
            {!session || session.state === "COMPLETED" || session.state === "CANCELLED" ? (
                <button onClick={() => startSession(sessionType(), secondsLeft, sessionCount)}>Start {sessionType() === "LONG_BREAK"? "Long Break": sessionType()}</button>
            ) : session.state === "ACTIVE" ?(
                <>
                <button onClick ={() =>cancelSession()}>Exit Session</button>
                <button onClick = {() => pauseSession()}>Pause Session</button>
                </>
            ) : session.state === "PAUSED" ? (
                <>
                <button onClick ={() =>cancelSession()}>Exit Session</button>
                <button onClick = {() => resumeSession()}>Resume Session</button>
                </>

            ) : null
            }
        </div>
    )
}

export default Timer;