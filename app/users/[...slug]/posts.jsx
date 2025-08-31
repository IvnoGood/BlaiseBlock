'use client'
import { supabase } from "@/components/supabase/supabaseClient"
import { useEffect, useState } from "react"
import PostCard from '@/components/ui/PostCard';
import { motion, AnimatePresence } from "framer-motion";
import LoadingComponent from "@/components/ui/loading";
import { Typography } from "@mui/material";

export default function PostsPage({ slug }) {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function getPosts() {
        const { data: postFetch, error: postFetchError } = await supabase
            .from("Posts")
            .select('*')
            .eq('CreatorUUID', slug)
        if (postFetchError) {
            console.log("postFetchError", postFetchError)
        } else {
            setPosts(postFetch)
        }
        console.log(postFetch)
    }

    useEffect(() => {
        async function fetch() {
            setIsLoading(true)
            await getPosts()
            setIsLoading(false)
        }
        fetch()
    }, [])

    if (isLoading) {
        return (
            <LoadingComponent Isloading={isLoading} />
        )
    }

    return (
        <div className=' bg-gray-900 flex-1 relative w-full h-full'>
            <section className="pt-5 px-6 flex w-full gap-3 flex-col lg:flex-col min-h-20">
                <Typography variant="h5" className="text-2xl">Publications de l'utilisateur</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full">
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
                                    <PostCard post={post} showControls={false} edit={() => OnEdit(post)} getPosts={getPosts} />
                                </motion.div>
                            )
                            )}
                        </AnimatePresence>
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <h3 className="text-xl font-medium text-gray-700">Aucune publication n'as été trouvée</h3>
                            <p className="text-gray-500 mt-2"> L'utilisateur n'as rien publié</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}