// import React from 'react'
import CaruselComponent from "./CaruselComponent";
import CaruselTextsComponent from "./CaruselTextsComponent.tsx";
import CaruselProductsComponent from "./CaruselProductsComponent";
import casaBuffa from "../assets/imgs/casaBuffaLogo - Editado.png"
import { CaruselImages } from "../assets/data/CaruselImages.ts";
import { products } from "../assets/data/Products.ts";
import { texts } from "../assets/data/TextsCarusel.ts";
import "./Animations/animations.css";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";



function MainComponent() {
    
    const [visibleCaruselProducts, setVisibleCaruselProducts] = useState(false);
    const productsRef = useRef<HTMLDivElement>(null); {/* Con esto estamos haciendo referencia a una DIV que todavía no existe */}

    const [visibleCaruselImages, setVisibleCaruselImages] = useState(false);
    const imagesRef = useRef<HTMLDivElement>(null);




    useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {

            if (entry.target === productsRef.current && entry.isIntersecting) {
                setVisibleCaruselProducts(true);
            }

            if (entry.target === imagesRef.current && entry.isIntersecting) {
                setVisibleCaruselImages(true);
            }

        });
    }, { threshold: 0.2 });

    if (productsRef.current) observer.observe(productsRef.current);
    if (imagesRef.current) observer.observe(imagesRef.current);

    return () => observer.disconnect();
}, []);

    function printProducts() {
    return products
        .filter(product => product.outstanding)
        .slice(0, 4)
        .map(product => (
            <div key={product.id} className="product-container max-w-70 md:max-w-60 bg-[#eee] p-2">
                <Link to={`/producto/${product.id}`}>
                <div className="w-50 h-50 md:h-35 md:w-35 lg:w-45 lg:h-45 flex justify-center items-center ">
                    <img
                        src={product.img}
                        alt={product.productName}
                        className="w-full h-full object-cover hover:scale-105 duration-100 ease-in"
                    />
                </div>

                <div className="text-black p-1">
                    
                        <h3 className="text-[1.1rem] md:text-[.9rem] py-1">
                            {product.productName}
                        </h3>
                    

                    <p className="text-[.9rem] md:text-[.8rem] text-[#333]">Desde:</p>
                    <p className="text-[.8rem]">${product.price}</p>
                </div>
                </Link>
            </div>
        ));
}
    
    const productosDestacados = products.filter((product)=>product.outstanding);

    return (
        <div className="pt-18 bg-black w-full min-h-screen flex flex-col items-center text-white">
            <div className="py-1 h-8 w-full bg-[#FF8904]">
                <CaruselTextsComponent texts={texts}></CaruselTextsComponent>
            </div> {/* Franja naranja pensada para carusel de textos */}
            <div className="bg-[url('/imgs/gondola.jpg')] bg-cover bg-center w-full h-100 md:h-150 relative">
                <div className="absolute inset-0 bg-orange-500/40">

                </div>
            </div>
            <div className="my-5 md:my-10 flex flex-col justify-center items-center md:flex-row lg:w-5xl fade-down">
                <div className="md:flex-1 flex flex-row justify-center items-center md:ml-10 lg:ml-25">
                    <img src={casaBuffa} alt="Casa Buffa logo" className="hidden md:inline w-50 md:w-75"/>
                </div>
                <div className="p-5 md:flex-2 md:mr-10 lg:mr-25">
                    <h2 className="text-[1.6rem] md:text-[2rem] font-bold">Casa Buffa</h2>
                    <h3 className="text-[.9rem]  md:text-[1.1rem] text-[#ccc]">
                        Somos un comercio dedicado a la materia prima para panificación, desacartables y cotillón. Con nuestras dos sucursales ubicadas en la ciudad de San Francisco y distruimos a la zona através de transportes y comisionistas de tu confianza.
                    </h3>
                </div>
            </div>
            <div ref={imagesRef} className={`w-screen mx-4 md:my-2.5 lg:my-10 py-5 z-5 lg:w-4xl flex flex-row justify-center items-center  ${visibleCaruselImages ? "fade-down" : "opacity-0"}`}>
                <CaruselComponent images={CaruselImages}/>
            </div>
            
            <div className="my-10 flex flex-col justify-center items-center md:max-w-3xl lg:w-5xl bg-[#eee] md:bg-transparent">
                <h2 className="bg-orange-400 max-w-70 md:max-w-200 text-center text-[1.3rem] md:text-[1.5rem] py-1 px-5 m-2 md:m-3 text-wrap">Nuestros destacados del momento</h2>
                <div className="md:hidden">
                    <CaruselProductsComponent products={productosDestacados}></CaruselProductsComponent>
                </div>
                
                <div ref={productsRef}className={`hidden md:flex flex-row justify-center items-center gap-1 md:gap-3 md:m-4 md:mb-10 ${visibleCaruselProducts ? "fade-down" : "opacity-0"}`}> 
                    {printProducts()}
                </div>
            </div>
            
        </div>
    )
}

export default MainComponent