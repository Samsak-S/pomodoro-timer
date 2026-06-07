const Navbar = ({
    session, 
    secondsLeft, 
    setSecondsLeft,
    sessionCount, 
    sessionDuration, 
    sessionType, 
    setSessionDuration, 
    timeRef, 
    settingsMenu, 
    setSettingsMenu, 
    focusMenu, 
    setFocusMenu,
    showLogin, 
    setShowLogin 
}) => {
    const handleMouseEnter = () => {
        if(timeRef.current)
            clearTimeout(timeRef.current);
        setSettingsMenu(true);
    }

    const handleMouseLeave = () => {
        timeRef.current = setTimeout(() => {
            setSettingsMenu(false);
            setFocusMenu(false);
        }, 70);
    }

    return(
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
                    settingsMenu && (
                        <div className="absolute top-full right-8 mt-1 w-60 bg-white/10 rounded-xl shadow-lg py-2 text-gray-100"
                                onMouseEnter={() => {
                                    handleMouseEnter();
                                }}
                                onMouseLeave={() => {
                                    handleMouseLeave();
                                }}
                                onClick={() => {
                                    setSettingsMenu(!settingsMenu);
                                    }}>
                            <button 
                                className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]"
                                    onClick={() => {
                                    setSettingsMenu(!settingsMenu);
                                    setFocusMenu(!focusMenu);
                                    }}>                                   
                                    Focus time
                            </button>
                            <button 
                                className="block w-full text-left  px-4 py-2 hover:text-rose-500 hover:[text-shadow:0_0_30px_gray]"
                                    onClick={() => {
                                    setSettingsMenu(!settingsMenu);
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
    )
}

export default Navbar;