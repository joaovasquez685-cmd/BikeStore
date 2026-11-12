import { AuthProvider } from "./AuthContext"
import { ProductsProvider } from "./ProductsContext"
import { CartProvider } from "./CartContext"
import { CompareProvider } from "./CompareContext"
import { UiProvider } from "./UiContext"

/** Orden importa: Cart depende de Auth (carrito por usuario). */
export default function AppProviders({ children }){
  return (
    <UiProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <CompareProvider>{children}</CompareProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </UiProvider>
  )
}
