const fetchdata=async()=>{  
    const data= await fetch("https://github.com/mruhid/v2Data/blob/main/src/src.json?raw=true")
    const data1=await data.json()
    console.log(data1)
}
fetchdata()