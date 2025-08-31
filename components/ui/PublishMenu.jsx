import { useEffect, useState } from "react";
import { supabase } from "@/components/supabase/supabaseClient";
import { Input } from '@/components/ui/input'
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";
import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "./button";
import { Ring } from 'ldrs/react'
import 'ldrs/react/Ring.css'
import { TagIcon } from "lucide-react";

export function PublishMenu({ addPostDp, setAddPostDp, fetch, postData, isOnEdit, setEditMode, setEditData }) {
    const [tag, setTag] = useState('');
    const [listOfTags, setListOfTags] = useState(isOnEdit ? [postData.listOfTags] : []);

    const [title, setTitle] = useState(isOnEdit ? postData.title : '');
    const [description, setDescription] = useState(isOnEdit ? postData.description : '');
    const [avatarFile, setAvatarFile] = useState('');
    const [displayImg, setDisplayImg] = useState(isOnEdit ? postData.avatarFile : '');

    const [isLoading, setIsLoading] = useState(false)

    function closeMenu() {
        setAddPostDp('none')
        setEditMode(false)
        setEditData([])
        //window.location.reload()
    }

    function TagsOnchange(value) {
        setTag(value)
        if (value != "placeholder") {
            setListOfTags([...listOfTags, value.trim()]);
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
        setIsLoading(true)
        if (avatarFile !== '') await SaveAvatar() //Saves image on db
        await setAddPostDp()
        setIsLoading(false)
        await fetch()
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

        setListOfTags(isOnEdit ? postData.listOfTags : [])
        setTitle(isOnEdit ? postData.title : '')
        setDescription(isOnEdit ? postData.description : '')
        setDisplayImg(isOnEdit ? postData.avatarFile : '')
    }, [addPostDp])

    return (
        <div className="h-screen w-full max-w-full overflow-x-hidden absolute top-0 left-0 pt-35 p-3 bg-[rgba(0,0,0,0.75)] flex  place-content-center sm:items-center" style={{ display: addPostDp }}>
            {/* absolute top-0 left-0 max-h-screen  items-center p-4 pt-4 overflow-x-scroll */}
            <div className="bg-gray-900 rounded-lg p-6 h-fit flex flex-col gap-3">
                {/*bg-gray-900 rounded-lg shadow-lg p-6 flex gap-5 w-full flex-col lg:flex-row */}
                <div className="flex items-center w-full justify-center gap-3">
                    <button onClick={closeMenu} className="cursor-pointer flex items-center">
                        <span className="material-symbols-outlined text-white text-center">close</span>
                    </button>
                    <h1 className="text-2xl font-bold text-white">{isOnEdit ? 'Edition de post' : 'Nouveau post'}</h1>
                </div>
                <div className="flex flex-col lg:flex-row gap-5">
                    <form action={(e) => PublishPost(e)} className="[&_button]:px-4 [&_button]:py-[23px]">
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Titre de la publication"
                            className="w-full px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 h-12"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />

                        {/*                     <Input
                        type="text"
                        name="desc"
                        id="desc"
                        placeholder="Petite description"
                        className={"w-full px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 h-12"}
                        value={description}
                    /> */}
                        <Textarea
                            placeholder="Description de la publication"
                            id="desc"
                            className={"w-full px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 h-12 resize-none sm:max-w-100 md:max-w-150 2xl:max-w-200"}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            required
                        />

                        <Input
                            type="file"
                            name="image"
                            id="image"
                            className=" w-full px-4 py-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 h-12 placeholder:text-red-500"
                            accept="image/*"
                            onChange={(e) => onFileInputChange(e)}
                            required={!isOnEdit}

                        />

                        <Select
                            onValueChange={TagsOnchange}
                            required
                        >
                            <SelectTrigger className="w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 active:ring-purple-500 active:ring-2 mb-2">
                                <SelectValue placeholder="Selectionne des labels" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Prises</SelectLabel>
                                    <SelectItem value="pinces">Pinces</SelectItem>
                                    <SelectItem value="bacs">Bacs</SelectItem>
                                    <SelectItem value="reglettes">Réglettes</SelectItem>
                                    <SelectItem value="boules">Boules</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Mouvements</SelectLabel>
                                    <SelectItem value="statique">Statique</SelectItem>
                                    <SelectItem value="dynamique-balance">Dynamique balancé</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Difficultée</SelectLabel>
                                    <SelectItem value="V5">V5</SelectItem>
                                    <SelectItem value="V4">V4</SelectItem>
                                    <SelectItem value="V3">V3</SelectItem>
                                    <SelectItem value="V2">V2</SelectItem>
                                    <SelectItem value="V1">V1</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/*                     <select
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
                    </select> */}

                        <ul className="flex flex-wrap gap-2 mb-4">
                            {listOfTags.map((tag, index) => (
                                <li key={index} className="">
                                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded flex items-center">
                                        #{tag}

                                        <button onClick={() => { setListOfTags(listOfTags.filter((word) => word != tag)); }} className="text-gray-100 transition-colors hover:text-red-500 ml-2 !py-0 !px-0" >
                                            <span className="material-symbols-outlined !text-sm">close</span>
                                        </button>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <Button className="w-full !py-2 !px-4" type="submit">
                            {isLoading && <Ring
                                size="13"
                                stroke="2"
                                bgOpacity="0"
                                speed="2"
                                color="white"
                            />} Publier
                        </Button>
                    </form>
                    {displayImg && (
                        <img src={displayImg} alt="display image" className="rounded-xl object-cover max-h-100 min-h-100" />
                    )}
                </div>
            </div>
        </div>
    )
}