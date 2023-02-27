import { useState } from "react";

type Props = {
    onCancel?: any,
    onConfirm?: any,
    props?: any,
}

export default function ChangeStore({onCancel, onConfirm, ...props}: Props) {
    return (
        <div
            className="justify-center items-center flex backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none"
        >
            <div className="relative w-full my-6 mx-auto max-w-sm">
                {/*content*/}
                <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    {/* <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-3xl font-semibold">
                            {title}
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black-1 opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => setShowModal(false)}
                        >
                            x
                        </button>
                    </div> */}
                    {/*body*/}
                    <div className="overflow-auto min-h-[160px] p-4 flex flex-col gap-4 justify-center items-center">
                        <div className='text-xl font-semibold'>Change the store?</div>
                        <div className='text-base font-normal text-center'>No problem! We can do it for you, but we need to clear your cart first.</div>
                        {/* <Component onClose={() => setShowModal(false)} {...props} /> */}
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-4 border-t border-solid border-slate-200 rounded-b">
                        <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => onCancel()}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={(e) => onConfirm(e)}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}