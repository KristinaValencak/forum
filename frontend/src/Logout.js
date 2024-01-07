

function Logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
}

export default Logout
