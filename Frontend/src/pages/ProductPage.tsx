// import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../assets/data/Products";
import { useState } from "react";
import arrowIcon from "../icons/arrowIcon.svg";
import crossIcon from "../icons/crossIcon.svg";
import type { CartItem } from "../components/CartComponent";
import "../components/Animations/animations.css";



    type productPageProps = {
        setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    }

function ProductPage({ setCart }: productPageProps){

    const navigate = useNavigate();
    const [notification, setNotification] = useState<boolean>(false);
    const [closing, setClosing] = useState(false);

    // Para navegar con los productos 
    const { id } = useParams();
    const product = products.find(
        product => product.id === Number(id)
    )
    
    // Trabajamos con el estado del producto para el carrito
    const [quantity, setQuantity] = useState(1);
    const handleQuantityChange = (signe: string) => {
        if (signe === "add" && product){ //Validamos que exista el producto y que hayan seleccionado el "agregar"
            if (quantity < product.stock){ //Que quede stock
                setQuantity(prev => prev + 1);
            }else if(quantity === product.stock){ //No dejamos agregar más si ya se alcanzó el stock disponible
                return;
            }
        }else{
            
            if (quantity === 1) return;
            
            setQuantity(prev => prev - 1);
        }
    }
    
    if (!product){
        return(
            <div className="pt-18 h-200 bg-red-500">
                <p>Producto no encontrado</p>
            </div>
        )
    }

    function addProductToCart(product: typeof products[0], quantity:number){
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            const max = product.stock ?? Infinity;

            if (existing) {
                // aumenta la cantidad sin superar el stock
                return prevCart.map(item => {
                    if (item.id !== product.id) return item;

                    const current = Number(item.quantity) ?? 1;
                    let next = current + quantity;
                    if (next > max) next = max;

                    return {
                        ...item,
                        quantity: next,
                        total: next * item.price,
                    }
                });
            }

            // nuevo producto
            const productToAddToCart: CartItem = {
                ...product,
                quantity: Math.min(quantity, max),
                total: Math.min(quantity, max) * product.price,
            }

            return [...prevCart, productToAddToCart];
        });
    }

    function showNotification(){
    setNotification(true)

    setTimeout(()=>{
        setClosing(true)

        setTimeout(()=>{
            setNotification(false)
            setClosing(false)
        },300)

    },2500)
}

    return (
        <div className="min-h-screen py-20 relative bg-[#111] flex flex-col items-center justify-center text-white">
            {notification && (
                <div className={`text-[1rem] md:text-[1rem] fixed bg-green-500/30 border-2 border-green-500 text-white py-4 px-7 md:py-5 md:px-7 rounded-xl shadow-lg z-10 transition-all duration-300 top-20 md:top-21 left-3 md:left-3 ${closing ? "toast-exit" : "toast-enter"}`}>
                    <img src={crossIcon} alt="Cross Icon" className="fixed top-1 right-1 w-5 h-5 brightness-0 saturate-100 invert sepia hue-rotate-80 cursor-pointer p-0.5 rounded-[50%] hover:bg-green-500/40" onClick={()=>{setNotification(false), setClosing(false)}}/>
                    ¡Producto agregado!
                </div>
            )}
            <div className="flex flex-col md:flex-row mx-5 bg-[#1a1a1a] md:w-xl lg:w-3xl p-5 gap-3 relative">
                
                <div className="absolute -top-6 left-0 flex flex-row justify-center items-center p-0.5 select-none cursor-pointer" onClick={()=>navigate(-1)}>
                    <img src={arrowIcon} alt="Volver" className="invert h-4 w-4"/>
                    <p className="text-[.7rem]">Volver</p>
                </div>
                <div className="md:max-h-100 md:max-w-100 md:border-r-2 border-[#444] pr-5">
                    <img src={product.img} alt={product.productName} />
                </div>

                <div className="flex flex-col justify-between">
                    
                    <div className="md:w-80 px-4 mb-10 md:mb-0">
                        <h2 className="text-[1.5rem] md:text-[1.6rem] border-b border-gray-400 mb-2">{product.productName}</h2>
                        <h3 className="text-[.9rem] text-gray-400">Stock: {product.stock} unidades</h3>
                        <h3 className="text-[1.4rem] md:text-[1.6rem]">${product.price}</h3>
                    </div>
                    
                    <div className="flex flex-row justify-center items-center gap-4">
                        <div className="border border-white flex flex-row gap-2 rounded-[25px]">
                            <div className="px-2 py-1 border border-white rounded-l-[25px] select-none cursor-pointer" onClick={()=>handleQuantityChange("remove")}>-</div>
                            {/* <div className="px-2 py-1">{quantity}</div> */}
                            <input type="number" value={quantity} min={1} max={product.stock} placeholder="1" className="text-center w-8 focus:outline-0 no-arrows" onChange={(e)=>{
                                const value = e.target.value;
                                if(value === ''){
                                    setQuantity(0);
                                    return;
                                }
                                let numValue = Number(value);
                                if(numValue < 1){
                                    setQuantity(1);
                                    return
                                };
                                if(numValue > product.stock){
                                    return;
                                };
                                setQuantity(numValue);
                            }}/>
                            <div className="px-2 py-1 border border-white rounded-r-[25px] select-none cursor-pointer" onClick={()=>handleQuantityChange("add")}>+</div>
                        </div>
                        <div className="border border-[#FF8904] py-1.5 px-4 rounded-[25px] bg-[#FF8904] select-none cursor-pointer hover:bg-[#e97c00]" onClick={()=>{
                            addProductToCart(product, quantity)
                            showNotification()
                        }}>
                            Añadir al carrito
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default ProductPage