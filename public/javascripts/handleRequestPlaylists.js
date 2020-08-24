
function handleRequestPlaylists () {

    let tokenInput = document.getElementById("token");
    let displayNameInput = document.getElementById("display_name");

    let token = tokenInput.value;
    let display_name = displayNameInput.value;

    let data = {
        token: token,
        display_name: display_name
    };

    let request = fetch("/get_playlists", {
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