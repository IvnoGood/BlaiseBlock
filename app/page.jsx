'use client'
import "@/components/css/landing.css"
import Image from "next/image"
import { Inknut_Antiqua } from 'next/font/google';
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/ui/loading";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
} from "@/components/ui/form"
import Link from "next/link";
import { useRouter } from 'next/navigation'
import PostFilters, { FormSchema, pushRoute } from "@/components/ui/PostFilters";
import { supabase } from "@/components/supabase/supabaseClient";
import PostCard from '@/components/ui/PostCard';
import { useWindowDimensions } from "@/components/hooks/viewportDimensions";
import Typography from '@mui/material/Typography';


const inknutAntiqua = Inknut_Antiqua({
  subsets: ['latin'],
  weight: ['400', '700'], // or any weight you need
});

const boulders = [
  { name: "Moon Slab", grade: "V2", location: "Yosemite", image: "/images/bloc.webp" },
  { name: "Iron Cross", grade: "V5", location: "Hueco Tanks", image: "/images/bloc.webp" },
  { name: "Midnight Lightning", grade: "V8", location: "Camp 4", image: "/images/bloc.webp" },

];
const bouldersLarge = [
  { name: "Moon Slab", grade: "V2", location: "Yosemite", image: "/images/bloc.webp" },
  { name: "Iron Cross", grade: "V5", location: "Hueco Tanks", image: "/images/bloc.webp" },
  { name: "Midnight Lightning", grade: "V8", location: "Camp 4", image: "/images/bloc.webp" },
];

const FILTERS = [
  {
    label: 'Types de prises:',
    key: 'prises',
    placeholder: 'Séléctionne un type de prises',
    values: [
      { value: 'pinces', display: 'Pinces' },
      { value: 'bacs', display: 'Bacs' },
      { value: 'reglettes', display: 'Réglettes' },
      { value: 'boules', display: 'Boules' },
    ]
  },
  {
    label: 'Types de mouvements:',
    key: 'mouvements',
    placeholder: 'Séléctionne un type de mouvements',
    values: [
      { value: 'statique', display: 'Statique' },
      { value: 'dynamique', display: 'Dynamique' }
    ]
  },
  {
    label: 'Niveau de difficulté:',
    key: 'difficulte',
    placeholder: 'Séléctionne un type de difficultées',
    values: [
      { value: 'V5', display: 'V5' },
      { value: 'V4', display: 'V4' },
      { value: 'V3', display: 'V3' },
      { value: 'V2', display: 'V2' },
      { value: 'V1', display: 'V1' }
    ]
  }
]




export default function BouldersPage() {
  const [Isloading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const router = useRouter()
  const { height, width } = useWindowDimensions();
  const form = useForm({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = (data) => {
    router.push(pushRoute(data))
  }

  async function GetPosts() {
    let limit = 3
    if (window.innerWidth > 1024) { limit = 3 } else { limit = 2 }
    const { data: postFetch, error: postFetchError } = await supabase.from("Posts").select('*').order('likes', { ascending: false }).limit(limit)
    if (postFetchError) {
      console.log("postFetchError", postFetchError)
    }
    setPosts(postFetch)
  }

  useEffect(() => {
    async function fetch() {
      setIsLoading(true)
      await GetPosts()
      setIsLoading(false)
    }
    fetch()
  }, [])

  if (Isloading) {
    return (
      <LoadingComponent Isloading={Isloading} />
    )
  }

  return (
    <div className="w-full">
      <section className="h-screen landingsection w-full">
        <div className="flex items-center flex-col absolute z-1 w-full">
          <div>
            <h1 className={`${inknutAntiqua.className} text-4xl sm:text-5xl md:text-6xl xl:text-8xl`}>Blaise Pascal Bloc</h1>
            <p className={`${inknutAntiqua.className} text-white text-sm sm:text-xl`}>Reference Bloc</p>
          </div>
        </div>
        <div className="landingSectionBackground"></div>
      </section>

      <section className="bg-gray-900 text-white font-sans min-h-screen overflow-hidden">
        <div className="pt-12 min-h-screen flex flex-col align-end">
          <h1 className="text-4xl font-bold mb-8 text-center capitalize">échelle De difficultée</h1>

          <div className="relative ml-auto flex flex-col gap-16 my-auto items-end">
            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V5</p>
              <span className="difficultybarLanding bg-purple-800 w-[30vw]">Expert</span>
            </div>

            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V4</p>
              <span className="difficultybarLanding bg-purple-700 w-[40vw]">Dur</span>
            </div>

            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V3</p>
              <span className="difficultybarLanding bg-purple-600 w-[50vw]">Confirmé</span>
            </div>

            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V2</p>
              <span className="difficultybarLanding bg-purple-500 w-[60vw]">Intermédiaire</span>
            </div>

            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V1</p>
              <span className="difficultybarLanding bg-purple-300 w-[70vw]">Facile</span>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-gray-900 text-white font-sans min-h-screen overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Nos blocs les plus aimés</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
            {posts.length > 0 ? (
              <AnimatePresence>
                {posts.map(post =>
                  <motion.div
                    key={post.uuid}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PostCard post={post} edit={() => OnEdit(post)} />
                  </motion.div>
                )
                }
              </AnimatePresence>
            ) : (
              <div className="col-span-full text-center py-10">
                <h3 className="text-xl font-medium text-gray-700">Aucune publication n'as été trouvée</h3>
                <p className="text-gray-500 mt-2"> Aucune publication existe pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="bg-gray-900">
        <h1 className="text-4xl font-bold mb-8 text-center">Chercher un bloc</h1>
        <Form {...form}>
          <form className="px-10 pb-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col lg:flex-row justify-center gap-10 lg:gap-20 px-20">
              <div className="flex flex-1/2 justify-center">
                <Image
                  src="/images/schema.PNG"
                  alt="Bouldering action"
                  className="rounded-2xl shadow-lg"
                  width={600}
                  height={300}
                  useMap="#room"
                />
                {/*  <map name="room">
                  <area color="red" shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm" />
                  <area shape="rect" coords="290,172,333,250" alt="Phone" href="phone.htm" />
                  <area shape="circle" coords="337,300,44" alt="Coffee" href="coffee.htm" />
                </map> */}
              </div>
              <div className="flex flex-col w-full gap-5 justify-center flex-1/2 lg:*:flex" >
                <PostFilters form={form} />
              </div>
            </div>
            <div className="mt-6 flex flex-col lg:flex-row justify-center gap-4">
              <Button type="submit"><span className="material-symbols-outlined">
                elevation
              </span>Start Climbing</Button>
              <Button><span className="material-symbols-outlined">
                map
              </span>View Map</Button>
            </div>
          </form>
        </Form>
      </section>


    </div >
  );
}
