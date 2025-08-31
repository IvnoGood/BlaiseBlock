'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/components/supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import { Avatar } from "@mui/material";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import Portal from "@mui/material/Portal";

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export default function EditProfileForm({ socials, setSocials }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [socialName, setSocialName] = useState('')
    const [socialLink, setSocialLink] = useState('')

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            social: "",
            link: ""
        },
    })

    const handleSaveChanges = async () => {
        let social = []

        if (socials.length > 0) {
            social = [...socials]
            social.push({ name: socialName, link: socialLink })
        } else {
            social = { name: socialName, link: socialLink }
        }
        console.log(social)
    };

    function onSubmit(data) {
        console.log(data)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={'gohst'}>
                    <Avatar sx={{ backgroundColor: 'var(--accent)', color: 'var(--foreground)' }}>+</Avatar>
                </Button>
            </DialogTrigger>
            <Portal>
                <DialogContent className="sm:max-w-[480px] bg-gray-900 border-gray-700 text-white">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Ajouter un réseau social</DialogTitle>
                                <DialogDescription>
                                    AJoute un réseau social qui sera public sur ta page de profil
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <FormField
                                        control={form.control}
                                        name="social"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Réseaux</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                                        <SelectTrigger className="bg-gray-800 border-gray-600 ">
                                                            <SelectValue placeholder="Choisis ton réseau social" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Réseaux Socials</SelectLabel>
                                                                <SelectItem value="Instagram">Instagram</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lien</FormLabel>
                                            <FormControl>
                                                <Input placeholder="placeholder='eg: https://www.instagram.com/sylvain_lyve/' " {...field} className="col-span-3 bg-gray-800 border-gray-600" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="ghost">Annuler</Button>
                                </DialogClose>
                                <Button type='submit' disabled={isSaving}>
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Portal>
        </Dialog>
    );
}