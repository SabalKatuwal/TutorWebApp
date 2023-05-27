const findMyLoc = () => {

    const status = document.querySelector('.status');   //.status is the class of that element

    const success = (position) => {
        console.log(position)
    }

    const error = () =>{
        status.textContent = 'Unable to retrieve users location'    
    }

    navigator.geolocation.getCurrentPosition(success, error);
    
}

document.querySelector('.find-status').addEventListener('click', findMyLoc);