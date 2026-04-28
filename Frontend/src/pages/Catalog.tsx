import { useState, useEffect } from 'react';
import crossIcon from "../icons/crossIcon.svg";
import arrowIcon from "../icons/down-arrow.png";
import threeDotsIcon from "../icons/threeDots.svg";
// import { products } from "../assets/data/Products.ts";
import { Link } from 'react-router-dom';

function Catalog() {

    const [selected, setSelected] = useState<number | null>(null); {/* OPCIÓN DEL MENÚ SELECCIONADA (ID numérico) */}
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [productsSelected, setProductsSelected] = useState<string | null>(null); // String de la opción seleccionada

    const [products, setProducts] = useState<any[]>([]); // Pasaría a reemplazar el import desde products.ts

    useEffect(()=>{
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024 === false){ 
                setMenuOpen(false);
            }
        }
        addEventListener("resize", handleResize);
        return () => removeEventListener("resize", handleResize);

    },[]);
    
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
        console.log("Menu abierto:", !menuOpen);
    }

    // Lo que hacemos es trabaja con los IDs de los items, por eso el select trabaja con numbers o nulls.
    const arrayItems = [
        {id: 1,title: "Todos los productos",items: []},
        {id: 2,title: "Panificación",items: ["Margarinas", "Dulces", "Premezclas", "Harinas"]},
        {id: 3,title: "Repostería",items: ["Cremas", "Chocolates", "Pastas"]},
        {id: 4,title: "Descartables",items: ["Bandejas plasticas", "Telgopor", "Carton", "Maderas"]},
        {id: 5,title: "Cotillón",items: ["Velas", "Bengalas", "Globos"]}
    ]

    const printMenu = () => {
        return(
            <div className={`${isMobile ? "relative" : ""}`}>
                <div onClick={()=>toggleMenu()}>
                    <img src={crossIcon} alt="Close Menu" className={`invert ${!isMobile ? "absolute right-1 top-1" : "hidden"}`}/>
                </div>
                <h3 className='pl-1 md:px-3 pt-3 text-[1.2rem] lg:pt-0'>Categorías</h3>
                {
                    arrayItems.map((item)=>{
                        return (
                            <div key={item.id} className='px-2'>
                                <div className='flex flex-row justify-start items-center'>
                                    <img src={arrowIcon} alt="Arrow Icon" className={`invert w-4.5 h-4.5 pl-1 transition-rotate duration-200 ${selected ===  item.id? "rotate-180" : ""} ${(item.title === "Todos los productos") ? "hidden" : " "}`}/>
                                    <p onClick={()=>handleClick(item.id)} className={`p-1 text-[1rem] select-none cursor-pointer hover:text-[#FF8904] ${selected === item.id ? "text-[#ff8800]" : "text-white"}`}>{item.title}</p>
                                </div>
                                <ul className={`overflow-hidden transition-all duration-300 ${selected === item.id ? "max-h-40 opacity-100 text-[#FF8904]" : "max-h-0 opacity-0 text-white"} `}>
                                    {item.items.map((subItem)=>{
                                        return (
                                            <li key={subItem} onClick={()=>{toggleMenu(); handleProductClick(subItem)}} className={` transition-all  duration-250 select-none cursor-pointer text-[.9rem] px-5 ${selected === item.id ? "opacity-100" : "opacity-0"} ${productsSelected === subItem  ? "text-[#b96300] font-semibold" : "text-gray-300 hover:text-[#FF8904]"}`}>{subItem}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

        useEffect(() => {
        console.log("Selected cambió:", selected);
    }, [selected]);

    const handleClick = (indice: number) => {
        setSelected(prev => prev === indice ? null : indice);
        // Si se hace click en "Todos los productos", limpiar el filtro
        if (indice === 1) {
            setProductsSelected(null);
        }
    };

    const  handleProductClick = (productType: string) => {
        setProductsSelected(prev => prev === productType ? prev : productType); // Si se clickea sobre el seleccionado no pasa nada, sino se cambia al nuevo seleccionado
        console.log("Producto seleccionado:", productType); 
    }

    useEffect(()=> {
        const fetchProducts = async () => {
            console.log("Obteniendo productos...");
            try{
                const response = await fetch('http://localhost:3000/productos');
                const data = await response.json();
                setProducts(data);
                if (!response.ok){
                    throw new Error(`Error al obtener productos: ${response.statusText}`);
                    console.log('Error al obtener los productos: ', response.statusText);
                }
            }catch(error){
                console.error('Error al obtener los productos: ', error);
            }
        }
        fetchProducts();
    },[])
    
    const printProducts = (type: string | null) => {
        const filteredProducts = type === null
            ? products
            : products.filter(product => product.categoria === type);

            if(filteredProducts.length === 0){
                return (
                    <div className="col-span-full flex items-center justify-center min-h-75 text-center">
                        <p className="text-lg text-gray-300">
                            ¡Lo lamentamos! Por ahora no hay nada disponible en esta categoría.
                        </p>
                    </div>
                    )
            }else{
                return filteredProducts.map(product => (
                <div key={product.id} className="bg-[#eee] max-w-50 transition-all duration-200 fade-down rounded-xl overflow-hidden hover:scale-101 shadow-md hover:shadow-lg border border-red-500 w-100 mx-1">
                    <Link to={`/producto/${product.id}`}>
                        <div className="w-full h-50 overflow-hidden">
                            <img src={product.img} alt="Product image" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                        </div>

                        <div className="text-black py-2 px-3">
                                <h3 className="text-[.9rem] font-semibold transition-colors">
                                    {product.nombre}
                                </h3>
                            <p className="text-sm text-gray-600 mt-2 select-none">Desde:</p>
                            <p className="text-sm font-medium select-none">${product.precio}</p>
                        </div>
                    </Link>
                </div>
            ));
            }
    }

    return (
        <div className='py-18 bg-black min-h-screen text-white flex flex-col md:justify-start lg:justify-center lg:flex-row'>
            
            <div className='flex flex-col lg:flex-row lg:w-6xl lg:gap-3 my-5 md:justify-start lg:justify-center'>
                <section className='mx-4 my-4 lg:mx-0 lg:ml-4 lg:mr-0 lg:my-4 lg:border lg:border-white/10 py-3 overflow-hidden'>

                    {/* Menú mobile */}
                    <div className="bg-[#111] p-2 relative lg:hidden flex flex-row justify-start items-center gap-1  border border-[#666]">
                        <img src={threeDotsIcon} alt="Three dots" className='invert h-3 w-3'/>
                        <h3 onClick={toggleMenu} className='select-none cursor-pointer hover:text-[#FF8904]'>Categorías</h3>
                    </div>
                    {/* Menú de OPCIONES */}
                    <div className={`transition-translate duration-350 h-full border border-white/10 lg:border-none absolute lg:inline bg-black z-5 ${menuOpen ? "-translate-x-5 top-18" : "-translate-x-90 top-18"} lg:translate-x-0 lg:static`}>
                        <div className='px-3 lg:px-0'>
                            {printMenu()}
                        </div>
                    </div>
                    
                </section>


                {/* Sección de mostrado de productos */}
                <main className="flex-1 mx-4 lg:mr-5 lg:ml-0 my-4 lg:my-4 p-5 border border-white/10 overflow-y-auto">
                    <div key={productsSelected} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6 justify-items-center" >
                    {
                        printProducts(productsSelected) // Con esta funcion imprimimos todos los productos que obtenemos de filtrar
                    }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Catalog