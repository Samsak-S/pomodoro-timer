const Clock = ({
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
}) => {
    return(
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
                        sessionType(sessionCount) === "FOCUS" ? "hover:bg-[#5A4F60] hover:text-rose-100 transition rounded-lg py-2 font-medium" :
                        sessionType(sessionCount) === "BREAK" ? "hover:bg-green-200 hover:text-green-900 transition rounded-lg py-2 font-medium" :
                        "hover:bg-sky-300 hover:text-black transition rounded-lg py-2 font-medium"
                    }`}
                    >
                    Start</button>
                ) : session.state === "ACTIVE" ?(
                    <>
                    <button onClick = {() => pauseSession()}
                    className= {`flex-auto hover:text-gray-100/90 transition rounded-lg py-2 font-medium ${
                        sessionType(sessionCount) === "FOCUS" ? "bg-[#5A4F60] hover:bg-[#907B66]" :
                        sessionType(sessionCount) === "BREAK" ? "bg-[#465D61] hover:bg-[#7F8566]" :
                        "bg-[#445A6D] hover:bg-[#7D8371]"

                    }`}
                        >Pause</button>
                    <div className="flex-auto"></div>
                    <button onClick ={() =>cancelSession()}
                    className="flex-auto bg-rose-600 text-rose-100 hover:text-rose-100/90 hover:bg-rose-500 transition rounded-lg py-2 font-medium"
                        >Exit</button>
                    </>
                ) : session.state === "PAUSED" ? (
                    <>
                    <button onClick = {() => resumeSession()}
                    className="flex-auto bg-gray-600 text-gray-100 hover:text-gray-100/90 hover:bg-[#5C8379] transition rounded-lg py-2 font-medium"
                    >Resume</button>
                    <div className="flex-auto"></div>
                    <button onClick ={() =>cancelSession()}
                    className="flex-auto bg-rose-600 text-rose-100 hover:text-rose-100 hover:bg-rose-500 transition rounded-lg py-2 font-medium"
                        >Exit</button>
                    </>

                ) : null
                }
            </div>
        </div>
    );
}

export default Clock;