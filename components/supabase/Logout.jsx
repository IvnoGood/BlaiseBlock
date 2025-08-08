'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/components/supabase/supabaseClient'
import { Button } from '@mui/material'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error(error)
        } else {
            console.log("Signed out successfully")
            localStorage.removeItem("UserData")
            router.push("/")
            location.reload()
        }
    }

    return (
        <Button
            onClick={handleLogout}
            variant='contained'
            color="secondary"
        >
            Logout
        </Button>
    )
}
