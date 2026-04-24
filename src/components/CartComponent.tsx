import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import downArrowIcon from "../icons/down-arrow.png";
import crossIcon from "../icons/crossIcon.svg";
import "./Animations/animations.css";

export type CartItem = {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    stock: number;
    total: number;
    img?: string;
};

type CartComponentProps = {
    handleClick: () => void;
    openCart: boolean;
    setOpenCart: Dispatch<SetStateAction<boolean>>;
    cart: CartItem[];
    setCart: Dispatch<SetStateAction<CartItem[]>>;
    total: number;
    setTotal: Dispatch<SetStateAction<number>>;
}

function CartComponent({ handleClick, openCart, cart, setCart, total, setTotal}: CartComponentProps) {

    const navigate = useNavigate();
    let sumaTotal = 0;
    
    const [menuDeliveryMethod, setMenuDeliveryMethod] = useState<boolean>(false);
    const [optionDeliveryMethod, setOptionDeliveryMethod] = useState<string>("Método de entrega");
    const [menuPaymentMethod, setMenuPaymentMethod] = useState<boolean>(false);
    const [optionPaymentMethod, setOptionPaymentMethod] = useState<string>("Forma de pago");
    const [confirm, setConfirm] = useState<boolean>(false);
    const [finalPrice, setFinalPrice] = useState<number>(0);

    useEffect(()=>{
        cart.forEach((item:any)=>{
            sumaTotal += item.total;
        })
        
        setTotal(sumaTotal);

        // console.log("El total cambió: ", sumaTotal);
        // console.log(cart)

    },[cart])

    useEffect(()=>{
        if (optionPaymentMethod !== "Forma de pago" && optionDeliveryMethod !== "Método de entrega" && cart.length > 0){
            setConfirm(true);
        } else {
            setConfirm(false);
        }
    },[optionPaymentMethod, optionDeliveryMethod, cart])

    useEffect(()=>{
        if (optionPaymentMethod === "Transferencia (10% OFF)"){setFinalPrice(Number((total - (total * 0.1))));} 
        else if (optionPaymentMethod === "Efectivo (20% OFF)"){setFinalPrice(Number((total - (total * 0.2))));} 
        else {setFinalPrice(Number(total));}
    },[optionPaymentMethod, total])

    
    const changeMenuDelivery = () =>{
        setMenuDeliveryMethod(prev => !prev);
        console.log(menuDeliveryMethod);
    }

    const changeMenuPayment = () =>{
        setMenuPaymentMethod(prev => !prev);
        console.log(menuPaymentMethod);
    }

    const changeOptionDelivery = (option:string) => {
        setOptionDeliveryMethod(option);
    }

    const changeOptionPayment = (option:string) => {
        setOptionPaymentMethod(option);
    }

    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) =>{
        if (!confirm) {
            e.preventDefault();
            return;
        }

        const productsList = cart
            .map((product: CartItem) => `• ${product.productName} x${product.quantity} - $${product.price * product.quantity}`)
            .join("\n");

        const message = `Hola! 👋 Quisiera hacer el siguiente pedido:\n\nMétodo de envío: ${optionDeliveryMethod}\nForma de pago: ${optionPaymentMethod}\n\n${productsList}\n\nTotal sin descuento: $${total}` +
                        (finalPrice !== total ? `\n*Precio final: $${finalPrice}*` : "");
        
        const phoneNumberSalta = "543564507240";
        const phoneNumberAmeghino = "54356400000";
        
        let phoneNumber:string;

        optionDeliveryMethod.includes("Salta") ? phoneNumber = phoneNumberSalta : phoneNumber = phoneNumberAmeghino;


        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        try {
            window.open(whatsappUrl, "_blank");
        } catch (err) {
            console.error("Error abriendo WhatsApp:", err);
        }
    }

    const changeQuantity = (signe:string, idProduct:number) => {
        setCart(
            (prevCart:any[])=>{ {/* Trabajamos el carrito con el item seleccionado */}
                const updatedCart = prevCart.map((item)=>{
                    if (item.id !== idProduct) return item; {/* Si el producto no es el buscado, seguimos */}
                    
                    {/* Else... */}

                    const max = item.stock;
                    const current = Number(item.quantity) ?? 1; {/* Si no tiene cantidad definida, es 1 automaticamente */}
                    let action = signe === "add" ? current + 1 : current - 1;
                    if (signe === "close"){
                        action = 0;
                    }

                    if (action > max) action = max;
                    return {
                        ...item,
                        quantity: action,
                        total: Number(item.price) * action,
                    };
                })
                return updatedCart.filter(item => item.quantity > 0); {/* Devolvemos los items con al menos un pedido */}
            }
        )
        
    }

    const printProductsCart = () =>{
        if(cart.length === 0){
            return(
                <div className='text-white flex flex-col gap-2 justify-center items-center'>
                    <h3 className='text-center'>No hay productos seleccionados!</h3>
                    <div className=' flex flex-row justify-center' onClick={()=>{navigate("/catalog"), handleClick()}}>
                        <a href="#" className='bg-[#FF8904] py-2 px-4 rounded-[20px] hover:bg-[#e97c00]'>
                            Ver catálogo
                        </a>
                    </div>
                </div>
            )
        }
        return(
            cart.map((productCart:any) =>{ 
                return(
                    <div key={productCart.id} className='bg-[#232323] p-2 flex flex-row gap-1 flex-1 relative '> {/* Este es cada producto elegido INDIVIDUAL*/}
                        <img src={crossIcon} alt="Cross icon" className='invert absolute w-5 h-5 top-1 right-1 hover:bg-[#aaa] rounded-[50%] p-0.5 cursor-pointer' onClick={()=>{changeQuantity("close", productCart.id)}}/>
                        <div>
                            <img src={productCart.img} alt={`${productCart.productName} image`} className='h-30 w-30' />
                        </div>
                        <div className='flex-1 p-2 text-[1rem] flex flex-col justify-center gap-1 '>
                            <h3>{productCart.productName}</h3>
                            <div className='flex flex-row items-center gap-1'>
                                <div className='border border-gray-500 hover:bg-gray-500 px-2 pb-1 rounded-[10px] flex flex-row justify-center items-center select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' onClick={()=>{changeQuantity('remove', productCart.id)}}>-</div>
                                <div className='text-[.9rem] flex flex-row justify-center items-center px-1 py-1.5 select-none'>{productCart.quantity}</div>
                                <div className={`border border-gray-500 hover:bg-gray-500 px-2 pb-1 rounded-[10px] flex flex-row justify-center items-center select-none cursor-pointer ${productCart.quantity >= productCart.stock ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={()=>{if(productCart.quantity < productCart.stock) changeQuantity('add',productCart.id)}}>+</div>
                            </div>
                            <h4 className='text-[.8rem]'>${productCart.total}</h4>
                        </div>
                    </div>
                )
            })
        )
    }
    
    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 z-30 h-full w-full bg-[#0004] top-0 left-0 ${openCart ? " " : "hidden"}`}
                onClick={handleClick}>
            </div>
            
            {/* Panel del carrito */}
            <div className={`h-full w-90 md:w-80 bg-black fixed top-0 right-0 z-40 transition-transform duration-300 ease-in-out border-l border-[#666] ${openCart ? "translate-x-0" : "translate-x-full"} flex flex-col justify-between`}>
                <div className="flex justify-between items-center p-5 border-b border-[#666] ">
                    <h2 className="text-white text-[1.2rem]">Mi carrito ({cart.length})</h2>
                    <div className="cursor-pointer hover:bg-[#444] rounded-[50%]" onClick={handleClick}>
                        <img src={crossIcon} alt="Cerrar" className="w-6 h-6 invert  p-0.5"/>
                    </div>
                </div>
                
                {/* Cart Items */}
                <div className={`p-5  text-white flex flex-col gap-1 h-full overflow-y-auto ${cart.length === 0 ? "justify-center" : "justify-start" }`}>
                    <div className='flex flex-col gap-2 overflow-auto pr-2'>
                        {printProductsCart()}
                    </div>
                </div>

                <div className='border-t border-gray-500 text-white py-6 px-3 flex flex-col justify-between gap-2 h-[85%] max-h-76'>
                    
                    <div className='border-t border-gray-300'>
                        <div className='flex justify-between'>
                            <h3 className='pt-1 px-1 text-[1.1rem]'>Total: </h3>
                            <h3 className={`pt-1 px-1 text-[1.1rem] ${finalPrice !== total && finalPrice > 0 ? "line-through" : "" }`}>${total}</h3>
                        </div>
                        {finalPrice !== total && finalPrice > 0 && (
                            <div className='flex justify-between'>
                                <h3 className='px-1 text-[#FF8904]'>Con descuento:</h3>
                                <h3 className='px-1 text-[#FF8904]'>${finalPrice}</h3>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col justify-between max-h-60'>
                        <div className='mb-15 flex flex-col gap-1'>
                            <div className='relative'>
                                
                                <button title='delivery-method' className='border border-gray-600 flex w-full justify-between items-center text-[.9rem]  rounded-lg px-1 py-2 cursor-pointer hover:border-[#e97c00] hover:bg-[#111]' onClick={()=>changeMenuDelivery()}>
                                    <span className='pl-1'>{optionDeliveryMethod}</span>
                                    <img src={downArrowIcon} alt="arrow-down" className='invert h-4 w-4 select-none'/>
                                </button>
                                
                                <div className={`w-83.75 md:w-104 transition-all duration-50 absolute mt-1 p-1 flex flex-col gap-0 bg-[#222] z-10 top-10 right-0 ${menuDeliveryMethod ? "h-40 opacity-100 rounded-md fade-down-cart" : "h-0 opacity-0 hidden"}`}>

                                    <div className='text-[.9rem] text-gray-300 rounded-md px-1 py-2 select-none cursor-pointer hover:bg-[#e97c00] hover:text-white' onClick={()=>{changeOptionDelivery("Retiro personalmente en Ameghino"), changeMenuDelivery()}}>
                                        <p className='pl-1'>Retiro personalmente en Ameghino</p>
                                    </div>
                                    
                                    <div className='text-[.9rem] text-gray-300 rounded-md px-1 py-2 select-none cursor-pointer hover:bg-[#e97c00] hover:text-white' onClick={()=>{changeOptionDelivery("Retiro personalmente en Salta"), changeMenuDelivery()}}>
                                        <p className='pl-1'>Retiro personalmente en Salta</p>
                                    </div>
                                    
                                    <div className='text-[.9rem] text-gray-300 rounded-md px-1 py-2 select-none cursor-pointer hover:bg-[#e97c00] hover:text-white' onClick={()=>{changeOptionDelivery("Envío un comisionista a Ameghino"), changeMenuDelivery()}}>
                                        <p className='pl-1'>Envío un comisionista a Ameghino</p>
                                    </div>

                                    <div className='text-[.9rem] text-gray-300 rounded-md px-1 py-2 select-none cursor-pointer hover:bg-[#e97c00] hover:text-white' onClick={()=>{changeOptionDelivery("Envío un comisionista a Salta"), changeMenuDelivery()}}>
                                        <p className='pl-1'>Envío un comisionista a Salta</p>
                                    </div>
                                </div>
                            </div>

                            <div className='relative '>
                                <button title='payment-method' className='border border-gray-600 flex w-full justify-between items-center text-[.9rem] rounded-lg px-1 py-2 cursor-pointer hover:bg-[#111] hover:border-[#e97c00]' onClick={()=>changeMenuPayment()}>
                                    <span className='pl-1'>{optionPaymentMethod}</span>
                                    <img src={downArrowIcon} alt="arrow-down" className={`invert h-4 w-4 transition-rotate duration-400 ${menuPaymentMethod ? "rotate-180" : ""}`}/>
                                </button>

                                <div className={`w-84 md:w-104 transition-all duration-400 absolute mt-1 p-1 flex flex-col gap-1 bg-[#222] z-10 -top-34 right-0 ${menuPaymentMethod ? "h-32.5 opacity-100 rounded-md fade-down-invert" : "h-0 opacity-0 hidden"}`}>

                                    <div className='text-[.9rem] text-gray-300 rounded-md px-1 py-2 select-none cursor-pointer hover:bg-[#e97c00] hover:text-white' onClick={()=>{changeOptionPayment("Tarjeta"), changeMenuPayment()}}>  
                                        <p className='pl-1'>Tarjeta de débito / crédito</p>
                                    </div>
                                    <div className='group text-[.9rem] text-gray-300 rounded-md px-1 py-2 select-none cursor-pointer hover:bg-[#e97c00] hover:text-white' onClick={()=>{changeOptionPayment("Transferencia (10% OFF)"), changeMenuPayment()}}>
                                        <p className='pl-1'>Transferencia <span className='text-[#FF8904] group-hover:text-white'>10% OFF</span></p>
                                    </div>
                                    <div className='group text-[.9rem] text-gray-300 rounded-md px-1 py-2 select-none cursor-pointer hover:bg-[#e97c00] hover:text-white' onClick={()=>{changeOptionPayment("Efectivo (20% OFF)"), changeMenuPayment()}}>
                                        <p className='pl-1'>Efectivo <span className='text-[#FF8904] group-hover:text-white'>20% OFF</span></p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div>
                            <div className={` bg-[#8f5300] text-[.9rem] text-center mt-1 p-2 rounded-md select-none ${confirm ? "cursor-pointer bg-[#e97c00]" : " "}`}>
                            <button disabled={!confirm} className={`${confirm ? "cursor-pointer bg-[#e97c00]" : "cursor-default"} w-full h-full`} onClick={(e)=>handleConfirm(e)} >
                                Finalizar pedido vía WhatsApp
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default CartComponent
