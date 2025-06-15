'use client'
import Link from 'next/link'
import LogoutButton from "@/components/supabase/Logout";
import { AddUserInfo } from "@/components/supabase/saveUserInfo";
import { supabase } from "@/components/supabase/supabaseClient";
import { useEffect, useState } from 'react';

export function Header() {
    const [username, setUsername] = useState('')
    const [profilepic, setProfilePic] = useState('')
    const [IsLogedIn, setIsLoggedIn] = useState(false)

    function SetUserData() {
        const UserData = JSON.parse(localStorage.getItem("UserData"))[0]
        setUsername(UserData.Username)
        setProfilePic(UserData.ProfilePicture || '/images/schema.PNG')
    }

    useEffect(() => {
        async function Check() {
            const raw = localStorage.getItem("UserData");

            if (!raw || raw === "undefined" || raw === "[]") {
                const { data: user } = await supabase.auth.getUser();
                if (!user || !user.user) {
                    setIsLoggedIn(false);
                } else {
                    await AddUserInfo();
                    setIsLoggedIn(true);
                    SetUserData();
                }
            } else {
                setIsLoggedIn(true);
                SetUserData();
            }
        }
        Check();
    }, []);


    return (
        <header className="bg-gray-900 text-white shadow-md w-[100%] z-2 fixed">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo / Site Title */}
                <div className="text-2xl font-bold tracking-tight">Blaise Pascal Bloc</div>

                {/* Navigation Links */}
                <nav className="space-x-6 text-gray-300">
                    <Link href="/" className="hover:text-white transition">Menu</Link>
                    <Link href="/bloc" className="hover:text-white transition">Blocs</Link>
                    {/* <Link href="/carte" className="hover:text-white transition">Carte</Link> */}
                    <Link href="/a-propos" className="hover:text-white transition">A propos</Link>
                </nav>

                {/* CTA Button */}
                {IsLogedIn ? (
                    <div className='flex items-center gap-3'>
                        <img src={profilepic} alt="profilepic" className='size-10 rounded-full' />
                        <p>{username}</p>
                        <LogoutButton></LogoutButton>
                    </div>
                ) : (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition text-sm cursor-pointer"
                        onClick={() => window.location.href = "/login"}>
                        Join Now
                    </button>
                )}
            </div>
        </header>
    );
}
