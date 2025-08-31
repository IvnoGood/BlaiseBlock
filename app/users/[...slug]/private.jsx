'use client'
import { supabase } from "@/components/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Switch } from "@/components/ui/switch"
import LoadingComponent from "@/components/ui/loading";
import { Button } from "@/components/ui/button"
import PasswordForm from "@/components/ui/users/private/PasswordForm";
import EmailForm from "@/components/ui/users/private/EmailForm";
import PhoneForm from "@/components/ui/users/private/PhoneForm";


export default function UserPage({ slug }) {
    const [userData, setUserData] = useState([])
    const [showSensibleData, setShowSensibleData] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()

    async function checkPagePermissions() {
        const user = await supabase.auth.getUser();
        const userId = user.data.user.id;
        if (userId !== slug) {
            router.push(`users/${slug}/`)
            return
        }
        setUserData(user.data.user)
        console.log(user.data.user)
        setIsLoading(false)
    }

    useEffect(() => {
        async function fetch() {
            setIsLoading(true)
            await checkPagePermissions()
        }
        fetch()
    }, [])

    if (isLoading) {
        return (
            <LoadingComponent Isloading={isLoading} />
        )
    }

    return (
        <div className=' bg-gray-900 min-h-screen relative w-full'>
            <article className="pt-5 px-6 flex w-full gap-3 flex-col min-h-20">
                <Typography variant="h3" className="flex content-center gap-4 flex-col mf:flex-row">
                    Mon compte
                    <span className="text-base flex items-center text-gray-400">
                        <span className="material-symbols-outlined !text-base mr-1">
                            info
                        </span>
                        Montrer les informations sensibles
                        <Switch checked={showSensibleData} onCheckedChange={() => setShowSensibleData((prev) => !prev)} className={'ml-3'} />
                    </span>
                </Typography>

                <section className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-10 *:flex *:gap-4 *:items-start *:flex-col *:sm:flex-row ">
                    <div>
                        <p>Email:&nbsp;<span className="text-accent font-bold">{showSensibleData ? userData.email : '********' + String(userData.email).slice(8)}</span></p>
                        <EmailForm />
                    </div>
                    {/*  <div>
                        <p className="text-nowrap">Numéro de téléphone:&nbsp;<span className="text-accent font-bold">{showSensibleData ? userData.phone || 'Aucun numéro associé' : '********' + String(userData.phone).slice(8)}</span></p>
                        <PhoneForm />
                    </div> */}
                    {userData.app_metadata.providers.filter(providers => providers === 'email') == 'email' &&
                        <div>
                            <p className="text-nowrap">Mot de passe:</p>
                            <PasswordForm />
                        </div>
                    }
                    <div>
                        <p className="text-nowrap">Déconnection: </p>
                        <Button variant="destructive" onClick={() => { supabase.auth.signOut(); localStorage.removeItem("UserData"); router.push('/') }}>Déconnection</Button>
                    </div>
                </section>
            </article>
        </div>
    )
}