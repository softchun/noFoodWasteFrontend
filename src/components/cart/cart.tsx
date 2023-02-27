import CartButton from "./cartButton"
import CartList from "./cartList"
import Modal from "../modal"

function Cart() {
    return (
        <Modal
            Component={CartList}
            title={'My Cart'}
            Button={CartButton}
        />
    )
}

export default Cart