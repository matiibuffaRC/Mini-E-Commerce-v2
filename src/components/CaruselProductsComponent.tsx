import { IgrCarousel, IgrCarouselSlide } from "igniteui-react";
import type { Product } from "../assets/data/Products.ts";
import { Link } from "react-router-dom";

type CaruselProductsComponentProps = {
    products: Product[];
};

function CaruselProductsComponent({ products }: CaruselProductsComponentProps) {
    
    const productExibidos = products.filter(product => product.id < 4);

    return (
        <div className="w-full flex flex-row justify-center items-center p-3 ">
            <IgrCarousel hideIndicators={true} className="bg-transparent">
                {
                    productExibidos.map(product => (
                    <IgrCarouselSlide key={product.id} className="flex flex-row justify-center items-center bg-transparent">
                        <div className="product-container max-w-70 md:max-w-40 pt-5 px-5 flex flex-col justify-center items-center fade-down bg-[#eee]">
                            <Link to={`/producto/${product.id}`}>
                            
                                <div className="w-40 h-40 md:w-30 md:h-30 flex flex-col justify-center items-center">
                                    <img
                                        src={product.img}
                                        alt={product.productName}
                                        className="w-full h-full object-cover transition-transform duration-100 ease-in hover:scale-105"
                                    />
                                </div>

                                <div className="text-black p-1">
                                    <h3 className="text-[1.1rem] md:text-[.9rem] text-center py-1">
                                        {product.productName}
                                    </h3>
                                </div>

                            </Link>
                        </div>
                    </IgrCarouselSlide>
                ))
                }
            </IgrCarousel>
        </div>
    );
}

export default CaruselProductsComponent;
