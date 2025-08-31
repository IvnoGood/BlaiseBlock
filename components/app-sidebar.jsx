'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation';
import { supabase } from '@/components/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingComponent from "./ui/loading";
import { Skeleton } from "@mui/material";
// Menu items.


export function AppSidebar() {
    let items = [
        {
            title: "Home",
            url: "/",
            icon: 'home',
            private: false
        },
        {
            title: "Profil",
            url: "/info",
            icon: 'person',
            private: true
        },
        {
            title: "Compte",
            url: "/private",
            icon: 'security',
            private: true
        },
        {
            title: "Publications",
            url: "/posts",
            icon: 'post',
            private: false
        },
        {
            title: "Statistiques",
            url: "/stats",
            icon: 'analytics',
            private: true
        },
    ]
    const pathname = usePathname();
    const pathnameArray = String(pathname).split('/')
    const slug = pathnameArray[2]
    const fin = pathnameArray[3] ? '/' + pathnameArray[3] : '/';
    const [isOwner, setIsOwner] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    async function checkPagePermissions() {
        const user = await supabase.auth.getUser();
        const userId = user.data.user.id;
        if (userId !== slug) {
            setIsOwner(false)
            setIsLoading(false)
            return
        }
        setIsOwner(true)
        setIsLoading(false)
    }

    useEffect(() => {
        async function fetch() {
            await checkPagePermissions()
        }
        fetch()
    }, [])


    return (
        <Sidebar>
            <SidebarHeader >
                <SidebarMenu>
                    <SidebarMenuItem className={'w-full'}>
                        <span className="text-center w-full">Paramètre de compte</span>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Profil</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {isLoading ? <SidebarMenuItem key={'title'}>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <Skeleton width={30} height={40} />
                                        <Skeleton height={32} width={'100 %'}>
                                            <span>Lorem ipsum dolor sit amet</span>
                                        </Skeleton>
                                    </div>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <Skeleton width={30} height={40} />
                                        <Skeleton height={32} width={'100 %'}>
                                            <span>Lorem ipsum dolor sit amet</span>
                                        </Skeleton>
                                    </div>
                                </SidebarMenuButton>
                                <SidebarMenuButton asChild>
                                    <div>
                                        <Skeleton width={30} height={40} />
                                        <Skeleton height={32} width={'100 %'}>
                                            <span>Lorem ipsum dolor sit amet</span>
                                        </Skeleton>
                                    </div>
                                </SidebarMenuButton>

                            </SidebarMenuItem> : items.filter(item => isOwner ? true : item.private === isOwner).map((item) =>
                            (<SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={fin === item.url}>
                                    <a href={'/users/' + slug + item.url}>
                                        <span className="material-symbols-outlined ">
                                            {item.icon}
                                        </span>
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>)

                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}