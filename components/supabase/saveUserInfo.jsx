import { supabase } from "@/components/supabase/supabaseClient";

export async function AddUserInfo() {
    const { data: { user }, error1 } = await supabase.auth.getUser()
    if (error1) {
        console.log(error1)
    }

    //! Save data to local storage
    const { data, error2 } = await supabase
        .from("Users")
        .select("*")
        .eq('identifier', user?.id);
    if (error2) {
        console.error("Error fetching user data:", error2.message);
    } else {
        localStorage.setItem("UserData", JSON.stringify(data))
    }

}