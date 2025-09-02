'use client'

import { supabase } from "@/components/supabase/supabaseClient"
import LoadingComponent from "@/components/ui/loading"
import { Avatar } from "@mui/material"
import { Typography } from "@mui/material"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
/*
{
    "id": 5,
    "created_at": "2025-06-07T20:43:59.568215+00:00",
    "identifier": "6a560a9b-cfb9-4ec5-b4fb-e3e15d6cd8bc",
    "ProfilePicture": null,
    "Username": "bob"
}
 */

export default function HomePage({ slug }) {
    const [user, setUser] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function getUserData() {
        const { data: userFetch, error: userFetchError } = await supabase
            .from("Users")
            .select('*')
            .eq('identifier', slug)
        if (userFetchError) {
            console.error("userFetchError", userFetchError)
        } else {
            setUser(userFetch[0])
        }
    }

    useEffect(() => {
        async function fetch() {
            setIsLoading(true)
            await getUserData()
            setIsLoading(false)
        }
        fetch()
    }, [])

    if (isLoading) {
        return (
            <LoadingComponent Isloading={isLoading} />
        )
    }

    return (
        <div className='min-h-screen relative w-full'>
            <section className="pt-5 px-6 flex w-full gap-3 flex-col md:flex-row min-h-20 md:flex-wrap lg:flex-nowrap">
                <div className=" flex flex-col gap-5 p-4 md:min-w-60 xl:min-w-80">
                    <Avatar sx={{ width: 100, height: 100 }} src={user.ProfilePicture} className="" />
                    <h1 className="font-bold text-4xl ml-2">{user.Username}</h1>
                    <Separator />
                    <p className="">Member since: {new Date(user.created_at).toLocaleDateString()}</p>
                    <Separator />
                    {/*  <p className="">Socials :</p>
                    <p className="text-sm text-gray-400 text-center">Aucuns</p>
                    <Separator /> */}
                    <p>Prénom: <span className="font-semibold text-accent">{user.firstName || 'Aucun'}</span></p>
                    <p>Classe: <span className="font-semibold text-accent">{user.className || 'Aucun'}</span></p>
                </div>
                <div className="pl-5 w-full">
                    <h5 className="text-xl mb-3">A propos de moi</h5>
                    <div className="w-full px-10 py-7 bg-gray-800 rounded-2xl">
                        {user.about ?
                            <p>{user.about}</p> : <p className="italic text-gray-400">Rien a voir ici...</p>
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}