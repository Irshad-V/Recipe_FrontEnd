// Function to get a cookie by name
function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    return null;
}



const handleUserID = () => {
    const jwtToken = getCookie('jwtToken');

    if (jwtToken) {
        return window.localStorage.getItem('userID');
    } else {
        window.localStorage.removeItem('userID');
        window.localStorage.clear();
        return null;
    }
}


export default handleUserID;
