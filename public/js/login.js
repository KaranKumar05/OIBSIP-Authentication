
// login Function 
document.querySelector('#login_form')
    .addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;

        try {
            const resp = await axios.post('/api/v1/login', {
                username: username,
                password: password
            });
            console.log("Respond: ", resp.status)
            if (resp.status === 200) {
                alert("Login Successfully");
                // window.location.href = '/page/index.html'
                window.location.href = '/securePage/index.html'

            }
        } catch (e) {
            alert("Invalid Username or Password");
            console.log(e);
        }
    })
