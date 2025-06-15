'use client'
import React, { useEffect, useState } from "react";
import PostCard from '@/components/ui/PostCard';
import { PublishMenu } from '@/components/ui/PublishMenu';
import '@/components/css/Research.css'
import { supabase } from "@/components/supabase/supabaseClient";
import { EditPost } from '@/components/ui/EditPost';
import { motion, AnimatePresence } from "framer-motion";

export default function BlocRecherche() {
    const [prises, setPrises] = useState('');
    const [mouvements, setMouvements] = useState('');
    const [niveau, setNiveau] = useState(''); // research params
    const [addPostDp, setAddPostDp] = useState("none");
    const [posts, setPosts] = useState([]);
    const [more, setSeemore] = useState();

    const [editMenu, setEditMenu] = useState();

    function OnEdit(post) {
        if (!editMenu && post) {
            setEditMenu(<EditPost id={post.uuid} titre={post.titre} description={post.desc} image={post.picture} tag={post.tags} edit={OnEdit}></EditPost>)
        } else {
            setEditMenu(null)
        }
    }

    async function GetPosts() {
        const { data: postFetch, error: postFetchError } = await supabase.from("Posts").select('*')
        if (postFetchError) {
            console.log("postFetchError", postFetchError)
        }
        setPosts(postFetch)
        console.log(postFetch)
    }

    function CallCPublish() {
        addPostDp == "none" ? setAddPostDp("flex") : setAddPostDp("none")
    }

    async function DeletePost(uuid) {
        setPosts((prev) => prev.filter((p) => p.uuid !== uuid));
        const { data, error } = await supabase.from("Posts").delete().eq("uuid", uuid)
        if (error) {
            console.error("error", error)
        }
    }

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search);
        setPrises(queryParameters.get("prises"));
        setMouvements(queryParameters.get("mouvements"));
        setNiveau(queryParameters.get("niveau"));
        async function Fetch() {
            await GetPosts()
        }

        Fetch()
    }, []);

    return (
        <>

            <div className="py-16 bg-[#18181b] min-h-screen ResearchBody">

                <section className="pt-5 px-6 flex backdrop-brightness-50 w-full h-20 content-center filterSection gap-3">
                    <input type="text" />
                    <button className="py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition px-6 h-11 cursor-pointer" onClick={() => CallCPublish()}>Publier</button>
                    <button className="py-3 bg-red-600 hover:bg-red-700 text-white rounded transition px-6 h-11 cursor-pointer" onClick={() => GetPosts()}>Fetch ()</button>
                </section>

                <section className="mt-15 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        <PostCard post={post} DeletePost={() => DeletePost(post.uuid)} edit={() => OnEdit(post)} />
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
                <PublishMenu addPostDp={addPostDp} setAddPostDp={CallCPublish} fetch={GetPosts}></PublishMenu>
                {editMenu}
            </div>
        </>
    )
}