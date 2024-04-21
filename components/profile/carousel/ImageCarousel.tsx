// import Image from 'next/image';
// import 'react-alice-carousel/lib/alice-carousel.css';
// // import AliceCarousel from 'react-alice-carousel';


// export default function ImageCarousel({ images }) {
 
//     const handleDragStart = (e) => e.preventDefault();

//     const items = images.map((img, index) => (
//         <div className="relative w-auto flex justify-center max-h-[200px] " key={index} onDragStart={handleDragStart}>
//             {/* <Image
//                 src={img.url}
//                 alt={`Slide ${index + 1}`}
//                 layout="intrinsic"
//                 objectFit="contain"
//                 className="rounded-lg"
//                 width={500}
//                 height={300}
//             /> */}
//             <img src={img.url} alt={`Slide ${index + 1}`} className="rounded-lg h-[150px]" />
//         </div>
//     ));

//      return (
//         <div className="image-carousel-container !h-auto">
//             <AliceCarousel
//                 mouseTracking
//                 items={items}
//                 responsive={{
//                     0: {
//                         items: 1
//                     },
//                     1024: {
//                         items: 1
//                     },
//                 }}
//                 controlsStrategy="responsive"
//                 autoPlayInterval={2000}
//                 animationDuration={800}
//                 touchTracking={true}
//                 autoHeight={true}
//                 autoWidth={true}
//             />
//         </div>
//     );
// }

