// import React from 'react'
import instagramIcon from "../icons/instagramIcon.svg";
import facebookIcon from "../icons/facebookIcon.svg";
import MapsComponent from "./MapsComponent";


function FooterComponent() {
    return (
        <div className='bg-[#FF8904] text-white w-full z-20 py-5 flex flex-col md:justify-around justify-center items-center'>
            
            <div className="my-5 md:w-4xl flex flex-row justify-center">
                <MapsComponent></MapsComponent>
            </div>
            <div className="w-full lg:w-4xl px-5">
                <p className='text-[1rem]'>Ameghino 254 - San Francisco - Córdoba</p>
                <p className='text-[1rem]'>Salta 17 - San Francisco - Córdoba</p>
            </div>
            <div className="flex flex-row justify-start items-center p-2 gap-3 w-full lg:w-4xl px-5">
                <a href="#" target="__blank"><img src={instagramIcon} alt="instagramIcon" className="w-6 h-6 invert"/></a>
                <a href="#" target="__blank"><img src={facebookIcon}  alt="facebookIcon" className="w-7 h-7 invert"/></a>
            </div>
        </div>
    )
}

export default FooterComponent