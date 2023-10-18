let api_key = 'AIzaSyB9GI92hqiigUTOZg61O3B9uGVhfqy1e3k';
let api_key2 = 'AIzaSyCHNqE9putPjoS55mqyIcHJjFWTd3_t5J4';
let fileId = 'co-cc-ay';
let folderId = '1IT2v0jCp77Ar5vsPFXHt_rW02avQSZLg';

const urlList = `https://www.googleapis.com/drive/v2/files?q='${folderId}'+in+parents&key=${api_key}
`;
const urlList2 = `https://www.googleapis.com/drive/v2/files?q='${folderId}'+in+parents&key=${api_key2};
`;

const videoEle = document.querySelector('.video');
const listVideosEle = document.querySelector('.listVideos');

const videos = await fetch(urlList)
    .then((res) => {
        if (res.status - 200 > 100) return new Promise.reject();
        return res.json();
    })
    .then((data) => data.items)
    .catch(async () => {
        await fetch(urlList2)
            .then((res) => {
                return res.json();
            })
            .then((data) => data.items);
    });

videos.forEach((item) => {
    const str = `<li class='linkVideo' idVideo="${item.id}">
        <p class="idVideo">Id: ${item.id}</p>
        <p>Title: ${item.title}</p>
    </li>`;

    listVideosEle.innerHTML = listVideosEle.innerHTML + str;
});

const links = document.querySelectorAll('.linkVideo');

links.forEach((link) => {
    link.onclick = () => {
        document.querySelector('.linkVideo.active')?.classList.remove('active');
        fileId = link.getAttribute('idVideo');
        handleVideoStream(fileId);
        link.classList.add('active');
    };
});

async function handleVideoStream(idVide) {
    await fetch(`https://www.googleapis.com/drive/v2/files/${idVide}?&key=${api_key}`).then((res) =>
        res
            .json()
            .then((data) => data.downloadUrl)
            .then((url) => {
                videoEle.src = url;
            }),
    );
}
