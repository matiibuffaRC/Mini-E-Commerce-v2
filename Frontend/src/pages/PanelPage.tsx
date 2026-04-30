import { useState, useEffect, use } from 'react';
import editIcon from "../icons/edit-convertido-de-png.svg"

import '../components/Animations/animations.css';
import CreateProductModal from '../components/CreateProductModal';
import EditProductModal from '../components/EditProductModal';

function PanelPage() {
    interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    newProduct: {
        nombre: string;
        precio: number | string;
        categoria: string;
        id_categoria: number | null;
    };
    setNewProduct: React.Dispatch<React.SetStateAction<any>>;
    categories: any[];
    onCreate: () => void;
}
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
    const [search, setSearch] = useState<string>("");

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
    // Para obtener todos los productos una vez renderizada la web
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
    // Actualización de productos
    const updatedProduct = async () => {
        try {
            // En la petición FETCH es necesario indicar el ID o algo del producto para DIFERENCIAR cual queremos trabajar
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
    // Creación de un nuevo producto
    const creadtedProduct = async () => {
        try {
            const response = await fetch('http://localhost:3000/productos', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProduct)
                }
            )
            if(!response.ok){
                throw new Error('Error al crear el producto');
            }
            const created = await response.json(); // La respuesta de la petición
            
            
            // Le agregamos el nombre de la categoría para no trabajarlo sin ella 
            const productWithCategory = {
                ...created,
                categoria: categories.find(cat => cat.id === created.id_categoria)?.nombre
            };
            
            setProducts([...products, productWithCategory]);
            
            setIsCreateModalOpen(false);
            
            // Limpiamos el formulario de creación
            setNewProduct({ 
                nombre: "",
                precio: "",
                categoria: "",
                id_categoria: null,
            });
        } catch (error) {
            console.error('No se ha podido crear un nuevo producto: ', error);
        }
    }

    // Eliminacion de un producto
    const deletedProduct = async () => {
        try {
            const response = await fetch(`http://localhost:3000/productos/${selectedProduct.id}`, 
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                }
            });
            setProducts(products.filter(prod => prod.id !== selectedProduct.id));
            setIsModalOpen(false);
            
            if(!response.ok){
                throw new Error ('No se pudo eliminar dicho producto!');
            }
        } catch (error) {
            console.error(error)    
        }
    }

    const printProductsList = () => {
        return (
            products.filter((product) => 
                product.nombre.toLowerCase().includes(search.toLowerCase())
            ).sort((a, b) => a.id - b.id)
            .map((product) => (
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
            ))
            
        )
    }

    return (
        <section className="pt-17.5 bg-black min-h-screen text-gray-400 flex flex-col justify-center items-center">
            <div className="border border-gray-700 w-[90%] min-h-100 max-h-150 p-5 flex flex-col gap-3">
                <div className='pr-2 flex flex-row justify-between'>
                    <h1 className='text-xl'>Mis productos</h1>
                    <div className='flex flex-row gap-2'>
                        <div>
                            <input 
                                title='SearchInput'
                                type="text"
                                placeholder='Buscar productos'
                                value={search}
                                className="px-2 py-0.5 bg-black border rounded-full border-gray-600 w-full"
                                onChange={(e)=>setSearch(e.target.value)}/>
                        </div>
                        <div
                            className='text-sm bg-linear-to-br from-[#ffac4d] to-[#FD8804] px-3 py-1 rounded-2xl text-white hover:text-black cursor-pointer'
                            onClick={handleOpenCreateModal}>
                            New product
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className='flex flex-row gap-1'>
                        <h3 className='border-r border-gray-700 px-1 w-9'>ID</h3>
                        <h3 className='border-r border-gray-700 px-1 w-50'>Nombre</h3>
                        <h3 className='border-r border-gray-700 px-1 w-25'>Precio</h3>
                        <h3 className='px-1 w-25'>Categoria</h3>    
                    </div>
                    {printProductsList()}
                </div>
            </div>

            {/* Ventana modal para cambiar precios */}
            {isModalOpen && <EditProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} categories={categories} onSave={updatedProduct} onDelete={deletedProduct}/>}

            {/* Menú para creación */}
            
            {isCreateModalOpen &&  <CreateProductModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} newProduct={newProduct} setNewProduct={setNewProduct} categories={categories} onCreate={creadtedProduct}/>}
        </section>
    )
}

export default PanelPage