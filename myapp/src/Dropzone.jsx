import React,{useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {MdCancel} from 'react-icons/md'
import './Dropzone.css'
function Dropzone() {
    const [images, setImages] = useState([]);
    const [errormessage,setErrormessage]=useState("")
    const [fname,setName]=useState("")
    const onDrop=(acceptFiles)=>
    {
        if(images.length+acceptFiles.length>5)
        {
          setErrormessage("5 images only")
          return;
        }
        setErrormessage("")
        const filePreviews= acceptFiles.map((file)=>(
            {
                file,
                preview:URL.createObjectURL(file)
            }

        ))
        console.log(filePreviews)
        setImages((previmages)=>[...previmages,...filePreviews])
    }
let cancelHandler=(ind)=>
{
    setImages((previmages)=>(previmages.filter((_,index)=>index!=ind))) 
}
  let {getRootProps,getInputProps}  = useDropzone({
    onDrop,
    multiple:true,
    accept:'Images/*'
  })

  let submitHnadler=()=>
  {
    const formdata=new FormData()
    images.forEach((img)=>
    {
       formdata.append("image",img.file)
    })
    formdata.append(fname)

    fetch("http://localhost:5000/saveimage",{
      method:'post',
      body:formdata
    })
  }
    return (
        <div className="upload-container">

            <input
                type="text"
                placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}

                className="username-input"
            />
    <div  {...getRootProps()} className='drag-box'>
        <input {...getInputProps()}></input>
        <p className="drag-text">Drag & Drop your images here</p>
        <p className="drag-text">or Click to Select Files</p>

    </div>
    {
      errormessage&&<><div className='error-message' style={{color:"red"}}>{errormessage}</div></>
    }
    <div className="image-thumbnails">
        {images.map((img, index) => (
          <div className="thumbnail" key={index}>
            <img src={img.preview} alt="Preview" className="thumbnail-image" />
            <button className='cancel-btn' onClick={()=>cancelHandler(index)}>

            <MdCancel/>
            </button>
          </div>
        ))}
      </div>
<div>
  <button style={{width:"90px",padding:"5px",marginTop:"25px",borderRadius:"35px",}}
   disabled={images.length==0} onClick={submitHnadler}>SUBMIT</button>
</div>
        </div>
    )
}

export default Dropzone;
