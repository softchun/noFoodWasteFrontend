import Image from "next/legacy/image"


const mockData = {
    id: "63a9b5a05ca397833e37c650",
    stock: 5,
    price: 50,
    productId: "63a86e5e2ed1a827ef3fb500",
    name: "Butter Cheese Bread",
    productPrice: 100,
    detail: "10 slides of bread",
    storeId: "63a425f43bb2ba6fd48640a8",
    storeName: "Bread Store, Sweets and Snacks"
}

function discount(previous, current) {
    return ((current - 100) / previous) * 100
}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weekdayShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

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

    function getOpenTime(item: OpenTimeData) {
        let d = new Date
        let day = d.getDay()

        if (item.all.isAll) {
            return item.all.isClosed ? 'Closed' : (!item.all.open || !item.all.close) ?
            'Open' : weekdayShort[day] + ' '+ item.all.open + '-' + item.all.close
        } else if (day === 0) {
            return item.sun.isClosed ? 'Closed' : (!item.sun.open || !item.sun.close) ?
            'Open' : weekdayShort[day] + ' '+ item.sun.open + '-' + item.sun.close
        } else if (day === 1) {
            return item.mon.isClosed ? 'Closed' : (!item.mon.open || !item.mon.close) ?
            'Open' : weekdayShort[day] + ' '+ item.mon.open + '-' + item.mon.close
        } else if (day === 2) {
            return item.tue.isClosed ? 'Closed' : (!item.tue.open || !item.tue.close) ?
            'Open' : weekdayShort[day] + ' '+ item.tue.open + '-' + item.tue.close
        } else if (day === 3) {
            return item.wed.isClosed ? 'Closed' : (!item.wed.open || !item.wed.close) ?
            'Open' : weekdayShort[day] + ' '+ item.wed.open + '-' + item.wed.close
        } else if (day === 4) {
            return item.thu.isClosed ? 'Closed' : (!item.thu.open || !item.thu.close) ?
            'Open' : weekdayShort[day] + ' '+ item.thu.open + '-' + item.thu.close
        } else if (day === 5) {
            return item.fri.isClosed ? 'Closed' : (!item.fri.open || !item.fri.close) ?
            'Open' : weekdayShort[day] + ' '+ item.fri.open + '-' + item.fri.close
        } else if (day === 6) {
            return item.sat.isClosed ? 'Closed' : (!item.sat.open || !item.sat.close) ?
            'Open' : weekdayShort[day] + ' '+ item.sat.open + '-' + item.sat.close
        }
    }

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
                            {getOpenTime(data.openTime)}
                        </div>
                    </div>
                </div>
                <div className='bg-info rounded-3xl w-full h-[30px] flex justify-center items-center text-white'>view</div>
            </div>
        </div>
    )
}

export default StoreItem