'use client'
import Link from 'next/link'
import LogoutButton from "@/components/supabase/Logout";
import { AddUserInfo } from "@/components/supabase/saveUserInfo";
import { supabase } from "@/components/supabase/supabaseClient";
import { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';


export function Header() {
    const [username, setUsername] = useState('')
    const [profilepic, setProfilePic] = useState('')
    const [IsLogedIn, setIsLoggedIn] = useState(false)

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    function SetUserData() {
        const UserData = JSON.parse(localStorage.getItem("UserData"))[0]
        setUsername(UserData.Username)
        setProfilePic(UserData.ProfilePicture || null)
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
        <header className="bg-gray-900 text-white shadow-md w-full z-2 fixed top-0">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold tracking-tight">Blaise Pascal Bloc</div>

                <nav className="space-x-6 text-gray-300">
                    <Link href="/" className="hover:text-white transition">Menu</Link>
                    <Link href="/bloc" className="hover:text-white transition">Blocs</Link>
                    <Link href="/a-propos" className="hover:text-white transition">A propos</Link>
                </nav>

                {IsLogedIn ? (
                    <div className='flex items-center gap-3' onClick={handleClick}>
                        <Avatar alt={username} src={profilepic} />
                        <Typography variant='h6'>{username}</Typography>

                    </div>
                ) : (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition text-sm cursor-pointer"
                        onClick={() => window.location.href = "/login"}>
                        Join Now
                    </button>
                )}
            </div>
            {/*   <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                log
                <LogoutButton></LogoutButton>
            </Popover> */}
        </header>
    );
}
