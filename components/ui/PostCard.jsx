import { useEffect, useState } from "react";
import { Avatar, AvatarGroup } from "@mui/material";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import * as React from "react";
import { supabase } from "../supabase/supabaseClient";
import PostTag from "@/components/ui/PostTag";

export default function PostCard({ post, edit }) {
    const [isowner, setIsowner] = useState(false);
    const [localLikes, setLocalLikes] = useState(post.likes)
    const [hasLikedCSS, setHasLikedCSS] = useState('')

    async function hasUserLikedPost() {
        if (post.likes > 0) {
            const personnalUsername = JSON.parse(localStorage.getItem("UserData"))[0].Username;
            post.likes_user.forEach((user) => {
                if (user.username === personnalUsername) {
                    setHasLikedCSS('var(--color-purple-600)')
                }
            })
        }
    }

    async function pressLike() {
        if (hasLikedCSS === '') {
            const personnalAvatar = JSON.parse(localStorage.getItem("UserData"))[0].ProfilePicture || null;
            const personnalUsername = JSON.parse(localStorage.getItem("UserData"))[0].Username;
            let likesUser = []
            if (localLikes > 0) {
                console.log(post.likes_user)
                likesUser = [...post.likes_user]
                likesUser.push({ avatar: personnalAvatar, username: personnalUsername })
                console.log("final", likesUser)
            } else {
                likesUser = [{ avatar: personnalAvatar, username: personnalUsername }]
                console.log(likesUser)
            }
            setLocalLikes(localLikes + 1)
            const { error } = await supabase
                .from('Posts')
                .update({
                    likes: localLikes + 1,
                    likes_user: likesUser
                })
                .eq('uuid', post.uuid)
            if (error) {
                console.error("Error while saving post", error)
            }
        } else {
            const personnalUsername = JSON.parse(localStorage.getItem("UserData"))[0].Username;
            let likesUser = post.likes_user.filter((user) => user.username !== personnalUsername)
            console.log(likesUser)
            setLocalLikes(localLikes - 1)
            setHasLikedCSS('')
            const { error } = await supabase
                .from('Posts')
                .update({
                    likes: localLikes - 1,
                    likes_user: likesUser
                })
                .eq('uuid', post.uuid)
            if (error) {
                console.error("Error while saving post", error)
            }
        }
    }

    async function DeletePost() {
        const { error: tableError } = await supabase.from("Posts").delete().eq("uuid", post.uuid)
        if (tableError) {
            console.error("error", error)
        }

        const bucket = 'postpictures';
        const index = post.picture.indexOf(bucket);
        const fileLocation = post.picture.slice(index + bucket.length + 1);
        console.log(fileLocation);

        const { error: bucketError } = await supabase
            .storage
            .from('postpictures')
            .remove([fileLocation])
        if (bucketError) {
            console.error("error", error)
        }
        window.location.reload()
    }

    useEffect(() => {
        const personnalUUID = JSON.parse(localStorage.getItem("UserData"))[0].identifier
        if (post.CreatorUUID == personnalUUID) {
            setIsowner(true)
        } else {
            setIsowner(false)
        }
        hasUserLikedPost()
    }, [])

    return (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-100 max-h-300">
            <div className="p-5 flex flex-col">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        {post.CreatorProfilePicture ? (
                            <img src={post.CreatorProfilePicture} alt={post.CreatorUsername} className="w-full h-full object-cover" />
                        ) : (
                            <Avatar sx={{ bgcolor: 'oklch(55.8% .288 302.321)', color: 'white', textTransform: 'uppercase' }} aria-label="recipe">
                                {post.CreatorUsername.slice(0, 1)}
                            </Avatar>
                        )}
                    </div>
                    <div>
                        <h4 className="font-medium text-white cursor-pointer hover:text-purple-500 transition-colors duration-400">{post.CreatorUsername}</h4>
                        <p className="text-white text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                </div>


                <h3 className="text-xl font-bold mb-2 text-white">{post.titre}</h3>

                <img src={post.picture} alt="image" height={300} className="w-full rounded-xl object-cover max-h-100 min-h-100" />

                <p className="text-gray-300 mb-4 mt-2">{post.desc.substring(0, 150)}...</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <PostTag key={tag}>
                            #{tag}
                        </PostTag>
                    ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex space-x-4">
                        {/* <button className="flex items-center hover:text-purple-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {post.likes}
                        </button>
                        <button className="flex items-center hover:text-purple-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {post.comments}
                        </button> */}
                        <button className="flex items-center hover:text-purple-600" style={{ color: hasLikedCSS }} onClick={pressLike}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {localLikes}
                        </button>
                        {isowner && (
                            <>
                                <button className="flex items-center hover:text-purple-600" onClick={edit}>
                                    <span className="material-symbols-outlined !text-xl">
                                        edit_square
                                    </span>
                                </button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="flex items-center hover:text-purple-600">
                                            <span className="material-symbols-outlined !text-xl">
                                                delete_forever
                                            </span>
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Est tu vraiment sûr?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Cette action ne peut être annulée. Cela supprimera définitivement votre
                                                compte et supprimez vos données de nos serveurs.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel >Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={DeletePost}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        )}
                    </div>
                    <button className="hover:text-purple-600 cursor-pointer">Read more →</button>
                </div>
            </div>
        </div>
    );
}