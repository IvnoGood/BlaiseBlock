'use client'
import LoadingComponent from "@/components/ui/loading"
import { useEffect, useState } from "react"

export default function ArticlesBlaise() {
    const [loading, setIsLoading] = useState(true);
    const [feed, setFeed] = useState(null); // State to store the feed data
    const [error, setError] = useState(null); // State to store any errors

    useEffect(() => {
        const fetchRSS = async () => {
            try {
                // Fetch from YOUR own API route
                const response = await fetch('/api/rss');

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const data = await response.json();
                //console.log(data); // You should now see the parsed feed in the console!
                setFeed(data);

            } catch (error) {
                console.error(error.message);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRSS();
    }, []); // Empty dependency array ensures this runs only once on mount

    if (loading) {
        return <LoadingComponent Isloading={loading} />;
    }

    if (error) {
        return <div className="text-red-500 text-center p-8">Erreur lors du chargement des articles: {error}</div>;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">{feed?.title}</h1>
                <p className="text-gray-400 mb-8">{feed?.description}</p>

                <div className="space-y-6">
                    {feed?.items?.map((item) => (
                        <a
                            key={item.guid || item.link}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
                        >
                            <h2 className="text-xl font-semibold text-accent mb-2">{item.title}</h2>
                            <p className="text-gray-300 text-sm mb-3">Publié le: {new Date(item.isoDate).toLocaleDateString('fr-FR')}</p>
                            <p className="text-gray-400">{item.contentSnippet?.substring(0, 150)}...</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}