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
            <div className={`flex justify-between items-center pl-7 py-3.5 pr-3.5 h-[47px]  rounded-lg border
            bg-opacity-100 border-primary
            ${onEnter ? 'border-0 bg-primary' : 'bg-white'}
            w-[370px]`}>
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
                    // onFocusin={(e)=>{focus = true}}
                    // onFocusout={(e)=>{focus = false}}
                />
                <button aria-label="Search button" onClick={() => {onSearch(text); setOnEnter(true);}}>
                    {/* <Search height={18} width={18} focusable="false"/> */}
                    Q
                </button>
            </div>
        :
        <div>
            <div 
                className={`w-full bg-transparent cursor-default`}
                onKeyDown={(e) => {
                    if (e.key==="Enter") {
                        onCancelSearch(text);
                        setOnEnter(false);
                    }
                }}
            >
                {text}
            </div>
            <button onClick={() => {onCancelSearch(); setOnEnter(false);}}>
                {/* <Close height={13} width={13} class="fill-primary" focusable="false"/> */}
                X
            </button>
        </div>
        }
        </>
    )
}