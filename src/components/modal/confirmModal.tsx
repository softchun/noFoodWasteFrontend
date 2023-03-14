import { useState } from "react";

type Props = {
    Component?: any,
    Button?: any,
    title?: string,
    content?: string,
    warning?: string,
    onConfirm?: any,
    props?: any,
}

export default function ConfirmModal({Component, Button, title, content, warning, onConfirm, ...props}: Props) {
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
                        className="justify-center items-center text-primary flex backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none"
                    >
                        <div className="relative w-full my-6 mx-auto max-w-sm">
                            {/*content*/}
                            <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*body*/}
                                <div className="overflow-auto min-h-[160px] flex flex-col gap-4 justify-center items-center px-4">
                                    <div className='text-xl font-semibold'>{title}</div>
                                    <div className='text-base font-normal text-center'>{content}</div>
                                    {warning &&
                                        <div className='text-sm text-error text-center font-normal'>{warning}</div>
                                    }
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-4 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary text-white active:bg-info font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={(e) => {setShowModal(false); onConfirm(e);}}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}