import { IoMdClose } from "react-icons/io"

interface ImageBlobListProp {
    imagesBlobUrl:string[],
    onImageDelete:(image:string,index:number)=>void,
    className?:string
}
const ImageBlobList = ({imagesBlobUrl,onImageDelete,className}:ImageBlobListProp)=>{

    return(
        <div className={`${className}`}>
        {imagesBlobUrl?.map((image,index)=>(
            <div key={index}>
                <div className="relative" title="remove image">
                    <button 
                        onClick={()=>onImageDelete(image,index)} 
                        title="Delete image" 
                        type="button"
                        className="text-white absolute right-0" >
                        <IoMdClose className="bg-red-600 bg-opacity-50 rounded-full"/>
                    </button>
                </div>
             <img key={index} src={image} alt=""className="h-[100px] w-auto rounded-sm" />
            </div>
        ))}
    </div>
    )
}

export default ImageBlobList