'use client'

import { supabase } from "@/components/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Typography, AvatarGroup } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LoadingComponent from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import EditProfileForm from "@/components/ui/users/public/EditProfileForm"


export default function EditProfilePage({ slug }) {
    const router = useRouter();

    // State Management
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Form data state
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [className, setClassName] = useState('');
    const [socials, setSocials] = useState('');
    const [about, setAbout] = useState('');

    // Avatar specific state
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // 1. Fetch user data and check permissions on page load
    useEffect(() => {
        async function fetchUserDataAndCheckPermissions() {
            const user = await supabase.auth.getUser();
            const uuid = user.data.user ? user.data.user.id : null
            if (uuid !== slug) {
                router.push(`/users/${slug}`);
            }

            // Fetch the public profile from the 'Users' table
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .eq('identifier', slug)
                .single();

            if (error || !data) {
                console.error("Error fetching profile:", error);
                // Handle case where profile doesn't exist
                router.push('/');
                return;
            }

            // Pre-fill the form with existing data
            setUserProfile(data);
            setUsername(data.Username || '');
            setFirstName(data.firstName || '');
            setClassName(data.className || '');
            setSocials(data.socials || ''); // Ensure you have this column in your table
            setAbout(data.about || '');

            setIsLoading(false);
        }

        fetchUserDataAndCheckPermissions();
    }, [slug, router]);

    // 2. Handle avatar file selection
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            // Create a temporary URL to show a preview of the new image
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // 3. Handle form submission
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setNotification({ message: '', type: '' });

        let avatarUrl = userProfile.ProfilePicture;

        // Step A: If a new avatar file was selected, upload it
        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop();
            // Unique file path based on user ID and a timestamp to prevent caching issues
            const filePath = `${slug}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile, {
                    cacheControl: '3600',
                    upsert: true, // Overwrite existing file if any
                });

            if (uploadError) {
                setNotification({ message: `Erreur lors du téléversement de l'avatar: ${uploadError.message}`, type: 'error' });
                setIsSaving(false);
                return;
            }

            // Get the public URL of the uploaded file
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            avatarUrl = urlData.publicUrl;
        }

        // Step B: Update the user's profile in the 'Users' table
        const updates = {
            Username: username,
            firstName: firstName,
            className: className,
            socials: socials,
            about: about,
            ProfilePicture: avatarUrl,
        };

        const { error: updateError } = await supabase
            .from('Users')
            .update(updates)
            .eq('identifier', slug);

        if (updateError) {
            setNotification({ message: `Erreur lors de la mise à jour du profil: ${updateError.message}`, type: 'error' });
        } else {
            setNotification({ message: 'Profil mis à jour avec succès!', type: 'success' });
            // Optionally, redirect after a short delay
            setTimeout(() => router.push(`/users/${slug}`), 2000);
        }
        localStorage.removeItem("UserData")

        setIsSaving(false);
    };

    if (isLoading) {
        return <LoadingComponent Isloading={isLoading} />;
    }

    return (
        <div className='bg-gray-900 relative '>
            <form onSubmit={handleSaveChanges} className="pt-5 px-6 max-w-4xl mx-auto">
                <Typography variant="h3" className="mb-6">
                    Modifier mon profil
                </Typography>

                {/* --- Notification Area --- */}
                {notification.message && (
                    <div className={`p-4 mb-6 rounded-md text-center ${notification.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                        {notification.message}
                    </div>
                )}

                {/* --- Avatar Section --- */}
                <section className="mb-10">
                    <Label className="text-lg font-semibold">Photo de profil</Label>
                    <div className="flex items-center gap-6 mt-4">
                        <Avatar sx={{ width: 100, height: 100 }} src={avatarPreview || userProfile?.ProfilePicture} />
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                                Choisir une image
                            </Label>
                            <input id="avatar-upload" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleAvatarChange} className="hidden" />
                            <p className="text-sm text-gray-400">PNG, GIF, JPG. 5MB max.</p>
                        </div>
                    </div>
                </section>

                <Separator className="bg-gray-700 my-8" />

                {/* --- Public Info Section --- */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div>
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 bg-gray-800 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-2 bg-gray-800 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="className">Classe</Label>
                        <Input id="className" value={className} onChange={(e) => setClassName(e.target.value)} className="mt-2 bg-gray-800 border-gray-600" />
                    </div>
                    {/* <div>
                        <Label htmlFor="instagramLink">Lien Instagram</Label>
                        <Input id="instagramLink" placeholder="https://instagram.com/votreprofil" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} className="mt-2 bg-gray-800 border-gray-600" />
                    </div> */}
                    <div className="md:col-span-2">
                        <Label htmlFor="about">A propos de moi</Label>
                        <Textarea id="about" placeholder="Racontez-nous un peu de vous..." value={about} onChange={(e) => setAbout(e.target.value)} className="mt-2 bg-gray-800 border-gray-600 min-h-[120px]" />
                    </div>
                    {/*  <div className="flex justify-between">
                        <AvatarGroup >
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                        </AvatarGroup>
                        <EditProfileForm />
                    </div> */}
                </section>

                <Separator className="bg-gray-700 my-8" />

                {/* --- Actions Section --- */}
                <div className="flex justify-end gap-4">
                    <Link href={`/users/${slug}`}>
                        <Button type="button" variant="outline">Annuler</Button>
                    </Link>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </Button>
                </div>
            </form>
        </div>
    );
}