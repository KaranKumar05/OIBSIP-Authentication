
// Sign up Function
document.querySelector('#signup_form')
    .addEventListener('submit', async (event) => {
        event.preventDefault(event);
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;

        try {
            const resp = await axios.post('/api/v1/signup', {
                username: username,
                password: password
            });
            console.log("Respond: ", resp.status)
            if(resp.status === 200){
                alert(resp.data.message);
                // window.location.href = '/page/index.html'
            }
        } catch(e) {
            alert("Username Already Exists");
            console.log(e);
        }
    })