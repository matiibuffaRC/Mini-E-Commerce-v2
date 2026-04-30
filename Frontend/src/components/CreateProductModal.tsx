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

function CreateProductModal({
    isOpen,
    onClose,
    newProduct,
    setNewProduct,
    categories,
    onCreate
    }: CreateProductModalProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div 
                className="absolute inset-0 bg-[#0004]"
                onClick={onClose}
            ></div>

            <div className="absolute bg-gray-900 w-full max-w-xl p-5 rounded-t-2xl animate-slideUp">
                <h2 className="text-lg mb-3">Nuevo producto</h2>

                <div className="flex flex-col gap-3">
                    <input
                        title="..."
                        type="text"
                        value={newProduct.nombre}
                        className="p-2 bg-black border border-gray-600"
                        onChange={(e) => 
                            setNewProduct({ ...newProduct, nombre: e.target.value })
                        }
                    />

                    <input
                        title="..."
                        type="number"
                        value={`${newProduct.precio}`}
                        className="p-2 bg-black border border-gray-600"
                        onChange={(e) => 
                            setNewProduct({ ...newProduct, precio: Number(e.target.value) })
                        }
                    />

                    <select
                        title="..."
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
                        {categories.map((cat:any) => (
                            <option key={cat.id} value={cat.nombre}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>

                    <button
                        className="bg-blue-600 p-2 mt-3 hover:text-white cursor-pointer"
                        onClick={() => {
                            onCreate();
                        }}
                    >
                        Guardar producto
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateProductModal;