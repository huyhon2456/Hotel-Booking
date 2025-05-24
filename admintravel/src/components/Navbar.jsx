import React from 'react'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-500 bg-white relative transition-all">

            <a href="/admin">
                <img className="h-9" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoColored.svg" alt="dummyLogoColored" />
            </a>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <button className="cursor-pointer px-8 py-2 bg-[var(--color-heavy)] hover:bg-[var(--color-primary)] transition text-[var(--color-four)] rounded-full font-[Rubik]">
                    Login
                </button>
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <button className="cursor-pointer px-6 py-2 mt-2 hover:bg-[var(--color-primary) bg-[var(--color-heavy)] transition text-[var(--color-four)] rounded-full text-sm font-[Rubik]">
                    Login
                </button>
            </div>

        </nav>
    )
}
export default Navbar
