const Login = ({
    email,
    password,
    showLogin,
    loginError,
    setEmail,
    setPassword,
    setShowLogin,
    setLoginError,
}) => {

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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md transition-all">
            <div className="relative bg-gray-900/90 border border-white/10 p-8 rounded-2xl shadow-2xl w-96 text-gray-200 font-mono">
                    <button 
                        onClick={() => setShowLogin(false)}
                        className="absolute top-3 right-8 text-3xl text-gray-300 hover:text-gray-100 transition rounded-lg py-2"
                    >
                        &times; 
                    </button>
                <h2 className="text-2xl font-bold mb-6 mt-6 text-center text-rose-500 tracking-wide">Login</h2>
                
                <div className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            className="w-full px-4 py-1 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    
                    <div>
                        <input 
                            type="password" 
                            className="w-full px-4 py-1 text-sm bg-black/50 border border-gray-700 border-white/10 rounded-lg focus:outline-none focus:border-white/50 transition"
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
                                onClick={() => {
                                    handleLogin(email, password);
                                }}
                                className="flex-auto w-full max-w-1/4 bg-rose-600 text-white hover:bg-rose-500 transition rounded-lg py-2 font-medium shadow-[0_0_20px_rgba(225,29,72,0.3)]">
                                Sign In
                            </button>
                    </div>
                    <div className="flex flex-row mt-8 text-xs justify-between">
                        <button className="self-start">
                            Forgot Password?
                        </button>

                        <button className="self-end">
                            New Account
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );

}
export default Login;