import menuIcon from "../icons/barsIcon.svg";
import closeMenuIcon from "../icons/crossIcon.svg";
import { useEffect, useState } from "react";
import casaBuffaLogo from "../assets/imgs/casaBuffaText.jpg";
import type { CartItem } from "./CartComponent";
import { Link } from "react-router-dom";

type HeaderComponentProps = {
    handleClick: () => void;
    cart: CartItem[];
}

function HeaderComponent({ handleClick, cart }: HeaderComponentProps) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false); {/**Determinamos si el menú hamburguesa estará disponible */}
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); {/* Trabajamos con un booleano */}


    const openMenu = () => {
        if (isMobile === false) return;
        setMenuOpen(prev => !prev);
    }


    useEffect(()=>{
        const handleWindowResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            
            if(!mobile){
                setMenuOpen(false);
            }
        }
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    },[])

    return (
        <div className="h-17.5 w-screen fixed flex flex-row items-center justify-between px-6 bg-black shadow-md shadow-black/70 border-b border-white/10 text-white  z-30">
            
            {/* Capa de opacidad */}
            <div 
                className={`fixed inset-0 z-20 h-full w-full bg-[#0004] top-0 left-0 ${menuOpen ? " " : "hidden"}`}
                onClick={openMenu}>

            </div>
            
            {/* Title container */}
            <div className="flex flex-row justify-center items-center">
                {/* <img src={casaBuffaLogo} alt="Casa buffa" className="h-6"/> */}
                <Link to={`/`}>
                    <h2 className="uppercase text-[1.2rem]">Casa Buffa</h2>
                </Link>
            </div>
            
            {/* Buttons container */}
            <div className="flex flex-row ">
                
                <div className=" h-6 w-6 md:hidden invert">
                    <img 
                        src={menuIcon} 
                        alt="menuIcon"
                        onClick={openMenu}/>
                </div>

                <nav className={`absolute border border-[#666] bg-black h-screen w-80 left-0 top-0 transition-transform duration-600 ease-in-out flex flex-col  ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:static md:h-full md:w-full md:translate-x-0 md:transition-none md:flex md:items-center md:border-none z-50`}>

                    <div className="flex flex-col justify-center items-center mt-5 md:hidden ">
                        <img src={casaBuffaLogo} alt="Casa Buffa" className="h-28"/>
                        <div className="md:hidden invert absolute top-2 right-1" onClick={openMenu}>
                            <img src={closeMenuIcon} alt="crossIcon" className="w-5 h-5"/>
                        </div>
                    </div>

                    <div className="border-t border-[#666] flex flex-row mt-5 md:mt-0 md:border-none">
                        <ul className="px-5 md:px-0 md:flex md:flex-row md:w-full md:gap-3">
                            <li className="py-0 my-7.5 md:my-0 text-[1.2rem] border-l border-white md:border-none md:rounded-[25px] md:text-[1rem] md:hover:bg-[#FF8904] transition duration-300">
                                <Link to="/" className="block w-full h-full pl-2 md:px-5 md:py-1" onClick={openMenu}>
                                    Home
                                </Link>
                            </li>
                            <li className="py-0 my-7.5 md:my-0 text-[1.2rem] border-l border-white md:border-none md:rounded-[25px] md:text-[1rem] md:hover:bg-[#FF8904] transition duration-300">
                                <Link to="/catalog" className="block w-full h-full pl-2 md:px-5 md:py-1" onClick={openMenu}>
                                    Productos
                                </Link>
                            </li>
                            <li className="relative py-0 my-7.5 md:my-0 pl-2 text-[1.2rem] border-l border-white md:border-none md:px-5 md:py-1 md:rounded-[25px] md:text-[1rem] md:hover:bg-[#FF8904] select-none cursor-pointer transition duration-300" onClick={() => { handleClick(); if(isMobile) openMenu();}}>
                                Cart
                                <div className={`absolute w-3 h-3 bg-red-500/80 -top-1 right-0 flex justify-center items-center p-2 rounded-[50%] text-[.8rem] ${isMobile ? "hidden" : "absolute"} ${cart.length === 0 ? "hidden" : "absolute"}`}>{cart.length}</div> 
                            </li>
                        </ul>
                    </div>

                    
                </nav>
            </div>
        </div>
    )
}

export default HeaderComponent