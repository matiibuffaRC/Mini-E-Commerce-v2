import type { Product, Category } from "./types";

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProduct: Product | null;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    categories: Category[];
    onSave: () => void;
    onDelete: () => void;
}

function EditProductModal({
    isOpen,
    onClose,
    selectedProduct,
    setSelectedProduct,
    categories,
    onSave,
    onDelete
}: EditProductModalProps) {

    if (!isOpen || !selectedProduct) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            
            <div 
                className="absolute inset-0 bg-[#0004]"
                onClick={onClose}
            ></div>

            <div className="absolute bg-gray-900 w-full max-w-xl p-5 rounded-t-2xl animate-slideUp">
                <div className='flex flex-row justify-between items-center mb-3'>
                    <h2 className="text-lg">Editar producto</h2>
                    <div className='bg-red-300 text-black px-2 py-1 rounded-3xl'>
                        <h2 
                            className='cursor-pointer'
                            onClick={() => {
                                onDelete();
                                onClose();
                            }}
                        >
                            Eliminar producto
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        title='...'
                        type="text"
                        value={selectedProduct.nombre}
                        className="p-2 bg-black border border-gray-600"
                        onChange={(e) =>
                            setSelectedProduct({
                                ...selectedProduct,
                                nombre: e.target.value
                            })
                        }
                    />

                    <input
                        title='...'
                        type="number"
                        value={selectedProduct.precio}
                        className="p-2 bg-black border border-gray-600"
                        onChange={(e) =>
                            setSelectedProduct({
                                ...selectedProduct,
                                precio: Number(e.target.value)
                            })
                        }
                    />

                    <select
                        title='...'
                        value={selectedProduct.categoria}
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
                            onSave();
                            onClose();
                        }}
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProductModal;