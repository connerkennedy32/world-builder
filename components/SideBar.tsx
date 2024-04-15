'use client'

const SideBar = ({ }) => {
    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <button className="p-1.5 rounded-lg bg0gray-50 hover:bg-gray-100">Back</button>
                </div>
            </nav>
        </aside>
    )
}

export default SideBar;