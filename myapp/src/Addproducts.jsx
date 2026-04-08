import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { MdCancel } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom Hook for fetching data (reused from ProductDisplay)
const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err);
            toast.error(`Failed to load data from ${url}.`, { position: "top-right" });
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Framer Motion Variants (Define outside the component or memoize if inside)
// Keeping them outside for simplicity in this example
const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const inputVariants = {
    initial: { borderColor: '#ced4da' },
    focus: { borderColor: '#0d6efd', boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)', transition: { duration: 0.2 } }
};

const dropzoneVariants = {
     initial: { borderColor: '#ced4da', backgroundColor: '#f8f9fa' },
     active: { borderColor: '#0d6efd', backgroundColor: '#e9ecef', scale: 1.02, transition: { duration: 0.2 } },
     hover: { borderColor: '#0a58ca', backgroundColor: '#e9ecef', transition: { duration: 0.2 } }
};

 const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

 const buttonVariants = {
    hover: { scale: 1.02, boxShadow: '0px 4px 8px rgba(0, 123, 255, 0.2)' },
    tap: { scale: 0.98 }
};

// Separate component to handle image preview and URL cleanup
function ImagePreview({ imageFile, index, onCancel }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        // Create the object URL when the component mounts
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);

        // Cleanup function: revoke the URL when the component unmounts
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [imageFile]); // Dependency array includes imageFile

    if (!previewUrl) {
        // You could return a loading spinner or placeholder here
        return (
             <div
                className='m-2 border rounded d-flex justify-content-center align-items-center'
                style={{ width: "100px", height: "100px", backgroundColor: '#e9ecef' }}
             >
                Loading...
             </div>
        );
    }

    return (
        <motion.div
            // Key should be on the outermost element being animated/mapped
            key={index}
            className='position-relative m-2 border rounded overflow-hidden'
            style={{ width: "100px", height: "100px", backgroundColor: '#e9ecef' }}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover="hover"
            whileTap="tap"
            layout // Animate position changes in the grid
        >
            <img
                src={previewUrl}
                className="w-100 h-100 object-fit-cover"
                alt={`Preview ${index}`}
                // REMOVE onLoad={() => URL.revokeObjectURL(img.preview)} - cleanup is in useEffect
            />
            <button
                type="button"
                className='btn btn-danger btn-sm rounded-circle position-absolute'
                onClick={() => onCancel(index)}
                style={{
                    width: '24px',
                    height: '24px',
                    padding: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5,
                    top: '-8px', // Adjust these values as needed for positioning
                    right: '-8px', // Adjust these values as needed for positioning
                    // transform: 'translate(50%, -50%)' // Alternative for centering on corner
                }}
            >
                <MdCancel size={16} />
            </button>
        </motion.div>
    );
}


function Addproducts() {
    let navigate = useNavigate();
    const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetch("http://localhost:5000/category");

    // Store the original File objects, not the preview URLs directly
    let [images, setimages] = useState([]);
    let [categoryid, setCatId] = useState("");
    let [pname, setPname] = useState("");
    let [model, setModel] = useState("");
    let [description,setdescription]=useState("");
    let [price, setPrice] = useState("");
    let [errormsg, seterrormsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length + images.length > 5) {
            seterrormsg("Maximum 5 images allowed.");
            toast.warning("Maximum 5 images allowed.", { position: "bottom-right" });
            return;
        }
        seterrormsg("");
        // Store the original file objects
        setimages((existingimgs) => [...existingimgs, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: { 'image/*': [] }
    });

    //Image cancel handler
    const cancelHandler = useCallback((index) => {
        // The ImagePreview component's useEffect cleanup will handle revoking the URL
        const remainingimages = images.filter((_, i) => i !== index);
        setimages(remainingimages);
        seterrormsg("");
        toast.info("Image removed.", { position: "bottom-right", autoClose: 1000 });
    }, [images]); // Add images to dependency array as it's used in filter

    //Submithandler
    let submitHandler = async () => {
        if (!categoryid || categoryid === "-1" || !pname || !model || !description || !price || images.length === 0) {
            seterrormsg("Please fill in all fields and upload at least one image.");
            toast.error("Please fill in all fields and upload at least one image.", { position: "bottom-right" });
            return;
        }
        seterrormsg("");
        setIsSubmitting(true);

        const formHandler = new FormData();
        images.forEach((img) => { // Use the stored file objects
            formHandler.append("images", img);
        });
        formHandler.append("categoryid", categoryid);
        formHandler.append("pname", pname);
        formHandler.append("model", model);
        formHandler.append("description", description);
        formHandler.append("price", price);

        try {
            const response = await fetch("http://localhost:5000/addproducts", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: formHandler
            });
            const result = await response.json();
            console.log(result);

            if (response.ok) {
                toast.success("Product added successfully!", { position: "top-right" });
                navigate("/Productscard");
            } else {
                const errorData = result.message || "Failed to add product.";
                seterrormsg(errorData);
                toast.error(errorData, { position: "top-right" });
            }
        } catch (error) {
            console.error("Submission error:", error);
            seterrormsg("An error occurred during submission.");
            toast.error("An error occurred during submission.", { position: "top-right" });
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="container mt-5 mb-5">
             <ToastContainer />
            <motion.div
                className="card shadow-lg p-4 rounded-4 border-0"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                style={{ backgroundColor: '#ffffff' }}
            >
                <h2 className="text-center mb-4 fw-bold text-dark">Add New Product</h2>
                <hr className="mb-4" style={{ borderColor: '#e9ecef' }} />

                <div className="row g-4">
                    <div className="col-md-6">
                        <motion.div className="mb-4" whileFocus="focus" initial="initial" variants={inputVariants}>
                             {categoriesLoading ? (
                                 <div className="spinner-border spinner-border-sm text-secondary" role="status">
                                    <span className="visually-hidden">Loading Categories...</span>
                                 </div>
                             ) : categoriesError ? (
                                  <div className="text-danger">Error loading categories.</div>
                             ) : (
                                <select
                                    className='form-select form-select-lg rounded-pill shadow-sm'
                                    onChange={(e) => setCatId(e.target.value)}
                                    value={categoryid}
                                    style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                                >
                                    <option value="">Select Category</option>
                                    {categories && categories.map((data) =>
                                        <option key={data.categoryid} value={data.categoryid}>
                                            {data.categoryname}
                                        </option>
                                    )}
                                </select>
                             )}
                        </motion.div>

                         <motion.div className="mb-4" whileFocus="focus" initial="initial" variants={inputVariants}>
                            <input type='text' className='form-control form-control-lg rounded-pill shadow-sm'
                                id='productname'
                                name='productname'
                                placeholder="Product Name"
                                onChange={(e) => setPname(e.target.value)}
                                value={pname}
                                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                            />
                        </motion.div>

                        <motion.div className="mb-4" whileFocus="focus" initial="initial" variants={inputVariants}>
                             <input type='text' className='form-control form-control-lg rounded-pill shadow-sm'
                                id='model'
                                name='model'
                                placeholder="Model"
                                onChange={(e) => setModel(e.target.value)}
                                value={model}
                                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                            />
                        </motion.div>


                        <motion.div className="mb-4" whileFocus="focus" initial="initial" variants={inputVariants}>
                             <input type='text' className='form-control form-control-lg rounded-pill shadow-sm'
                                id='description'
                                name='description'
                                placeholder="description"
                                onChange={(e) => setdescription(e.target.value)}
                                value={description}
                                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                            />
                        </motion.div>

                        <motion.div className="mb-4" whileFocus="focus" initial="initial" variants={inputVariants}>
                            <input type='number' className='form-control form-control-lg rounded-pill shadow-sm'
                                id='price'
                                name='price'
                                placeholder="Price"
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                                min="0"
                            />
                        </motion.div>
                    </div>

                    <div className="col-md-6">
                         <motion.div
                            {...getRootProps()}
                            className={`drag-box text-center p-5 rounded-4 border-dashed d-flex flex-column justify-content-center align-items-center ${isDragActive ? 'border-primary bg-light' : ''}`}
                            style={{
                                minHeight: '200px',
                                cursor: 'pointer',
                                transition: 'border-color 0.3s ease, background-color 0.3s ease, scale 0.2s ease',
                                borderColor: isDragActive ? '#0d6efd' : '#ced4da',
                                backgroundColor: isDragActive ? '#e9ecef' : '#f8f9fa',
                                borderWidth: '2px',
                                borderStyle: 'dashed',
                                color: isDragActive ? '#0a58ca' : '#6c757d'
                            }}
                            variants={dropzoneVariants}
                            initial="initial"
                            animate={isDragActive ? "active" : "initial"}
                            whileHover="hover"
                         >
                            <input {...getInputProps()} />
                            <p className="lead mb-0">
                                <i className="bi bi-cloud-arrow-up me-2"></i>
                                {isDragActive ? 'Drop the files here...' : 'Drag & drop images here, or click to select files'}
                            </p>
                            <small className="text-muted mt-2">Max 5 images, up to X MB each (optional, specify size limit)</small>
                        </motion.div>

                        {errormsg && <div className="alert alert-danger mt-3" role="alert">{errormsg}</div>}

                        <motion.div className='d-flex flex-wrap mt-3' layout>
                             <AnimatePresence>
                                {/* Use the separate ImagePreview component */}
                                {images.map((imgFile, index) => (
                                    <ImagePreview
                                        key={index} // Important for mapping and AnimatePresence
                                        imageFile={imgFile} // Pass the original file object
                                        index={index}
                                        onCancel={cancelHandler} // Pass the cancel handler
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <motion.button
                        type='button'
                        onClick={submitHandler}
                        className='btn btn-primary btn-lg rounded-pill px-5 py-3'
                        disabled={isSubmitting || categoriesLoading}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                         style={{ transition: 'background-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease' }}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Adding Product...
                            </>
                        ) : (
                            'Add Product'
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

export default Addproducts;