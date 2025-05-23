import { useEffect,useState } from "react";
import { Typography} from "@mui/material";



const TypewriterMessage= ({content, onComplete})=>{
    const [displayedText,setDisplayedText]=useState("");


useEffect(()=> {
 let i=0;
    const interval=setInterval(() =>{
        setDisplayedText(content.slice(0,i+1));
        i++;
        if (i === content.length){
            clearInterval(interval);
            onComplete?.();
        }
    }, 15);
    
    return () =>clearInterval(interval);
},[content]);

return (
    <Typography variant="body1" sx={{whiteSpace:"pre-wrap"}}>
    {displayedText}
    </Typography>
);
};

export default TypewriterMessage;