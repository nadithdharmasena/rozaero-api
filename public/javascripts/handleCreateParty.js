
function handleCreateParty () {

    let tokenInput = document.getElementById("token2");
    let displayNameInput = document.getElementById("display_name2");
    let partyNameInput = document.getElementById("party_name");
    let playlistIDInput = document.getElementById("playlist_id");
    let trackTotalInput = document.getElementById("track_total");
    let latitudeInput = document.getElementById("latitude");
    let longitudeInput = document.getElementById("longitude");
    let radiusInput = document.getElementById("radius");

    let token = tokenInput.value;
    let display_name = displayNameInput.value;
    let name = partyNameInput.value;
    let playlist_id = playlistIDInput.value;
    let track_total = trackTotalInput.value;
    let latitude = latitudeInput.value;
    let longitude = longitudeInput.value;
    let radius = radiusInput.value;

    let data = {
        token: token,
        display_name: display_name,
        name: name,
        playlist_id: playlist_id,
        track_total: track_total,
        latitude: latitude,
        longitude: longitude,
        radius: radius
    };

    let request = fetch("/create_party", {
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