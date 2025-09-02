'use client'
import Link from 'next/link'
import LogoutButton from "@/components/supabase/Logout";
import { AddUserInfo } from "@/components/supabase/saveUserInfo";
import { supabase } from "@/components/supabase/supabaseClient";
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { Button } from '@/components/ui/button'
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

export function Header() {
    const [profilepic, setProfilePic] = useState('')
    const [IsLogedIn, setIsLoggedIn] = useState(false)
    const [usernameHover, setUsernameHover] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        async function Check() {
            setIsLoading(true)
            const raw = localStorage.getItem("UserData");
            const UserData = raw ? JSON.parse(raw)[0] : null
            if (UserData) {
                setIsLoggedIn(true);
                const UserData = JSON.parse(localStorage.getItem("UserData"))[0]
                setProfilePic(UserData.ProfilePicture || null)
            } else {
                const { data: user } = await supabase.auth.getUser();
                if (!user || !user.user) {
                    setIsLoggedIn(false);
                } else {
                    await AddUserInfo();
                    setIsLoggedIn(true);
                    setProfilePic(null)
                }
            }
            setIsLoading(false)
        }
        Check();
    }, []);
    //useEffect(() => { console.log(usernameHover); console.log(usernameHover ? 'right-0 relative animate-entry' : 'right-[-100px] absolute animate-entry') }, [usernameHover])


    return (
        <header className="bg-gray-900 text-white shadow-md w-full z-2 fixed top-0 max-w-screen overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center flex-col md:flex-row">
                <div className='flex flex-row'>
                    <p className="text-2xl font-bold tracking-tight align-middle text-nowrap">Blaise Pascal Bloc</p>
                    {isLoading ? <Skeleton className='h-[40px] w-[40px] mr-3 rounded-full absolute right-[15px]' /> : (
                        <>
                            {IsLogedIn ? (
                                <div className='flex items-center gap-3 absolute right-[15px] transition rounded-l-full pr-3' onClick={async () => {
                                    const user = await supabase.auth.getUser();
                                    const userId = user.data.user.id;
                                    router.push('/users/' + userId)
                                }}>
                                    <Avatar src={profilepic} />
                                    {/* <Typography className={usernameHover ? 'right-0 relative animate-entry flex' : 'right-[-100px] hidden absolute animate-entry'} variant='h6'>{username}</Typography> */}

                                </div>
                            ) : (
                                <div className='flex items-center gap-3 absolute right-[15px] transition rounded-l-full pr-3' onClick={() => setUsernameHover((prev) => !prev)}>
                                    <Button
                                        onClick={() => window.location.href = "/login"}>
                                        <span className="material-symbols-outlined">
                                            login
                                        </span>
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className='w-full'>
                    <nav className="gap-2 text-gray-300 flex justify-self-center">
                        <Link href="/" className="hover:text-white transition">
                            <Button variant='ghost'>Menu</Button>
                        </Link>

                        <Link href="/bloc" className="hover:text-white transition">
                            <Button variant='ghost'>Blocs</Button>
                        </Link>

                        <Link href="/a-propos" className="hover:text-white transition">
                            <Button variant='ghost'>A propos</Button>
                        </Link>
                    </nav>
                </div>
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
