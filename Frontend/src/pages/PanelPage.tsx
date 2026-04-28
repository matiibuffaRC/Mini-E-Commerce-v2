import { useState, useEffect } from 'react';
import editIcon from "../icons/edit-convertido-de-png.svg"
// import { Link } from 'react-router-dom';

import '../components/Animations/animations.css';

function PanelPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null); // Para el producto que querramos modificar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<any>({
        nombre: "",
        precio: "",
        categoria: "",
        id_categoria: null,
    });
    
    // Función para abrir una ventana modal
    const handleEditClick = (product:any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setNewProduct({ nombre: "", precio: "", categoria: "", id_categoria: null });
        setIsCreateModalOpen(true);
    };


    // Peticion de productos
    useEffect(()=>{
        const fetchProducts = async () => {
            try{
                const response = await fetch('http://localhost:3000/productos');
                if (!response.ok){
                    throw new Error(`Error al obtener productos: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Los productos fueron obtenidos sin problema! ', data);
                
                setProducts(data); // Guardamos lo obtenido en la variable de estado
            }catch(error){
                console.error('Error al obtener los productos: ', error);
            }
        }

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/categorias');
                if (!response.ok) {
                    throw new Error(`Error al obtener categorías: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Categorías obtenidas:', data);
                setCategories(data);
            } catch (error) {
                console.error('Error al obtener las categorías: ', error);
            }
        }

        fetchProducts();
        fetchCategories();
    },[])

    const printListProducts = () => {
    return (
        products
            .sort((a, b) => a.id - b.id) // 👈 ordena por id
            .map((product) => {
                return (
                    <div key={product.id} className='border-t border-gray-600 w-full flex flex-row justify-between'>
                        <div className='px-2 py-1 flex flex-row gap-1'>
                            <h3 className='border-r border-gray-700 px-1 w-7'>{product.id}</h3>
                            <h3 className='border-r border-gray-700 px-1 w-50'>{product.nombre}</h3>
                            <h3 className='border-r border-gray-700 px-1 w-25'>$ {product.precio}</h3>
                            <h3 className='px-1'>{product.categoria}</h3>
                        </div>
                        <div className='m-1 flex flex-col justify-center items-center'>
                            <img src={editIcon} alt="Edit icon" className='invert w-4 h-4' onClick={() => handleEditClick(product)}/>
                        </div>
                    </div>
                )
            })
    )
}

    const updatedProduct = async () => {
    try {
        const response = await fetch(`http://localhost:3000/productos/${selectedProduct.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedProduct),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el producto');
        }
        const updatedData = await response.json();
        // Actualiza el estado local con la nueva categoría
        const updatedProductWithCategory = { 
            ...updatedData, 
            categoria: categories.find(cat => cat.id === updatedData.id_categoria)?.nombre || updatedData.categoria 
        };
        setProducts(products.map(prod => prod.id === selectedProduct.id ? updatedProductWithCategory : prod));
        setIsModalOpen(false); // Cierra el modal
    } catch (error) {
        console.error('Error:', error);
        // Opcional: muestra un mensaje de error al usuario
    }
};

    return (
        <section className="pt-17.5 bg-black min-h-screen text-gray-400 flex flex-col justify-center items-center">
            <div className="border border-gray-700 w-[90%] min-h-100 max-h-150 p-5 flex flex-col gap-3">
                <div className='pr-2 flex flex-row justify-between'>
                    <h1 className='text-xl'>Mis productos</h1>
                    <div
                        className='text-sm bg-linear-to-br from-[#ffac4d] to-[#FD8804] px-3 py-1 rounded-2xl text-white hover:text-black cursor-pointer'
                        onClick={handleOpenCreateModal}
                    >
                        New product
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className='flex flex-row gap-1'>
                        <h3 className='border-r border-gray-700 px-1 w-9'>ID</h3>
                        <h3 className='border-r border-gray-700 px-1 w-50'>Nombre</h3>
                        <h3 className='border-r border-gray-700 px-1 w-25'>Precio</h3>
                        <h3 className='px-1 w-25'>Categoria</h3>    
                    </div>
                    {printListProducts()}
                </div>
            </div>

            {/* Ventana modal para cambiar precios */}
            {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
                
                {/* Overlay */}
                <div 
                    className="absolute inset-0 bg-[#0004]"
                    onClick={() => setIsModalOpen(false)}
                ></div>

                {/* Drawer */}
                <div className="absolute bg-gray-900 w-full max-w-xl p-5 rounded-t-2xl animate-slideUp">
                    <h2 className="text-lg mb-3">Editar producto</h2>

                    <div className="flex flex-col gap-3">
                        <input
                            title='Input product name'
                            type="text"
                            value={selectedProduct?.nombre || ""} // Ponemos como valor el nombre del producto original
                            className="p-2 bg-black border border-gray-600"
                            onChange={(e) => // Cambiamos el nombre del producto desde el setProducto
                                setSelectedProduct({
                                    ...selectedProduct,
                                    nombre: e.target.value
                                })
                            }
                        />

                        <input
                            title='Input product price'
                            type="number"
                            value={`${selectedProduct?.precio || ""}`}
                            className="p-2 bg-black border border-gray-600"
                            onChange={(e) => // Cambiamos el precio del producto desde el setProducto
                                setSelectedProduct({
                                    ...selectedProduct,
                                    precio: e.target.value
                                })
                            }
                        />

                        <select
                            title='Select product category'
                            value={selectedProduct?.categoria}
                            className="p-2 bg-black border border-gray-600"
                            onChange={(e) =>
                                setSelectedProduct({
                                    ...selectedProduct,
                                    categoria: e.target.value,
                                    id_categoria: categories.find(cat => cat.nombre === e.target.value)?.id || null
                                })
                            }
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.nombre}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>

                        <button
                            className="bg-blue-600 p-2 mt-3 hover:text-white cursor-pointer"
                            onClick={() => {
                                console.log("Producto editado:", selectedProduct);
                                updatedProduct();
                                setIsModalOpen(false);
                            }}>
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </div>
            )}

            {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
                <div 
                    className="absolute inset-0 bg-[#0004]"
                    onClick={() => setIsCreateModalOpen(false)}
                ></div>

                <div className="absolute bg-gray-900 w-full max-w-xl p-5 rounded-t-2xl animate-slideUp">
                    <h2 className="text-lg mb-3">Nuevo producto</h2>

                    <div className="flex flex-col gap-3">
                        <input
                            title='Input new product name'
                            type="text"
                            value={newProduct.nombre}
                            className="p-2 bg-black border border-gray-600"
                            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                        />

                        <input
                            title='Input new product price'
                            type="number"
                            value={`${newProduct.precio}`}
                            className="p-2 bg-black border border-gray-600"
                            onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
                        />

                        <select
                            title='Select new product category'
                            value={newProduct.categoria}
                            className="p-2 bg-black border border-gray-600"
                            onChange={(e) => {
                                const selectedCategory = categories.find(cat => cat.nombre === e.target.value);
                                setNewProduct({
                                    ...newProduct,
                                    categoria: e.target.value,
                                    id_categoria: selectedCategory?.id || null,
                                });
                            }}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.nombre}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>

                        <button
                            className="bg-blue-600 p-2 mt-3 hover:text-white cursor-pointer"
                            onClick={() => {
                                console.log("Nuevo producto creado:", newProduct);
                                
                            }}>
                            Guardar producto
                        </button>
                    </div>
                </div>
            </div>
            )}
        </section>
    )
}

export default PanelPage