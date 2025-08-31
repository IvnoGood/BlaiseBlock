'use client'
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { use } from 'react'
import { useParams } from 'next/navigation';
import ReactDOM from "react-dom";
import PostTag from '@/components/ui/PostTag';
import { supabase } from '@/components/supabase/supabaseClient';
import LoadingComponent from '@/components/ui/loading';
import { useWindowDimensions } from '@/components/hooks/viewportDimensions'
import { Button } from '@/components/ui/button';
/*
{
    "created_at": "2025-06-14T10:35:36.707407+00:00",
    "uuid": "c0f7b126-9abc-4933-9b07-3361811b1f02",
    "titre": "15151",
    "desc": "15151",
    "tags": [
        "dynamique-balance",
        "V3",
        "V1"
    ],
    "picture": "https://xgeflbfcefzgemkumzzh.supabase.co/storage/v1/object/public/postpictures/public/c0f7b126-9abc-4933-9b07-3361811b1f02.jpg",
    "CreatorUUID": "6a560a9b-cfb9-4ec5-b4fb-e3e15d6cd8bc",
    "CreatorUsername": "bob",
    "CreatorProfilePicture": null,
    "likes": 0,
    "likes_user": null
}
*/


export default function Page({ params }) {
    const [isLoading, setIsLoading] = useState(true)
    const [postData, setPostData] = useState()
    const { height, width } = useWindowDimensions();
    const { slug } = use(params)
    const [titleSize, setTitleSize] = useState('h1')
    const [zoomMenu, setZoomMenu] = useState(false)

    useEffect(() => {
        async function getData() {
            setIsLoading(true)
            const { data, error } = await supabase.from('Posts').select('*').eq('uuid', slug)

            if (error) {
                console.error('Error happened while fetching post info', error)
            }
            setPostData(data[0])
            setIsLoading(false)
        }
        getData()
    }, [])

    useState(() => {

        if (width < 650) {
            <Typography className='text-wrap' variant="h3" component="h3" style={{ fontWeight: 600 }}>
                Un bloc tres amusant
            </Typography>
        } else {
            <Typography className='text-wrap' variant="h1" component="h1" style={{ fontWeight: 600 }}>
                Un bloc tres amusant
            </Typography>
        }

    }, [width])

    if (isLoading) {
        return (
            <div className="lg:p-16 pt-18 bg-gray-900 min-h-screen max-w-screen overflow-x-hidden">
                <article>
                    <section className='flex flex-col lg:flex-row justify-between gap-10 py-10 p-8 sm:content-center xl:max-w-full'>

                        <div className='content-center xl:w-full'>
                            <Skeleton className='min-h-200 rounded-b-xl md:min-w-120 xl:min-w-full xl:h-full object-cover'></Skeleton>
                        </div>

                        <div className='gap-6 content-center w-full'>
                            <div className='flex flex-col content-center'>
                                <Skeleton >
                                    <Typography variant="h2" component="h2">
                                        Bloc
                                    </Typography>
                                </Skeleton>

                                <div className="flex flex-wrap gap-2 mb-4 align-middle">
                                    <Skeleton height={75} width={100}>
                                        <PostTag fontSize={'larger'}>
                                            #bloc
                                        </PostTag>
                                    </Skeleton>
                                    <Skeleton height={75} width={100}>
                                        <PostTag fontSize={'larger'}>
                                            #bloc
                                        </PostTag>
                                    </Skeleton>
                                    <Skeleton height={75} width={100}>
                                        <PostTag fontSize={'larger'}>
                                            #bloc
                                        </PostTag>
                                    </Skeleton>

                                </div>
                            </div>
                            <div>
                                {/*Title and desc*/}
                                <Skeleton className='w-full xl:w-200'>
                                    {width < 650 ? <Typography className='text-wrap' variant="h3" component="h3" style={{ fontWeight: 600 }}>
                                        Un bloc tres amusant
                                    </Typography> : <Typography className='text-wrap' variant="h1" component="h1" style={{ fontWeight: 600 }}>
                                        Un bloc tres amusant
                                    </Typography>}

                                </Skeleton>
                                <Skeleton className='w-full'>
                                    <p className='text-wrap max-w-screen'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet autem magni repellendus
                                    </p>
                                </Skeleton>
                                <Skeleton className='w-full'>
                                    <p className='text-wrap max-w-screen'>
                                        voluptatum doloribus optio porro et eveniet veritatis esse quam assumenda sapiente
                                    </p>
                                </Skeleton>
                                <Skeleton className='w-full'>
                                    <p className='text-wrap max-w-screen'>
                                        reprehenderit ,ad sed ut eligendi officia odio.
                                    </p>
                                </Skeleton>
                            </div>
                        </div>
                    </section>
                    {/*  <section>
                    <div>
                        <Typography variant="h4" component="h4">
                            Comment faire ?
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="h4" component="h4">
                            Astuces du créateur
                        </Typography>
                    </div>
                </section> */}
                </article>
            </div>
        )
    }

    return (
        <div className="lg:p-16 pt-18 bg-gray-900 min-h-screen max-w-screen overflow-x-hidden">
            <article>
                <section className='flex flex-col lg:flex-row justify-between gap-10 py-10 p-8 sm:content-center xl:max-w-full min-h-screen items-center'>

                    <div className='content-center xl:w-full h-fit relative'>
                        <img className='rounded-xl md:min-w-100 xl:min-w-full h-150 object-cover' src={postData.picture} alt="post picture" />
                        <Button className=' hover:opacity-100 bg-[rgba(0,0,0,0)] opacity-0 transition absolute w-full h-full top-0 left-0 rounded-xl flex items-center justify-center' onClick={() => { setZoomMenu((prev) => !prev); }}>
                            <span className="material-symbols-outlined !text-9xl">
                                search
                            </span>
                        </Button>
                    </div>

                    <div className='gap-6 content-center w-full h-fit'>
                        <div className='flex flex-col content-center'>
                            <Typography variant="h2" component="h2">
                                Bloc
                            </Typography>

                            <div className="flex flex-wrap gap-2 mb-4 align-middle">
                                {postData.tags.map(tag => (
                                    <PostTag key={tag} fontSize={'larger'}>
                                        #{tag}
                                    </PostTag>
                                ))}
                            </div>
                        </div>
                        <div>
                            {/*Title and desc*/}
                            {width < 800 ? <Typography className='text-wrap' variant="h3" component="h3" style={{ fontWeight: 600 }}>
                                {postData.titre}
                            </Typography> : <Typography className='text-wrap' variant="h1" component="h1" style={{ fontWeight: 600 }}>
                                {postData.titre}
                            </Typography>}
                            <p className='text-wrap max-w-screen'>
                                {postData.desc}
                            </p>
                        </div>
                    </div>
                </section>
                {/*  <section>
            <div>
                <Typography variant="h4" component="h4">
                    Comment faire ?
                </Typography>
            </div>
            <div>
                <Typography variant="h4" component="h4">
                    Astuces du créateur
                </Typography>
            </div>
        </section> */}
            </article>
            <div className='absolute top-0 left-0 h-[80%] w-full px-8 py-8 pt-30 overflow-hidden justify-center content-center bg-card-foreground transition' style={{ height: height, opacity: zoomMenu ? 100 : 0, display: zoomMenu ? 'flex' : 'none' }}>
                <div className='relative'>
                    <img src={postData.picture} className=' rounded-2xl object-cover h-full' alt="Post picture" />
                    <Button onClick={() => setZoomMenu((prev) => !prev)} className={'absolute top-5 left-5 rounded-full w-9 transition-[width] duration-400 ease-in-out hover:[&_p]:flex hover:[&_p]:opacity-100 hover:w-30 overflow-hidden'}>
                        <span className="material-symbols-outlined !text-2xl">
                            close
                        </span>
                        <p className='hidden opacity-0 transition'>Fermer</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}

/*
        <div className="py-16 pt-18 bg-gray-900 min-h-screen max-w-screen overflow-hidden">
            <article>
                <section className='flex flex-wrap justify-between md:px-30 sm:px-10 gap-10 py-10 sm:content-center' style={{ height: width > 1075 ? height - 72 : 'fit-content' }}>
                    <div className='content-center justify-center flex-1/3'>
                        <img className=' rounded-sm object-cover' src={postData.picture} alt="" />
                    </div>

                    <div className='gap-6 flex-1/2 min-w-125 max-w-screen'>
                        <div className='flex flex-col flex-wrap'>
                            <Typography variant="h2" component="h2">
                                Bloc
                            </Typography>
                            <div className="flex flex-wrap gap-2 mb-4 align-middle">
                                {postData.tags.map(tag => (
                                    <PostTag key={tag} fontSize={'larger'}>
                                        #{tag}
                                    </PostTag>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Typography variant="h1" component="h1" className='text-wrap max-w-screen' style={{ fontWeight: 600 }}>
                                {postData.titre}
                            </Typography>
                            <p className='text-wrap max-w-screen'>{postData.desc}</p>
                        </div>
                    </div>
                </section>
                </article >
                </div>
*/