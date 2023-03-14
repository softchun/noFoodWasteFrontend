import { AppProps } from "next/app";
import Image from "next/legacy/image";
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
            {Button ?
                <Button title={title} onClickButton={() => setShowModal(true)} {...props} />
                :
                <div className='w-32 h-12 bg-primary' onClick={() => setShowModal(true)}></div>
            }
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none"
                    >
                        <div className="relative w-full my-6 mx-auto max-w-xl">
                            {/*content*/}
                            <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        {title}
                                    </h3>
                                    <button
                                        className="ml-auto opacity-50 hover:opacity-100 w-10 h-10"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <Image src={'/images/close-icon.svg'} alt='close' width={40} height={40} />
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="overflow-auto max-h-[80vh] scrollbar-modal">
                                    <Component onClose={() => setShowModal(false)} {...props} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}