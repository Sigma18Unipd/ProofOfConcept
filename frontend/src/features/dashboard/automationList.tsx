export function AutomationList() {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((id) => (
                <div key={id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-2">Automation {id}</h3>
                    <p className="text-gray-600 mb-4">Description for automation {id}.</p>
                    <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
                        View Details
                    </button>
                </div>
            ))}
        </div>
)}