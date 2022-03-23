import React, { useState, useContext } from "react";
import { AccountContext } from "./Account"
import axios from "axios";

const UploadImage = () => {
    const [image, setImage] = useState(null)
    const { loggedIn, jwtToken } = useContext(AccountContext)
    const [filename, setFilename] = useState('')
    const [message, setMessage] = useState('')
    const [imageList, setImageList] = useState({})

    const getImages = async(event) => {
        event.preventDefault()
        const res = await axios({
            method: "GET",
             url: process.env["REACT_APP_.AWS_API_URL"],

            headers: {
                "Content-Type": "application/json",
                Authorization: jwtToken,
            },            
        })
        console.log(res.data)
        setImageList(res.data)
    }

    const getUrl = async(event) => {
        event.preventDefault()
        const res = await axios({
            method: "POST",
             url: process.env["REACT_APP_.AWS_API_URL"],

            headers: {
                "Content-Type": "application/json",
                Authorization: jwtToken,
            },
            data: {
                filename: filename
            },
            
        })
        console.log(filename)
        

        try {

            if(res.data.maxLimit) {
                console.log('Max number of images reached')
                setMessage('Max number of images reached')
            } else if(res.data.imageExists){
                setMessage('Image already exists')
                console.log('Image already exists')
            }else {
                const presignedData=res.data.postData   
                const payload = new FormData()
                            
                Object.entries(presignedData.fields).forEach(([ key, val ]) => {
                    payload.append(key, val);
                });
                payload.append('file', image)
                const result = await axios.post(presignedData.url, payload)
                if (result) {
                    console.log("Upload Suceeded")
                    setMessage("Upload Succeeded")
                }
            }
        }catch {
            setMessage("Upload failed")
        }

    }

    return (
        <div>
            {loggedIn &&
                <h2>Upload Image</h2>
            }
            {loggedIn && image && (
                <div>
                <img alt="not found" width={"250px"} src={URL.createObjectURL(image)} />
                <br />
                <button onClick={()=>{setImage(null);setMessage('')}}>Remove</button>                
                </div>
                )  
            }
            {loggedIn &&
                <form onSubmit={getUrl}>
                    <div>{message}</div>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={(event) => {
                            if (!event.target.files[0].type.startsWith('image/')) {
                                setMessage('File is not an image')
                                setImage(null)
                            }else if (event.target.files[0].size < 5*10**6) {
                                setFilename(event.target.files[0].name)
                                setMessage('Filename: '+event.target.files[0].name)
                                setImage(event.target.files[0])
                            }else {
                                setMessage('Image is too big')
                                setImage(null)
                            }
                            
                        }}
                    />
                    <button type="submit">Send to s3</button>
                </form>
            }
            {loggedIn && (
                <div style ={{ maxWidth:1000, overflow: 'wrap' }}>
                <br />
                <button onClick={getImages}>Get Images</button> 
                <ul style={{ listStyleType:'none' }}>
                    {Object.entries(imageList).map((x)=>{
                        return <li key={x[0]}><img alt={x[0]} width={"250px"} src={x[1]['s3_link']} />{
                            Object.entries(x[1]['labels']).map((labels)=>{
                                return <div key={labels[0]}>{labels[0]} (Confidence: {labels[1]})</div>
                            })
                            }</li>
                    })}    
                </ul>               
                </div>
                )  
            }
            
        </div>
      )
}
export default UploadImage;
