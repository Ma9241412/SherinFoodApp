import React, {createContext, useState, useContext} from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = item => {
    setCartItems(prevItems => {
      // Check if item already exists
      const itemIndex = prevItems.findIndex(i => i.id === item.id);
      if (itemIndex > -1) {
        // If exists, increase the quantity
        const newItems = [...prevItems];
        newItems[itemIndex].quantity += item.quantity;
        return newItems;
      } else {
        // Otherwise, add new item
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = itemId => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
