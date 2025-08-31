"use client"
import { useEffect, useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { supabase } from "@/components/supabase/supabaseClient"
import LoadingComponent from "@/components/ui/loading"
import { useRouter } from "next/navigation"

export const description = "An interactive area chart"

const chartConfig = {
    likesCount: {
        label: "Likes",
        color: "var(--chart-2)",
    },
}
export default function StatsPage({ slug }) {

    const [timeRange, setTimeRange] = useState("90d")
    const [selectedPost, setSelectedPost] = useState("")
    const [postsList, setPostsList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filteredValue, setFilteredValue] = useState([])
    const router = useRouter()

    async function checkPagePermissions() {
        const user = await supabase.auth.getUser();
        const userId = user.data.user.id;
        if (userId !== slug) {
            router.push(`users/${slug}/`)
            return
        }
        setIsLoading(false)
    }

    async function getPosts() {
        const { data: postFetch, error: postFetchError } = await supabase
            .from("Posts")
            .select('*')
            .eq('CreatorUUID', slug)
        if (postFetchError) {
            console.log("postFetchError", postFetchError)
        } else {
            setPostsList(postFetch)
        }
    }

    useEffect(() => {
        if (selectedPost) {
            const selectedPostData = () => { return postsList.filter((post) => post.titre === selectedPost) }
            if (selectedPostData()[0].likes === 0) { setFilteredValue([{ "time": new Date(), "likesCount": 0 }]); return }
            const result = selectedPostData()[0].likes_stats
            const filteredData = result.filter((item) => {
                const date = new Date(item.time)
                const referenceDate = new Date()
                let daysToSubtract = 90
                if (timeRange === "30d") {
                    daysToSubtract = 30
                } else if (timeRange === "7d") {
                    daysToSubtract = 7
                }
                const startDate = new Date(referenceDate)
                startDate.setDate(startDate.getDate() - daysToSubtract)
                console
                return date >= startDate
            })
            filteredData.sort((a, b) => new Date(a.time) - new Date(b.time));
            setFilteredValue(filteredData)
        }
    }, [selectedPost, postsList])

    useMemo(() => {
        async function fetch() {
            setIsLoading(true)
            await getPosts()
            await checkPagePermissions()
        }
        fetch()
    }, [])

    if (isLoading) {
        return (
            <LoadingComponent Isloading={isLoading} />
        )
    }

    return (
        <div className=' bg-gray-900 flex-1 relative w-full'>
            <section className="pt-5 px-6 flex flex-col w-full gap-3">
                <div className="flex md:items-center gap-3 flex-col md:flex-row">
                    <p>Sélectionne une de tes publications pour voir les statistiques associées</p>
                    <Select value={selectedPost} onValueChange={setSelectedPost}>
                        <SelectTrigger>
                            <SelectValue placeholder="Séléctionne une publication" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Publications</SelectLabel>
                                {postsList.map(post => (
                                    <SelectItem key={post.titre} value={post.titre}>{post.titre}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {selectedPost &&
                    <Card className="pt-0">
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1">
                                <CardTitle>Nombres de favoris</CardTitle>
                                <CardDescription>
                                    Le nombre de favoris dans les {timeRange === '90d' ? '3 derniers mois' : timeRange === '30d' ? '30 derniers jours' : '7 derniers jours'} dans la publication <span className="font-bold">{selectedPost}</span>
                                </CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger
                                    className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                                    aria-label="Select a value"
                                >
                                    <SelectValue placeholder="Last 3 months" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="90d" className="rounded-lg">
                                        3 derniers mois
                                    </SelectItem>
                                    <SelectItem value="30d" className="rounded-lg">
                                        30 derniers jours
                                    </SelectItem>
                                    <SelectItem value="7d" className="rounded-lg">
                                        7 derniers jours
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-[250px] w-full"
                            >
                                <AreaChart data={filteredValue}>
                                    <defs>
                                        <linearGradient id="fillLikesCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="var(--color-likesCount)"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--color-likesCount)"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(value) => {
                                                    return new Date(value).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                }}
                                                indicator="dot"
                                            />
                                        }
                                    />
                                    <Area
                                        dataKey="likesCount"
                                        type="natural"
                                        fill="url(#fillLikesCount)"
                                        stroke="var(--color-likesCount)"
                                        stackId="a"
                                    />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>}
            </section>
        </div>
    )
}