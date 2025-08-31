import { Helix } from 'ldrs/react'
import 'ldrs/react/Helix.css'

export default function LoadingComponent({ Isloading }) {

    if (Isloading) {
        return (
            <div className="py-16 bg-gray-900 min-h-screen pt-20 flex flex-col gap-3 justify-center content-center items-center w-full">
                <Helix
                    size="60"
                    stroke="5"
                    bgOpacity="0"
                    speed="4"
                    color="#bb00ff"
                />
            </div>
        )
    }
}