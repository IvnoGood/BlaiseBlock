'use client'
import React, { useEffect, useState } from "react";
import PostCard from '@/components/ui/PostCard';
import { PublishMenu } from '@/components/ui/PublishMenu';
import { supabase } from "@/components/supabase/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"
import LoadingComponent from "@/components/ui/loading";
import PostFilters, { FormSchema, pushRoute } from "@/components/ui/PostFilters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useWindowDimensions } from "@/components/hooks/viewportDimensions";

export default function BlocRecherche() {
    const [prises, setPrises] = useState(null);
    const [mouvements, setMouvements] = useState(null);
    const [niveau, setNiveau] = useState(null);

    const [addPostDp, setAddPostDp] = useState("none");
    const [posts, setPosts] = useState([]);
    const [more, setSeemore] = useState();
    const [seeFilters, setSeeFilters] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const [editData, setEditData] = useState([]);
    const [isEdit, setIsEdit] = useState(false)

    const router = useRouter()
    const { height, width } = useWindowDimensions();
    const form = useForm({
        resolver: zodResolver(FormSchema),
    })

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const onSubmit = async (data) => {
        router.push(pushRoute(data))
        setIsLoading(true)
        await GetPosts()
        getPageParams()
        setIsLoading(false)
    }
    const onClear = async () => {
        router.push('/bloc')
        setIsLoading(true)
        await GetPosts()
        getPageParams()
        setIsLoading(false)
    }

    const getPageParams = () => {
        const queryParameters = new URLSearchParams(window.location.search);
        setPrises(queryParameters.get("prises"));
        setMouvements(queryParameters.get("mouvements"));
        setNiveau(queryParameters.get("difficulte"));
    }

    function OnEdit(post) {
        window.scrollTo({
            top: 0,
        });
        setEditData({
            'title': post.titre,
            'description': post.desc,
            'avatarFile': post.picture,
            'listOfTags': [...post.tags],
            'uuid': post.uuid
        })
        setIsEdit(true)
        document.getElementById('html-root').style.overflow = 'hidden'
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
    const filterPosts = (tags) => {
        let result = false

        if (prises === null && mouvements === null && niveau === null) {
            result = true
        }
        if (prises !== null) {
            result = tags.filter(item => item === prises).length > 0
        }
        if (mouvements !== null) {
            result = tags.filter(item => item === mouvements).length > 0
        }
        if (niveau !== null) {
            result = tags.filter(item => item === niveau).length > 0
        }
        return result
    }

    useEffect(() => {
        setIsLoading(true)
        async function Fetch() {
            getPageParams()
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
            <div className="lg:py-16 pt-25 bg-gray-900 min-h-screen relative">

                <section className="pt-5 px-6 flex w-full gap-3 flex-col lg:flex-row min-h-20">
                    <div className={seeFilters ? 'flex lg:w-fit' : 'hidden'}>
                        <Form {...form}>
                            <form className="flex flex-col w-full gap-5 lg:flex-row" onSubmit={form.handleSubmit(onSubmit)}>
                                <PostFilters form={form} />
                                <Button type='submit' variant="secondary">
                                    <span className="material-symbols-outlined !text-xl">
                                        search
                                    </span>
                                    Chercher
                                </Button>
                                {prises !== null || mouvements !== null || niveau !== null ? <Button variant={'outline'} onClick={() => onClear()}>
                                    <span className="material-symbols-outlined">
                                        clear_all
                                    </span>
                                    Clear filters
                                </Button> : <></>}
                            </form>
                        </Form>
                    </div>
                    <Button variant={'outline'} onClick={() => setSeeFilters((prev) => !prev)}>
                        <span className="material-symbols-outlined">
                            {seeFilters ? ' filter_alt_off' : 'filter_alt'}
                        </span>
                        {seeFilters ? 'Fermer' : 'Ouvrir'}
                        &nbsp;les filtres
                    </Button>
                    <Button onClick={CallCPublish}>
                        <span className="material-symbols-outlined !text-xl">
                            add
                        </span>Publier</Button>
                </section>

                <section className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {posts.length > 0 && posts.filter((item) => filterPosts(item.tags)).length > 0 ? (
                            <AnimatePresence>
                                {posts.map(post =>
                                    filterPosts(post.tags) && (
                                        <motion.div
                                            key={post.uuid}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {filterPosts(post.tags) && <PostCard post={post} edit={() => OnEdit(post)} getPosts={GetPosts} />}
                                        </motion.div>
                                    )
                                )}
                            </AnimatePresence>
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <h3 className="text-xl font-medium text-gray-700">Aucune publication n'as été trouvée</h3>
                                <p className="text-gray-500 mt-2">{prises !== null || mouvements !== null || niveau !== null ? "Essaie d'ajuster les filtres" : 'Aucune publication existe pour le moment'}</p>
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