import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }) {
    return (
        <SidebarProvider className='relative z-0' defaultOpen>
            <AppSidebar />
            <main className="w-full relative pt-30 md:pt-20 bg-gray-900 flex flex-col min-h-screen">
                <SidebarTrigger className={' ml-5 z-10 bg-[rgba(0,0,0,0.5)]'} />
                {children}
            </main>
        </SidebarProvider>
    )
}