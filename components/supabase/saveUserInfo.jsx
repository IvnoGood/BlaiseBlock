import { supabase } from "@/components/supabase/supabaseClient";

export async function AddUserInfo() {
    const { data: user, error: getUserError } = await supabase.auth.getUser()
    if (getUserError) {
        console.error(getUserError)
    }

    //! Save data to local storage
    const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq('identifier', user.user.id);
    if (error) {
        console.error("Error fetching user data:", error.message);
    } else {
        localStorage.setItem("UserData", JSON.stringify(data))
    }




}