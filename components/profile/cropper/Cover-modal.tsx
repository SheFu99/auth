"use clinet"
import CoverCropper from "./Cover-cropper";

import { GrClose } from "react-icons/gr";
interface ModalProps {
    updateCover: (newAvatarUrl: Blob) => void;
    closeCoverModal: () => void;
  }


const CoverModal: React.FC<ModalProps>  = ({ updateCover, closeCoverModal }) => {
  return (
    <div
      className="relative z-20"
      aria-labelledby="crop-cover-dialog"
      role="dialog"
      aria-modal="true"
    >
        <>
        
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center ">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                onClick={closeCoverModal}
              >
                <span className="sr-only">Close menu</span>
                <GrClose />
              </button>
              <CoverCropper
                updateCover={updateCover}
                closeCoverModal={closeCoverModal}
              />
            </div>
          </div>
        </div>
      </div>
      </>
    </div>
  );
};
export default CoverModal;