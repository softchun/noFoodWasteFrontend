import Image from "next/image"

function CartButton({ onClickButton }) {
    return (
        <button
            className="text-sm text-white font-semibold w-[40px] h-[40px] rounded-[20px] flex justify-center items-center"
            onClick={() => onClickButton()}
        >
            <Image src={'/images/cart-icon.svg'} alt='cart' width={32} height={32} />
        </button>
    )
}

export default CartButton