
type Props = {
    title?: string,
    onClickButton?: any
}

function ModalButton({ title, onClickButton }: Props) {
    return (
        <button
            className="bg-primary text-sm text-white font-semibold w-[120px] h-[40px] rounded-[20px] flex justify-center items-center"
            onClick={() => onClickButton()}
        >
            {title}
        </button>
    )
}

export default ModalButton