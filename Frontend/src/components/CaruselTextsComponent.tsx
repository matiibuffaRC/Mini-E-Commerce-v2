import { IgrCarousel, IgrCarouselSlide } from 'igniteui-react';
import 'igniteui-webcomponents/themes/light/bootstrap.css';

type CaruselComponentProps = {
    texts: string[];
}

function CaruselComponent({texts}: CaruselComponentProps) {
    return (
        <div>
            <IgrCarousel hideNavigation={true} hideIndicators={true} interval={3000} disablePauseOnInteraction={true} className='bg-transparent'>
                {texts.map((text, index)=>{
                    return(
                        <IgrCarouselSlide key={index}>
                            <p className='text-white text-center select-none'>{text}</p>
                        </IgrCarouselSlide>
                        
                    )
                })}
            </IgrCarousel>
        </div>
    )
}

export default CaruselComponent