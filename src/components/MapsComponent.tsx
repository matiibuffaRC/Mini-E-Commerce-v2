function MapsComponent() {
    return (
        <div className='flex flex-col md:flex-row gap-4 md:w-full md:justify-center lg:justify-between lg:px-5'>
            <div className='bg-[#FF8904] '>
                
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.8901843233815!2d-62.068066519513955!3d-31.43660557693538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cad7fb9307a149%3A0x8e8464fc835a5cc!2sSalta%2017%2C%20San%20Francisco%2C%20C%C3%B3rdoba!5e0!3m2!1sen!2sar!4v1771527389197!5m2!1sen!2sar" 
                    title="Ubicación del local de salta"
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-80 w-100 md:w-75 md:h-65 lg:w-95 lg:h-70"
                />
            </div>
            <div className='bg-[#FF8904]'>
                
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.3976442002872!2d-62.097846224064135!3d-31.430718074255175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cb291e323f6dd9%3A0x2d884edf7a2f5745!2sCASA%20BUFFA!5e0!3m2!1ses-419!2sar!4v1773086207081!5m2!1ses-419!2sar"
                    title="Ubicación del local de ameghino" 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade" 
                    className="w-100 h-80 md:w-75 md:h-65 lg:w-95 lg:h-70"
                />
            </div>
        </div>
        

    )
}

export default MapsComponent