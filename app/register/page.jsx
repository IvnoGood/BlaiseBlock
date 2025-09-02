'use client'

import { useState, useEffect } from 'react'
import { supabase } from "@/components/supabase/supabaseClient";
import { useIsLoggedIn } from "@/components/supabase/IfUserIsLogedIn";
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {

    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)
    const [username, setUsername] = useState("")
    const { checkLogin } = useIsLoggedIn();
    const router = useRouter()

    const HandleRegisterPress = async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            await Login()
            AddUserInfo()

        }
    }

    async function AddUserInfo() {
        const { data: user, error } = await supabase.auth.getUser()
        if (error) {
            console.log(error)
        }
        console.log(user)
        console.log('User ID:', user.user.id)

        const { error: placeError } = await supabase
            .from("Users") // Table name
            .insert([
                {
                    identifier: user.user.id,
                    Username: username
                } // New row data
            ]);

        if (placeError) {
            console.error("Insert Error:", error.message);
        }

        //! Save data to local storage
        const { data, error: userDataError } = await supabase
            .from("Users")
            .select("*")
            .eq('identifier', user.user.id);
        if (userDataError) {
            console.error("Error fetching user data:", userDataError.message);
        } else {
            console.log(data)
            localStorage.setItem("UserData", JSON.stringify(data))
        }

    }

    async function Login() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        }
        //router.push("/")
    }

    useEffect(() => {
        async function Route() {
            checkLogin();
        }
        Route()
    }, [])

    return (
        <div className="relative h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/room.jpg')" }}>
            <div className="inset-0 bg-black/60" />
            <div className="z-10 flex items-center justify-center h-full px-4">
                <div className="w-full max-w-md p-8 bg-gray-900 bg-opacity-80 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Crée un compte</h2>
                    <form className="space-y-4">
                        <input
                            type="username"
                            placeholder="Nom d'utilisateur"
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onChange={(event) => setUsername(event.target.value)}
                            value={username}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                            required
                        />
                        <button
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
                            onClick={(e) => HandleRegisterPress(e)}
                        >
                            Valider
                        </button>
                        {error ? <p className='text-red-500 text-center'>{error}</p> : <></>}
                    </form>
                    <p className="mt-6 text-sm text-center text-gray-400">
                        Tu as déja un compte ?{' '}
                        <a href="/login" className="text-purple-400 hover:underline">
                            Connecte toi
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
