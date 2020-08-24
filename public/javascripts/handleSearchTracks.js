
function handleSearchTracks () {

    let tokenInput = document.getElementById("token4");
    let displayNameInput = document.getElementById("display_name4");
    let searchStringInput = document.getElementById("search_string");
    let pageInput = document.getElementById("page");

    let token = tokenInput.value;
    let display_name = displayNameInput.value;
    let search_string = searchStringInput.value;
    let page = pageInput.value;

    let data = {
        token: token,
        display_name: display_name,
        search_string: search_string,
        page: page
    };

    let request = fetch("/search_tracks", {
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