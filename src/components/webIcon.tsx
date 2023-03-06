import Image from "next/legacy/image"
import { useRouter } from "next/router"

type Props = {
    width?: number,
    height?: number,
    style?: string,
}

function WebIcon({width, height, style}: Props) {
    const router = useRouter()

    function goToHome() {
        router.push('/')
    }
    return (
        <button
            className={`flex flex-col items-center text-center text-sm font-bold w-fit ${style}`}
            onClick={() => goToHome()}
        >
            <Image src={'/images/nofoodwaste-icon.svg'} alt='nofoodwaste' width={width || 68} height={height || 68} />
            NoFoodWaste
        </button>
    )
}

export default WebIcon