import { useEffect, useState } from "react";
import { supabase } from "@/components/supabase/supabaseClient";
import { Input } from '@/components/ui/input'
import { cn } from "@/lib/utils";
import * as React from "react";

export function PublishMenu({ addPostDp, setAddPostDp, fetch, postData, isOnEdit, setEditMode, setEditData }) {
    const [tag, setTag] = useState('');
    const [listOfTags, setListOfTags] = useState(isOnEdit ? [postData.listOfTags] : []);

    const [title, setTitle] = useState(isOnEdit ? postData.title : '');
    const [description, setDescription] = useState(isOnEdit ? postData.description : '');
    const [avatarFile, setAvatarFile] = useState('');
    const [displayImg, setDisplayImg] = useState(isOnEdit ? postData.avatarFile : '')

    function closeMenu() {
        setAddPostDp('none')
        setEditMode(false)
        setEditData([])
        window.location.reload()
    }

    function TagsOnchange(event) {
        const currentTag = event.target.value
        setTag(currentTag)
        if (currentTag != "placeholder") {
            setListOfTags([...listOfTags, currentTag.trim()]);
        }
    }

    function onFileInputChange(e) {
        const targetFile = e.target.files[0]
        setAvatarFile(targetFile)
        const image = URL.createObjectURL(targetFile)
        console.log(image)
        setDisplayImg(image)
    }

    async function PublishPost(e) {
        if (listOfTags.length == 0) {
            window.alert("Choisis des tags")
            return
        }
        if (!isOnEdit) {
            const { data: search, error: searchError } = await supabase
                .from("Posts")
                .select("*")
                .eq("titre", title);
            if (searchError) {
                console.error("searchError", searchError);
            }
            if (search && search.length > 0) {
                console.log("Post already exsits");
                alert('Un post avec le même titre existe déjà')
                return
            }
        }

        const personnalUuid = JSON.parse(localStorage.getItem("UserData"))[0].identifier;
        const personnalUsername = JSON.parse(localStorage.getItem("UserData"))[0].Username;
        const personnalAvatar = JSON.parse(localStorage.getItem("UserData"))[0].ProfilePicture || null;

        if (isOnEdit) {
            const { error } = await supabase
                .from('Posts')
                .update({
                    titre: title,
                    desc: description,
                    tags: listOfTags,
                    CreatorUUID: personnalUuid,
                    CreatorUsername: personnalUsername,
                    CreatorProfilePicture: personnalAvatar,
                })
                .eq('uuid', postData.uuid)
            if (error) {
                console.error("Error while saving post", error)
            }
        } else {
            const { data, error } = await supabase.from("Posts").insert([{
                titre: title,
                desc: description,
                tags: listOfTags,
                CreatorUUID: personnalUuid,
                CreatorUsername: personnalUsername,
                CreatorProfilePicture: personnalAvatar,
            }])
            if (error) {
                console.error("Error while saving post", error)
            }
        }
        if (avatarFile !== '') await SaveAvatar() //Saves image on db
        await setAddPostDp()
        await fetch()
        window.location.reload()
    }

    async function SaveAvatar() {
        const { data: postData, error: parseError } = await supabase.from('Posts').select("*").eq("titre", title)
        if (parseError) {
            console.error("parse Error", parseError)
        }
        const postID = postData[0].uuid

        const { data, error } = await supabase
            .storage
            .from('postpictures')
            .upload(`public/${postID}.${avatarFile.name.split('.').pop()}`, avatarFile, {
                cacheControl: '3600',
                upsert: false
            })
        if (error) {
            console.error("Error while saving avatar", error)
        }

        const { data: URLPicture, error: URLPictureError } = await supabase
            .storage
            .from('postpictures')
            .getPublicUrl(`public/${postID}.${avatarFile.name.split('.').pop()}`)

        if (URLPictureError) {
            console.error("URLPictureError", URLPictureError)
        }
        const publicUrl = URLPicture.publicUrl

        const { error: UpdateUrlError } = await supabase
            .from('Posts')
            .update({ picture: publicUrl })
            .eq("uuid", postID)

        if (UpdateUrlError) {
            console.error("UpdateUrlError", UpdateUrlError)
        }
    }

    useEffect(() => {
        if (isOnEdit) {
            setListOfTags([...postData.listOfTags])
            setTitle(postData.title)
            setDescription(postData.description)
            setDisplayImg(postData.avatarFile)
        }
    }, [isOnEdit, postData])

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] items-center justify-center z-50 p-4" style={{ display: addPostDp }}>
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 flex gap-5 max-w-200 w-fit">
                <div className="max-w-125">
                    <div className="flex items-center mb-4">
                        <button onClick={closeMenu} className="cursor-pointer">
                            <span className="material-symbols-outlined mr-5 text-white">close</span>
                        </button>
                        <h1 className="text-2xl font-bold text-white">{isOnEdit ? 'Edition de post' : 'Nouveau post'}</h1>
                    </div>
                    <form action={(e) => PublishPost(e)}>
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Titre du bloc"
                            className="w-full px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 h-12"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />

                        <Input
                            type="text"
                            name="desc"
                            id="desc"
                            placeholder="Petite description"
                            className={"w-full px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 h-12"}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            required
                        />

                        <Input
                            type="file"
                            name="image"
                            id="image"
                            className="w-full px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 h-12 placeholder:text-red-500"
                            accept="image/*"
                            onChange={(e) => onFileInputChange(e)}
                            required={!isOnEdit}

                        />

                        <select
                            name="tags"
                            id="tags"
                            onChange={(event) => TagsOnchange(event)}
                            defaultValue={tag}
                            className={cn(
                                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                                "w-full px-4 py-3 rounded-(--radius) bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 h-12"
                            )}
                            required
                        >
                            <option value="placeholder">--Prises--</option>
                            <option value="pinces">Pinces</option>
                            <option value="bacs">Bacs</option>
                            <option value="reglettes">Réglettes</option>
                            <option value="boules">Boules</option>

                            <option value="placeholder">--Mouvements--</option>
                            <option value="statique">Statique</option>
                            <option value="dynamique-balance">Dynamique balancé</option>

                            <option value="placeholder">--Difficultée--</option>
                            <option value="V5">V5</option>
                            <option value="V4">V4</option>
                            <option value="V3">V3</option>
                            <option value="V2">V2</option>
                            <option value="V1">V1</option>
                        </select>

                        <ul className="flex flex-wrap gap-2 mb-4">
                            {listOfTags.map((tag, index) => (
                                <li key={index} className="">
                                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded flex items-center">
                                        #{tag}

                                        <button onClick={() => { setListOfTags(listOfTags.filter((word) => word != tag)); }} className="text-gray-100 transition-colors hover:text-red-500 ml-2" >
                                            <span className="material-symbols-outlined !text-sm">close</span>
                                        </button>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded" type="submit">
                            Publier
                        </button>
                    </form>
                </div>
                {displayImg && (
                    <div className="w-fit">
                        <img src={displayImg} alt="display image" className="w-full rounded-xl object-cover min-w-90 max-w-90 max-h-100 min-h-100" />
                    </div>
                )}
            </div>
        </div>
    )
}