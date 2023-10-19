const apiUrl = 'https://653086f86c756603295ebc3e.mockapi.io/';
const apiGoogleDrive = 'https://www.googleapis.com/drive/v2/files';

// function call api
async function fetchAPI(url) {
    const data = await fetch(url).then((res) => res.json());
    return data;
}

// get url apis google
function getGoogleApiFolder(key, id) {
    return `${apiGoogleDrive}?q='${id}'+in+parents&key=${key}`;
}

function getGoogleApiFile(key, id) {
    return `${apiGoogleDrive}/${id}?&key=${key}`;
}

// call api to get key for google api
const keyGoogleApis = await fetchAPI(`${apiUrl}keys`);

// call api to get folders
const idFolder = await fetchAPI(`${apiUrl}folders`).then((data) => data[0].idFolder);

// Get Elements
const listVideosEle = document.querySelector('.listVideos');
const videoEle = document.querySelector('.video');
videoEle.volume = 0.1;

// videos stored list of videos in google drive folder
const videos = await fetchAPI(getGoogleApiFolder(keyGoogleApis[0].key, idFolder))
    .then((data) => {
        // if request is success then return list of videos else reject the promise
        if (!data.error) return data.items;
        return Promise.reject();
    })
    .catch(async () => {
        // request the api with another key
        await fetch(getGoogleApiFolder(keyGoogleApis[1].key, idFolder)).then((data) => data.items);
    });

// List videos from Google Drive API to list videos Element
if (!videos) {
    listVideosEle.innerHTML = `<h2 class='empty'>Empty Video List</h2>`;
} else {
    videos.forEach(
        (video, index) =>
            (listVideosEle.innerHTML =
                listVideosEle.innerHTML +
                `
            <li class='linkVideo' idVideo="${video.id}">
            <p><label>${index + 1}.</label> ${video.title}</p>
            </li>
            `),
    );
}

// get all linkVideo elements which list from Google Drive API
const links = document.querySelectorAll('.linkVideo');

// addEventListener for each video title element to play and add class active for each one
links.forEach((link) => {
    link.onclick = () => {
        document.querySelector('.linkVideo.active')?.classList.remove('active');
        const fileId = link.getAttribute('idVideo');
        handleVideoStream(fileId);
        link.classList.add('active');
    };
});

async function handleVideoStream(idVide) {
    await fetchAPI(getGoogleApiFile(keyGoogleApis[0].key, idVide))
        .then((data) => {
            if (!data.error) return data.downloadUrl;
            return Promise.reject();
        })
        .then((url) => {
            videoEle.src = url;
        })
        .catch(async () => {
            // request the api with another key
            await fetch(getGoogleApiFile(keyGoogleApis[1].key, idVide))
                .then((data) => data.downloadUrl)
                .then((url) => (videoEle.src = url));
        });
}
