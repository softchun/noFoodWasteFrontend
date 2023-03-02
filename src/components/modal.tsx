import { AppProps } from "next/app";
import { useState } from "react";

type Props = {
    Component?: any,
    Button?: any,
    title?: string,
    props?: AppProps,
}

export default function Modal({Component, Button, title, ...props}: any) {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <>
            {/* <button
                className="bg-primary text-sm text-white font-semibold w-[120px] h-[40px] rounded-[20px] flex justify-center items-center"
                onClick={() => setShowModal(true)}
            >
                {title}
            </button> */}
            {Button ?
                <Button title={title} onClickButton={() => setShowModal(true)} {...props} />
                :
                <div className='w-32 h-12 bg-primary' onClick={() => setShowModal(true)}></div>
            }
            {/* <button
                className="bg-emerald-800 text-white active:bg-emerald-900 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Add Product
            </button> */}
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none"
                    >
                        <div className="relative w-full my-6 mx-auto max-w-xl">
                            {/*content*/}
                            <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        {title}
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black-1 opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        x
                                        {/* <span className="bg-transparent text-black-1 opacity-5 h-6 w-6 text-2xl font-bold block outline-none focus:outline-none">
                                            x
                                        </span> */}
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="overflow-auto max-h-[80vh] scrollbar-modal">
                                    <Component onClose={() => setShowModal(false)} {...props} />
                                </div>
                                {/*footer*/}
                                {/* <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Save Changes
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
                </>
            ) : null}
        </>
    );
}