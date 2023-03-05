import Image from "next/legacy/image"

type Props = {
    text?: string,
    style?: string,
    width?: number,
    height?: number,
}

function NoItem({ text, style, width, height }: Props) {
    return (
        <div className={`flex-1 flex flex-col justify-center items-center w-full text-xl text-primary font-semibold ${style}`}>
            <div className='flex gap-1 items-center'>
                <Image src={'/images/no-icon.svg'} alt='order' width={width || 36} height={height || 36} />
                {text || 'No Item'}
            </div>
        </div>
    )
}

export default NoItem