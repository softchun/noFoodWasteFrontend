import Image from "next/legacy/image"
import { useRouter } from "next/router"

type Props = {
    onClickButton?: any
}

function WebIcon({ onClickButton }: Props) {
    const router = useRouter()

    function goToHome() {
        router.push('/')
    }
    return (
        <button
            className="flex flex-col items-center text-base font-bold w-full"
            onClick={() => goToHome()}
        >
            <Image src={'/images/nofoodwaste-icon.svg'} alt='nofoodwaste' width={56} height={56} />
            NoFoodWaste
        </button>
    )
}

export default WebIcon