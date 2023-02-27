import { useState } from "react";

type Props = {
    title?: string,
    enabled: boolean,
    setEnabled: any
}
export default function Toggle({title, enabled, setEnabled}: Props) {
    // const [enabled, setEnabled] = useState(false);

    return (
        <div className="relative flex flex-col items-center justify-center overflow-hidden">
            <div className="flex">
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        readOnly
                    />
                    <div
                        onClick={() => setEnabled(!enabled)}
                        className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-primary  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                    ></div>
                    {title && <span className={`ml-2 ${enabled? 'font-medium':'font-normal'}`}>
                        {title}
                    </span>}
                </label>
            </div>
        </div>
    )
}