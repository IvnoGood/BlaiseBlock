import { Helix } from 'ldrs/react'
import 'ldrs/react/Helix.css'

export default function LoadingComponent({ Isloading }) {

    if (Isloading) {
        return (
            <div className=" bg-gray-900 flex-1 flex justify-center items-center">
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