class BlobImageManager {
    private images: File[];
    private imagesBlobUrl: string[];

    constructor(){
        this.images = [];
        this.imagesBlobUrl = [];
    };

    public getImages():File[]{
        return this.images
    }

    public getImagesBlobUrl():string[]{
        return this.imagesBlobUrl
    }

    public async addImage(event : React.ChangeEvent<HTMLInputElement>):Promise<void>{
        const files = Array.from(event.target.files);
        const imageBlobUrls: string[]=[];

        if(files.length >= this.imagesBlobUrl.length){
            this.images = files;
        }else{
            this.images = [...this.images, ...files]
        }

        for(let i=0; i<files.length; i++){
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e)=>{
                const blobUrl = e.target?.result as string;
                imageBlobUrls.push(blobUrl);
            };

            const imageURL = URL.createObjectURL(file);
            imageBlobUrls.push(imageURL);
            this.imagesBlobUrl = [...this.imagesBlobUrl,imageURL]

            reader.readAsDataURL(file);
        }
    };
    public deleteImage(image:string,index:number):void{
        this.imagesBlobUrl = this.imagesBlobUrl.filter((img)=>img!== image);
        this.images = this.images.filter((file,id)=>id!==index);

    }
}

export default BlobImageManager