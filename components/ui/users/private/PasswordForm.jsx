import { useState } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/components/supabase/supabaseClient";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

const PasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be 8 characters long" }),
}).refine((data) => data.password !== data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export default function PasswordForm() {
    const [isPasswdOpen, setIsPasswdOpen] = useState(false)

    const passwdSubmit = useForm({
        resolver: zodResolver(PasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })

    async function onPasswdSubmit(data) {
        /*         const { data: changeData, error } = await supabase.rpc('changepassword', {
                    new_plain_password: data.password,
                    current_id: data.confirmPassword
                })
                if (error) {
                    console.log(error)
                }
                console.log(changeData) */
        const { data: changeData, error } = await supabase
            .auth
            .updateUser({ password: data.password })
        if (error) {
            console.error(error)
            return
        }
        setIsPasswdOpen(false)
    }
    return (
        <Dialog open={isPasswdOpen} onOpenChange={setIsPasswdOpen}>
            <DialogTrigger asChild>
                <Button>Change</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change ton mot de passe</DialogTitle>
                    <DialogDescription>
                        Cette action ne peut pas être annulée
                    </DialogDescription>
                </DialogHeader>
                <Form {...passwdSubmit}>
                    <form onSubmit={passwdSubmit.handleSubmit(onPasswdSubmit)} className="w-full space-y-6">
                        <FormField
                            control={passwdSubmit.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot De Passe:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={'password'}
                                            className=" bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder='Entre ton nouveau mot de passe ici'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={passwdSubmit.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmation:</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={'password'}
                                            className=" bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder='Confirme ton mot de passe'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-10 px-10">
                            <DialogClose asChild >
                                <Button variant='outline' className={'flex-1'}>
                                    Fermer
                                </Button>
                            </DialogClose>
                            <Button type="submit" className={'flex-1'}>
                                Valider
                            </Button>
                        </div>
                    </form>
                </Form>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        {/*  <Button type="submit" onClick={changePassword}>
                        Valider
                    </Button> */}
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
