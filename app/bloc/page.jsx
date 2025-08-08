'use client'
import React, { useEffect, useState } from "react";
import PostCard from '@/components/ui/PostCard';
import { PublishMenu } from '@/components/ui/PublishMenu';
import { supabase } from "@/components/supabase/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"
import LoadingComponent from "@/components/ui/loading";

export default function BlocRecherche() {
    const [prises, setPrises] = useState('');
    const [mouvements, setMouvements] = useState('');
    const [niveau, setNiveau] = useState(''); // research params
    const [addPostDp, setAddPostDp] = useState("none");
    const [posts, setPosts] = useState([]);
    const [more, setSeemore] = useState();

    const [isLoading, setIsLoading] = useState(true)

    const [editData, setEditData] = useState([]);
    const [isEdit, setIsEdit] = useState(false)

    function OnEdit(post) {
        setEditData({
            'title': post.titre,
            'description': post.desc,
            'avatarFile': post.picture,
            'listOfTags': [...post.tags],
            'uuid': post.uuid
        })
        setIsEdit(true)
        setAddPostDp('flex')
    }

    async function GetPosts() {
        const { data: postFetch, error: postFetchError } = await supabase.from("Posts").select('*')
        if (postFetchError) {
            console.log("postFetchError", postFetchError)
        }
        setPosts(postFetch)
    }

    function CallCPublish() {
        //addPostDp == "none" ? setAddPostDp("flex") : setAddPostDp("none");
        if (addPostDp == "none") {
            setAddPostDp("flex");
            document.getElementById('html-root').style.overflow = 'hidden'
        } else {
            setAddPostDp("none");
            document.getElementById('html-root').style.overflow = 'auto'
        }
    }

    useEffect(() => {
        setIsLoading(true)
        async function Fetch() {
            const queryParameters = new URLSearchParams(window.location.search);
            setPrises(queryParameters.get("prises"));
            setMouvements(queryParameters.get("mouvements"));
            setNiveau(queryParameters.get("niveau"));
            await GetPosts()
            setIsLoading(false)
        }

        Fetch()
    }, []);

    if (isLoading) {
        return (
            <LoadingComponent Isloading={isLoading} />
        )
    }
    return (
        <>

            <div className="py-16 bg-gray-900 min-h-screen">

                <section className="pt-5 px-6 flex w-full h-20 gap-3">
                    <Button className={'ml-auto'} onClick={CallCPublish}>
                        <span className="material-symbols-outlined !text-xl">
                            add
                        </span>Publier</Button>
                </section>

                <section className="mt-15 p-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {posts.length > 0 ? (
                            <AnimatePresence>
                                {posts.map(post => (
                                    <motion.div
                                        key={post.uuid}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <PostCard post={post} edit={() => OnEdit(post)} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <h3 className="text-xl font-medium text-gray-700">No posts found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                </section>
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PublishMenu addPostDp={addPostDp} setAddPostDp={CallCPublish} fetch={GetPosts} postData={editData} isOnEdit={isEdit} setEditMode={setIsEdit} setEditData={setEditData} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    )
}