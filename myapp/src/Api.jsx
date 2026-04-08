import { useEffect, useState } from "react"

function Products() {

    let [prodts, setprodts] = useState([])
    let getdata=async()=>
    {
        let response = await fetch('https://fakestoreapi.com/products')
        let result = await response.json()
        setprodts(result)
    }
    useEffect( () => {
        getdata()
    }, [])


    console.log(prodts)
    return (<>

        <div className="container">
            <div className="row">
                {
                    prodts.map((data)=>
                        {
                            return(
                                <>
                                <div className="col-lg-4">
                                <div class="card" >
          <img src={data.image} class="card-img-top" alt="..."></img>
          <div class="card-body">
            <h5 class="card-title">{data.title}</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div></div>
                                </>
                            )
                        
    
                        })
                }
            </div>
        </div>
        <div className='container my-4'>
</div>
<footer className='text-white text-center py-3 fixed-bottom' style={{backgroundColor: "rgb(92, 64, 184)"}}>
  prakash@gmail.com
</footer>


    </>)

}
export default Products
