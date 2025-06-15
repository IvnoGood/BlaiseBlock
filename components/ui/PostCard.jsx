import Image from "next/image";
import { useEffect, useState } from "react";

export default function PostCard({ post, DeletePost, edit }) {

    const [isowner, setIsowner] = useState(false);

    useEffect(() => {
        const personnalUUID = JSON.parse(localStorage.getItem("UserData"))[0].identifier
        if (post.CreatorUUID == personnalUUID) {
            setIsowner(true)
        } else {
            setIsowner(false)
        }
    }, [])

    return (
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 overflow-hidden">
                        {post.CreatorProfilePicture ? (
                            <img src={post.CreatorProfilePicture} alt={post.CreatorUsername} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-600">{post.CreatorUsername}</span>
                        )}
                    </div>
                    <div>
                        <h4 className="font-medium text-white cursor-pointer hover:text-purple-500 transition-colors duration-400">{post.CreatorUsername}</h4>
                        <p className="text-white text-xs">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                </div>


                <h3 className="text-xl font-bold mb-2 text-white">{post.titre}</h3>
                <img src={post.picture} alt="image" width={300} height={300} className="w-full h-60 rounded-xl object-scale-down" />
                <p className="text-gray-300 mb-4 mt-2">{post.desc.substring(0, 150)}...</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                        <span key={tag} className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                            #{tag}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex space-x-4">
                        {/* <button className="flex items-center hover:text-purple-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {post.likes}
                        </button>
                        <button className="flex items-center hover:text-purple-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {post.comments}
                        </button> */}
                        {isowner && (
                            <>
                                <button className="flex items-center hover:text-purple-600" onClick={edit}>
                                    <span className="material-symbols-outlined !text-xl">
                                        edit_square
                                    </span>
                                </button>
                                <button className="flex items-center hover:text-purple-600" onClick={DeletePost}>
                                    <span className="material-symbols-outlined !text-xl">
                                        delete_forever
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                    <button className="hover:text-purple-600 cursor-pointer">Read more →</button>
                </div>
            </div>
        </div>
    );
}