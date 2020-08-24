
function handlePlay () {

    let tokenInput = document.getElementById("token3");
    let displayNameInput = document.getElementById("display_name3");
    let codeInput = document.getElementById("code");
    let trackInput = document.getElementById("track_id");

    let token = tokenInput.value;
    let display_name = displayNameInput.value;
    let code = codeInput.value;
    let track_id = trackInput.value;

    let data = {
        token: token,
        display_name: display_name,
        code: code,
        track_id: track_id
    };

    let request = fetch("/play", {
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