import React, {useState, useEffect} from "react";

const Timer = () => {
    const [session, setSession] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(1500);
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
                        (new Date() - new Date(session.startTime)) / 1000 - session.totalPauseDuration);
                else if(data.state === "PAUSED")
                    timeElapsed = Math.floor((new Date(data.pauseTime) - new Date(data.startTime))/1000);
                else
                    timeElapsed = data.sessionTime;

                setSecondsLeft(data.sessionTime - timeElapsed);
            }
        })
        .catch(err => console.log("No active session"));
    },[]);

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
    else if(session && session.state !== "PAUSED")
        setSecondsLeft(1500);
    }, [session]);

    useEffect(() => {
        if(secondsLeft === 0 && session && session.state === "ACTIVE") {
            fetch('http://localhost:8080/api/pomodoro/complete', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'}
            })
            .then(res => res.json())
            .then(data => setSession(data))
            .catch(err => console.log("No active session"));
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
        .then((data) => setSession(data))
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
            <h1>{session ? session.type: "Ready?"}</h1>
            <div style = {{fontSize: '4rem'}}>
                {Math.floor(secondsLeft/60)}:
                {(secondsLeft % 60).toString().padStart(2, '0')}
            </div>
            {!session || session.state === "COMPLETED" || session.state === "CANCELLED" ? (
                <button onClick={() => startSession('FOCUS', 1500)}>Start Focus</button>
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