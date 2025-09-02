/* import { supabase } from "@/components/supabase/supabaseClient";
import { useRouter } from 'next/navigation'

export function IsLogedIn() {
    const router = useRouter()

    async function IsLogedIn() {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            console.log('User is logged in')
            location.reload();
            router.push("/")
            return true
        } else {
            console.log("no")
            return false
        }
    }
    return { IsLogedIn }
}
 */

// hooks/useIsLoggedIn.js (or .ts if using TypeScript)
import { supabase } from "@/components/supabase/supabaseClient";
import { useRouter } from 'next/navigation';

export function useIsLoggedIn() {
    const router = useRouter();

    const checkLogin = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            router.push("/");
            return true;
        } else {
            return false;
        }
    };

    return { checkLogin };
}
