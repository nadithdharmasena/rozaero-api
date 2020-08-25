
function handleRefreshTrack () {

    let tokenInput = document.getElementById("token5");
    let displayNameInput = document.getElementById("display_name5");
    let codeInput = document.getElementById("code2");

    let token = tokenInput.value;
    let display_name = displayNameInput.value;
    let code = codeInput.value;

    let data = {
        token: token,
        display_name: display_name,
        code: code
    };

    let request = fetch("/refresh_track", {
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