const CoverPlaceHolder = () => {
    return ( 
        <div>
            <style>
                {`
                .dynamic-circle {
                    cx: var(--circle-cx, 650); /* Default cx value */
                }
                
                @media (max-width: 768px) { /* Responsive adjustments */
                    .dynamic-circle {
                    --circle-cx: 750; /* Smaller screens */
                    }
                }

                @media (max-width: 640px) {
                    .dynamic-circle {
                    --circle-cx: 300; /* Even smaller screens */
                    }
                }
                `}
            </style>
            <svg width="1000" height="100" viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="1000" height="100" fill="#2b2b2b"/>
                <circle className="dynamic-circle" cx="800" cy="30" r="20" fill="#f2f2f2"/>
                <path d="M0,70 Q125,30 250,70 T500,70 T750,70 T1000,70 V100 H0 Z" fill="#1a1a1a"/>
                <path d="M0,80 Q125,50 250,80 T500,80 T750,80 T1000,80 V100 H0 Z" fill="#0d0d0d"/>
                <circle cx="150" cy="30" r="2" fill="#f2f2f2"/>
                <circle cx="180" cy="20" r="1.5" fill="#f2f2f2"/>
                <circle cx="210" cy="40" r="1.2" fill="#f2f2f2"/>
                <circle cx="240" cy="25" r="1.8" fill="#f2f2f2"/>
                <circle cx="270" cy="15" r="1" fill="#f2f2f2"/>


                <circle cx="450" cy="45" r="2" fill="#f2f2f2"/>
                <circle cx="480" cy="40" r="1.5" fill="#f2f2f2"/>
                <circle cx="510" cy="40" r="1.2" fill="#f2f2f2"/>
                <circle cx="540" cy="25" r="1.8" fill="#f2f2f2"/>

            </svg>
            </div>
          
       
     );
}
 
export default CoverPlaceHolder;