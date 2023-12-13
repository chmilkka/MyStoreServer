import { ShoppingCart } from "@mui/icons-material";
import { Button, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useStore } from "../stores/StoresManager";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Cart = ({cartOpen, cartClose}) => {

     const { productStore } = useStore();
     const { userStore } = useStore();
     const {orderStore} = useStore();

     const [cartProducts, setCartProducts] = useState([]);

     const currentUser = userStore.user;

    

    const createOrder= async () => {

        const a = []
        productStore.cartProducts.map((item) => a.push(item.id))

        const order = {
            userId: currentUser.id,
            productsId: a
        }; 
            console.log(order)
        try {
            await orderStore.createOrder(order)
            toast.success("Product removed from cart!")           
        } catch (error) {
            toast.error("Failed to remove product")
        }
      }

     useEffect(() => {
         const getProducts = async () => {
             const result = productStore.cartProducts
             setCartProducts(result);
         }
 
         getProducts();
     }, [productStore])

    return (
        <Drawer
            anchor="right"
            open={cartOpen}
            onClose={cartClose}
        >
            <List sx={{width: '400px'}}>
                <ListItem>
                    <ListItemIcon>
                        <ShoppingCart />
                    </ListItemIcon>
                    <ListItemText primary="Cart" />
                </ListItem>
                <Divider />
                {!cartProducts.length ? (
                    <ListItem>Cart is empty!</ListItem>
                ) : (
                    <>
                    {cartProducts.map((item) => (
                        <CartItem 
                        key={item.name} 
                        removeProduct={(name) => setCartProducts(cartProducts.filter(x => x.name !== name))} 
                        {...item} />
                    ))}
                    <Divider />
                    <ListItem>
                        <Typography sx={{fontWeight: 700}}>
                            Total price{' '}
                            {cartProducts.reduce((acc, item) => {
                            return acc + item.price;
                            }, 0)}{' '}
                            UAH
                        </Typography>
                    </ListItem>
                    <Button 
                    type='submit' 
                    color='success' 
                    variant="contained" 
                    onClick={createOrder}
                    sx={{margin: "10px"}} 
                    >
                    Place an order
                    </Button>
                    </>
                )}
            </List>
        </Drawer>
    )
}

export default Cart