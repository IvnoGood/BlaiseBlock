// app/about/page.jsx
'use client';

export default function AboutPage() {
    return (
        <main className="bg-gray-900 text-white px-6 py-12 pt-20">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Title */}
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-green-500 mb-4">À propos du projet</h1>
                    <p className="text-lg text-gray-300">
                        Bienvenue sur <span className="text-white font-semibold">Blaise Pascal Bloc</span>, une plateforme dédiée à la communauté des grimpeurs passionnés de blocs autour du lycée Blaise Pascal.
                    </p>
                </section>

                {/* Project Purpose */}
                <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-2 text-purple-400">Pourquoi ce projet ?</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Ce projet est né d’un besoin : rendre la grimpe plus accessible, mieux organisée, et plus collaborative pour les élèves et amateurs. Il permet de :
                    </p>
                    <ul className="list-disc list-inside mt-4 text-gray-300 space-y-1">
                        <li>Référencer des blocs disponibles autour de l’établissement.</li>
                        <li>Partager ses propres créations de blocs.</li>
                        <li>Découvrir des cartes interactives et détaillées des zones d’escalade.</li>
                    </ul>
                </section>

                {/* Technologies */}
                <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-400">Technologies utilisées</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Le projet est conçu avec les dernières technologies web modernes :
                    </p>
                    <ul className="list-disc list-inside mt-4 text-gray-300 space-y-1">
                        <li><span className="font-semibold text-white">Next.js</span> – framework React pour les applications rapides et performantes.</li>
                        <li><span className="font-semibold text-white">Tailwind CSS</span> – pour une conception moderne et réactive.</li>
                        <li><span className="font-semibold text-white">Vercel</span> – pour le déploiement continu et l’hébergement.</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}
