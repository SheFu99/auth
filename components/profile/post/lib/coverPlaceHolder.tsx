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
            <svg width="1150" height="115" viewBox="0 0 1150 115" xmlns="http://www.w3.org/2000/svg">
                <rect width="1150" height="115" fill="#2b2b2b"/>
                <circle className="dynamic-circle" cx="900" cy="35" r="20" fill="#f2f2f2"/>
                <path d="M0,80 Q140,35 280,80 T570,80 T860,80 T1150,80 V115 H0 Z" fill="#1a1a1a"/>
                <path d="M0,90 Q140,55 280,90 T570,90 T860,90 T1150,90 V115 H0 Z" fill="#0d0d0d"/>
                <circle cx="172.5" cy="35" r="2" fill="#f2f2f2"/>
                <circle cx="207" cy="23" r="1.5" fill="#f2f2f2"/>
                <circle cx="241.5" cy="46" r="1.2" fill="#f2f2f2"/>
                <circle cx="276" cy="28.75" r="1.8" fill="#f2f2f2"/>
                <circle cx="310.5" cy="20" r="1" fill="#f2f2f2"/>
                <circle cx="517.5" cy="51.75" r="2" fill="#f2f2f2"/>
                <circle cx="552" cy="46" r="1.5" fill="#f2f2f2"/>
                <circle cx="586.5" cy="46" r="1.2" fill="#f2f2f2"/>
                <circle cx="621" cy="28.75" r="1.8" fill="#f2f2f2"/>
            </svg>
        </div>
    );
}

export default CoverPlaceHolder;
