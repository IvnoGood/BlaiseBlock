import React, { useEffect, useState } from "react";


export function EditPost({ id, titre, description, image, tag, edit }) {

    const [title, setTitle] = useState(titre);
    const [descriptionPost, setDescription] = useState(description);
    const [imagePost, setImage] = useState('');
    const [dispimg, setDispimg] = useState(image);
    const [listOfTags, setListOfTags] = useState(tag);
    const [current, setTag] = useState('');


    function TagsOnchange(event) {
        const currentTag = event.target.value
        setTag(currentTag)
        if (currentTag != "placeholder") {
            setListOfTags([...listOfTags, currentTag.trim()]);
        }
    }

    function PublishPost() {
        i
    }

    return (
        <div>
            <div className="fixed flex inset-0 bg-[rgba(0,0,0,0.75)] items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
                    <div className="flex items-center mb-4">
                        <button onClick={() => edit()} className="cursor-pointer">
                            <span className="material-symbols-outlined mr-5 text-white">close</span>
                        </button>
                        <h1 className="text-2xl font-bold text-white">Modifier le post</h1>
                    </div>
                    <form action={() => PublishPost()}>
                           <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Titre du bloc"
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />

                        <input
                            type="text"
                            name="desc"
                            id="desc"
                            placeholder="Petite description"
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            value={descriptionPost}
                            onChange={(event) => setDescription(event.target.value)}
                            required
                        />

                        <input
                            type="file"
                            name="image"
                            id="image"
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <div className="flex content-center mb-2">
                            <img src={imagePost} alt="post image" className="h-128" />
                        </div>

                        <select
                            name="tags"
                            id="tags"
                            defaultValue={current}
                            onChange={(event) => TagsOnchange(event)}
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                            required
                        >
                            <option value="placeholder">--Prises--</option>
                            <option value="pinces">Pinces</option>
                            <option value="bacs">Bacs</option>
                            <option value="reglettes">Réglettes</option>
                            <option value="boules">Boules</option>

                            <option value="placeholder">--Mouvements--</option>
                            <option value="statique">Statique</option>
                            <option value="dynamique-balance">Dynamique balancé</option>

                            <option value="placeholder">--Difficultée--</option>
                            <option value="V5">V5</option>
                            <option value="V4">V4</option>
                            <option value="V3">V3</option>
                            <option value="V2">V2</option>
                            <option value="V1">V1</option>
                        </select>

                        <ul className="flex flex-wrap gap-2 mb-4">
                            {listOfTags.map((tag, index) => (
                                <li key={index} className="">
                                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded flex items-center">
                                        #{tag}

                                        <button onClick={() => { setListOfTags(listOfTags.filter((word) => word != tag)); }} className="text-gray-100 transition-colors hover:text-red-500 ml-2" >
                                            <span className="material-symbols-outlined !text-sm">close</span>
                                        </button>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded" type="submit">
                            Publier
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}