import HeaderComponent from "./components/HeaderComponent";
import ScrollToTop from "./components/ScrollToTopComponent";
import FooterComponent from "./components/FooterComponent";
import CartComponent from "./components/CartComponent";
import type { CartItem } from "./components/CartComponent";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";


import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import Catalog from "./pages/Catalog";
import Panel from "./pages/PanelPage";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  
  const handleClickToOpenCart = () => {
    setOpenCart(prev => prev = !prev)
  }

  return (
    <>
      <HeaderComponent handleClick={handleClickToOpenCart} cart={cart}></HeaderComponent>
      <CartComponent handleClick={handleClickToOpenCart} openCart={openCart} setOpenCart={setOpenCart} cart={cart} setCart={setCart} total={total} setTotal={setTotal}></CartComponent>
      <ScrollToTop /> 
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/producto/:id" element={<ProductPage  setCart={setCart} />}/>  
          <Route path="/catalog" element={<Catalog />} />  
          <Route path="/panelAdmin" element={<Panel />} />      
      </Routes>
      
      <FooterComponent></FooterComponent>
    </>
  )
}

export default App
