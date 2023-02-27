// import EditStore from '../../../src/pages/store/edit';
import dynamic from "next/dynamic"

const EditStore = dynamic(() => import("../../../src/pages/store/edit"), { ssr:false })
export default EditStore