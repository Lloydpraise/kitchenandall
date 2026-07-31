import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}

export const cartItems = persistentAtom<CartItem[]>('cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
  const current = cartItems.get();
  const existing = current.find((i) => i.id === item.id);
  if (existing) {
    cartItems.set(
      current.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
    );
  } else {
    cartItems.set([...current, { ...item, quantity }]);
  }
}

export function removeFromCart(id: number) {
  cartItems.set(cartItems.get().filter((i) => i.id !== id));
}

export function updateQuantity(id: number, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  cartItems.set(cartItems.get().map((i) => (i.id === id ? { ...i, quantity } : i)));
}

export function clearCart() {
  cartItems.set([]);
}