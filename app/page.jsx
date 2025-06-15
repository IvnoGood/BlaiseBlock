import "@/components/css/landing.css"
import Image from "next/image"
import { Inknut_Antiqua } from 'next/font/google';

const inknutAntiqua = Inknut_Antiqua({
  subsets: ['latin'],
  weight: ['400', '700'], // or any weight you need
});

export default function BouldersPage() {
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


  

  return (
    <>
      <section className="h-screen landingsection">
        <div className="flex items-end flex-col absolute z-1">
          <h1 className={`${inknutAntiqua.className} landingTitle`}>Blaise Pascal Bloc</h1>
          <p className={`${inknutAntiqua.className} text-white text-xl`}>Reference Bloc</p>
        </div>
      </section>

      <section className="bg-[#0d0d0d] text-white font-sans min-h-screen overflow-hidden">
        <div className="pt-12 min-h-screen flex flex-col align-end">
          <h1 className="text-4xl font-bold mb-8 text-center capitalize">échelle De difficultée</h1>

          <div className="relative ml-auto flex flex-col gap-16 my-auto items-end">
            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V5</p>
              <span className="difficultybarLanding bg-red-600 w-[30vw]">Expert</span>
            </div>

            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V4</p>
              <span className="difficultybarLanding bg-[#FF4400] w-[40vw]">Dur</span>
            </div>

            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V3</p>
              <span className="difficultybarLanding bg-[#FF8800] w-[50vw]">Confirmé</span>
            </div>

            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V2</p>
              <span className="difficultybarLanding bg-[#FFEA00] w-[60vw]">Intermédiaire</span>
            </div>

            <div className="flex flex-row items-center">
              <p className="text-2xl font-bold mr-10">V1</p>
              <span className="difficultybarLanding bg-[#00FF2F] w-[70vw]">Facile</span>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#0d0d0d] text-white font-sans min-h-screen overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Blocs a la une</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
            {bouldersLarge.map((boulder, idx) => (
              <div key={idx} className="bg-[#1a1a1a] rounded-2xl shadow-md p-6 hover:shadow-lg transition max-w-100">
                <Image src={boulder.image} alt="boulderImage" className="rounded-2xl hidden md:block" width={304} height={380} />
                <div>
                  <h2 className="text-2xl font-semibold mb-2 rounded-2xl">{boulder.name}</h2>
                  <p className="text-gray-400">Grade: {boulder.grade}</p>
                  <p className="text-gray-50  0 text-sm">Location: {boulder.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boulders.map((boulder, idx) => (
              <div key={idx} className="bg-[#1a1a1a] rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                <h2 className="text-2xl font-semibold mb-2">{boulder.name}</h2>
                <p className="text-gray-400">Grade: {boulder.grade}</p>
                <p className="text-gray-50  0 text-sm">Location: {boulder.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d0d0d] py-20 px-25">
        <div className="text-center">
          <div className="flex flex-row justify-center">
            <Image
              src="/images/schema.PNG"
              alt="Bouldering action"
              className="rounded-2xl shadow-lg"
              width={600}
              height={300}
            />
            <div>
              <form action="/bloc" className="flex flex-col gap-5 ml-15 p-3">

                <div className="flex items-center gap-5">
                  <label htmlFor="niveau" className="block mb-2 text-sm font-medium text-gray-300">
                    Types de prises:
                  </label>
                  <select name="prises" id="prises" className="text-white rounded-2xl border-1 bg-[#1a1a1a] h-10 border-gray-700">
                    <option value="pinces">Pinces</option>
                    <option value="bacs">Bacs</option>
                    <option value="reglettes">Réglettes</option>
                    <option value="boules">Boules</option>
                  </select>
                </div>

                <div className="flex items-center gap-5">
                  <label htmlFor="niveau" className="block mb-2 text-sm font-medium text-gray-300">
                    Types de mouvements:
                  </label>
                  <select name="mouvements" id="mouvements" className="text-white rounded-2xl border-1 bg-[#1a1a1a] h-10 border-gray-700">
                    <option value="statique">Statique</option>
                    <option value="dynamique-balance">Dynamique balancé</option>
                  </select>
                </div>

                <div className="flex items-center gap-5">
                  <label htmlFor="niveau" className="block mb-2 text-sm font-medium text-gray-300">
                    Niveau de difficulté:
                  </label>
                  <select name="niveau" id="niveau" className="text-white rounded-2xl border-1 bg-[#1a1a1a] h-10 border-gray-700 w-30">
                    <option value="V5">V5</option>
                    <option value="V4">V4</option>
                    <option value="V3">V3</option>
                    <option value="V2">V2</option>
                    <option value="V1">V1</option>
                  </select>
                </div>
                <button type="submit">test</button>
              </form>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition">
              Start Climbing
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full transition">
              View Map
            </button>
          </div>
        </div>
      </section >


    </>
  );
}
