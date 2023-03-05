import Image from "next/legacy/image"
import formatOpenTime from "../utils/formatOpenTime";

type OpenData = {
    open: string,
    close: string,
    isClosed: boolean
}
type OpenTimeData = {
    all: {
        open: string;
        close: string;
        isClosed: boolean;
        isAll: boolean;
    };
    sun: OpenData;
    mon: OpenData;
    tue: OpenData;
    wed: OpenData;
    thu: OpenData;
    fri: OpenData;
    sat: OpenData;
}
type StoreData = {
    id: string,
    email: string,
    name: string,
    isClosed: boolean;
    detail?: string,
    profileImage?: any,
    coverImage?: any,
    address?: string;
    location?: {
        lat: number;
        lng: number;
    };
    openTime: OpenTimeData;
}

function StoreItem({data}: {data: StoreData}) {

    return (
        <div className='flex flex-col w-[400px] bg-white rounded-3xl relative overflow-hidden'>
            <div className='bg-gray-4 w-full h-[150px] overflow-hidden relative'>
                {data.coverImage &&
                    <Image src={data.coverImage} alt='image' layout="fill" objectFit="cover" />
                }
            </div>
            <div className='p-4 flex flex-col gap-4'>
                <div className='flex gap-2 items-center'>
                    <div className='bg-gray-4 rounded-3xl w-10 h-10 overflow-hidden relative'>
                        {data.profileImage &&
                            <Image src={data.profileImage} alt='image' layout="fill" objectFit="cover" />
                        }
                    </div>
                    <div className='flex flex-col'>
                        <div className='text-xl font-bold'>{data.name}</div>
                        <div className='text-base font-medium flex gap-1 items-center'>
                            <Image src={'/images/clock-icon.svg'} alt='clock' width={24} height={24} />
                            {formatOpenTime(data.openTime)}
                        </div>
                    </div>
                </div>
                <div className='bg-info rounded-3xl w-full h-[30px] flex justify-center items-center text-white'>view</div>
            </div>
        </div>
    )
}

export default StoreItem