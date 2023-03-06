import Image from "next/legacy/image";
import { useState } from "react";

type Props = {
    keyword?: string,
    onSearch?: any,
    onCancelSearch?: any,
}
export default function SearchBar({keyword, onSearch, onCancelSearch}: Props) {
    const [onEnter, setOnEnter] = useState<boolean>(false);
    const [text, setText] = useState<string>(keyword);

    return (
        <>
        {!onEnter?
            <div className={`flex justify-between items-center px-6 py-2 rounded-lg bg-opacity-100 border-2 border-primary bg-white w-full max-w-[370px]`}>
                <input 
                    className={`w-full focus:outline-none grow bg-white bg-opacity-0 caret-primary`}
                    value={text}
                    type='text'
                    placeholder={'Search'}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e)=> {
                        if (e.key==="Enter") {
                            onSearch(text);
                            setOnEnter(true);
                        }
                    }}
                />
                <button disabled={!text} onClick={() => {onSearch(text); setOnEnter(true);}} className='flex justify-center items-center disabled:opacity-75'>
                    <Image src={'/images/search-icon.svg'} alt='search' width={28} height={28} />
                </button>
            </div>
        :
        <div className={`flex justify-between items-center px-6 py-2 rounded-lg bg-opacity-100 border-2 border-info bg-info w-full max-w-[370px]`}>
            <div 
                className={`w-full bg-transparent cursor-default text-white`}
                onKeyDown={(e) => {
                    if (e.key==="Enter") {
                        setText('');
                        onCancelSearch();
                        setOnEnter(false);
                    }
                }}
            >
                {text}
            </div>
            <button onClick={() => {setText(''); onCancelSearch(); setOnEnter(false);}} className='flex justify-center items-center'>
                <Image src={'/images/close-icon.svg'} alt='close' width={28} height={28} />
            </button>
        </div>
        }
        </>
    )
}