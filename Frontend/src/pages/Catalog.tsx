import { useState, useEffect } from 'react';
import crossIcon from "../icons/crossIcon.svg";
import arrowIcon from "../icons/down-arrow.png";
import threeDotsIcon from "../icons/threeDots.svg";
import { Link } from 'react-router-dom';

function Catalog() {

    const [selected, setSelected] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [productsSelected, setProductsSelected] = useState<string | null>(null);

    // ✅ NUEVO estado para productos
    const [products, setProducts] = useState<any[]>([]);

    // 📱 Responsive
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setMenuOpen(false);
            }
        };

        handleResize(); // inicial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    // 📦 FETCH DE PRODUCTOS (LO MÁS IMPORTANTE)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/productos");

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data); // ✅ guardamos productos reales
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };
        fetchProducts();
    }, []);

    const arrayItems = [
        { id: 1, title: "Todos los productos", items: [] },
        { id: 2, title: "Panificación", items: ["Margarinas", "Dulces", "Premezclas", "Harinas"] },
        { id: 3, title: "Repostería", items: ["Cremas", "Chocolates", "Pastas"] },
        { id: 4, title: "Descartables", items: ["Bandejas plasticas", "Telgopor", "Carton", "Maderas"] },
        { id: 5, title: "Cotillón", items: ["Velas", "Bengalas", "Globos"] }
    ];

    const handleClick = (indice: number) => {
        setSelected(prev => prev === indice ? null : indice);

        if (indice === 1) {
            setProductsSelected(null); // mostrar todos
        }
    };

    const handleProductClick = (productType: string) => {
        setProductsSelected(productType);
        setMenuOpen(false);
    };

    const printMenu = () => (
        <div className={`${isMobile ? "relative" : ""}`}>
            <div onClick={toggleMenu}>
                <img src={crossIcon} alt="Close Menu" className={`invert ${!isMobile ? "absolute right-1 top-1" : "hidden"}`} />
            </div>

            <h3 className='pl-1 md:px-3 pt-3 text-[1.2rem] lg:pt-0'>Categorías</h3>

            {arrayItems.map((item) => (
                <div key={item.id} className='px-2'>
                    <div className='flex items-center'>
                        <img
                            title={item.title === "Todos los productos" ? "No hay subcategorías" : "Ver subcategorías"}
                            src={arrowIcon}
                            className={`invert w-4 h-4 transition ${selected === item.id ? "rotate-180" : ""} ${item.title === "Todos los productos" ? "hidden" : ""}`}
                        />

                        <p
                            onClick={() => handleClick(item.id)}
                            className={`p-1 cursor-pointer ${selected === item.id ? "text-[#ff8800]" : "text-white"}`}
                        >
                            {item.title}
                        </p>
                    </div>

                    <ul className={`transition-all ${selected === item.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                        {item.items.map(subItem => (
                            <li
                                key={subItem}
                                onClick={() => handleProductClick(subItem)}
                                className={`cursor-pointer px-5 text-sm ${productsSelected === subItem ? "text-[#b96300]" : "text-gray-300"}`}
                            >
                                {subItem}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

    // 🧠 FILTRO CORREGIDO
    const printProducts = (type: string | null) => {

        const filteredProducts = type === null
            ? products
            : products.filter(p => p.categoria === type); // ⚠️ depende de tu backend

        if (filteredProducts.length === 0) {
            return (
                <div className="col-span-full flex justify-center min-h-75">
                    <p className="text-gray-300">No hay productos</p>
                </div>
            );
        }

        return filteredProducts.map(product => (
            <div key={product.id} className="bg-[#eee] max-w-50 rounded-xl overflow-hidden hover:scale-105 transition">
                <Link to={`/producto/${product.id}`}>

                    <div className="w-full h-50 overflow-hidden">
                        <img
                            title='...'
                            src={product.imagen_url}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="text-black p-3">
                        <h3 className="font-semibold">{product.nombre}</h3>
                        <p className="text-sm text-gray-600 mt-2">Desde:</p>
                        <p className="font-medium">${product.precio}</p>
                    </div>

                </Link>
            </div>
        ));
    };

    return (
        <div className='py-18 bg-black min-h-screen text-white flex flex-col lg:flex-row'>

            <section className='mx-4 my-4 lg:border border-white/10 py-3'>

                <div className="bg-[#111] p-2 lg:hidden flex items-center gap-1 border border-[#666]">
                    <img title='...' src={threeDotsIcon} className='invert h-3 w-3' />
                    <h3 onClick={toggleMenu} className='cursor-pointer'>Categorías</h3>
                </div>

                <div className={`${menuOpen ? "block" : "hidden"} lg:block`}>
                    {printMenu()}
                </div>

            </section>

            <main className="flex-1 mx-4 my-4 p-5 border border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {printProducts(productsSelected)}
                </div>
            </main>

        </div>
    );
}

export default Catalog;