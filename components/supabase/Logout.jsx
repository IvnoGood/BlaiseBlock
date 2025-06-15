'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/components/supabase/supabaseClient'

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
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
            Logout
        </button>
    )
}
