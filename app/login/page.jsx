'use client'

import { useState, useEffect } from 'react'
import { supabase } from "@/components/supabase/supabaseClient";
import { useIsLoggedIn } from "@/components/supabase/IfUserIsLogedIn";
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {

    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)
    const router = useRouter()
    const { checkLogin } = useIsLoggedIn();

    const HandleLoginPress = async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            await AddUserInfo()
            router.push('/')
        }
    }

    async function AddUserInfo() {
        const { data: { user }, error1 } = await supabase.auth.getUser()
        if (error1) {
            console.log(error1)
        }
        console.log('User ID:', user?.id)

        //! Save data to local storage
        const { data, error2 } = await supabase
            .from("Users")
            .select("*")
            .eq('identifier', user?.id);
        if (error2) {
            console.error("Error fetching user data:", error2.message);
        } else {
            console.log(data)
            localStorage.setItem("UserData", JSON.stringify(data))
        }

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
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">De retour ?</h2>
                    <form className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
                            onClick={(event) => HandleLoginPress(event)}
                        >
                            Connecte toi
                        </button>
                        {error ? <p className='text-red-500 text-center'>{error}</p> : <></>}
                    </form>
                    <p className="mt-6 text-sm text-center text-gray-400">
                        Tu n'as pas de compte?{' '}
                        <a href="/register" className="text-purple-400 hover:underline">
                            Crées en un
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
