
function handleLogin () {

    let emailInput = document.getElementById("email");
    let emailPassword = document.getElementById("password");

    let email = emailInput.value;
    let password = emailPassword.value;

    let data = {
        email: email,
        password: password
    };

    let request = fetch("/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    request.then(
        (docs) => {
            docs.text().then(
                (info) => {
                    console.log(info);
                }
            ).catch((error) => {});
        }
    ).catch((error) => {});

}