import Image from "next/legacy/image"

type Props = {
    style?: string,
    width?: number,
    height?: number,
}

function Loading({ style, width, height }: Props) {
    return (
        <div className={`flex-1 flex flex-col justify-center items-center w-full text-2xl font-bold ${style}`}>
            <Image priority src={'/images/loading-icon.svg'} alt='loading' width={width || 128} height={height || 128} />
            Loading...
        </div>
    )
}

export default Loading