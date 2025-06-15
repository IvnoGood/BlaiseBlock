export default function FilterSection({ filters, setFilters }) {
    const categories = ["All", "Climbing", "Training", "Events", "Equipment"];
    const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

    return (
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={filters.difficulty}
                        onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    >
                        {difficulties.map(diff => (
                            <option key={diff} value={diff}>{diff}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setFilters({ search: "", category: "All", difficulty: "All" })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Reset filters
                </button>
                <span className="text-sm text-gray-500">
                    {filters.search || filters.category !== "All" || filters.difficulty !== "All" ? "Filters applied" : ""}
                </span>
            </div>
        </div>
    );
}