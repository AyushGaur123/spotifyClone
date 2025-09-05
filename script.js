let currentSong = new Audio()
let songs
let currFolder



function secondsToMMSS(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return String(mins).padStart(2, '0')
        + ':' + String(secs).padStart(2, '0');
}

async function getSongs(folder) {
    currFolder = folder;
    let a =  await fetch(`/${folder}/`)
    let response = await a.text();
    console.log(response)
    
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    
    songs = []
    for (let i = 0; i < anchors.length; i++) {
        const element = anchors[i];
       
        
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
              
        }
    }

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img src="Images/music.svg" >
        <div class="songname pointer">
            <div> ${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playnow pointer">
            <span>Play Now</span>
            <img class="playIcon"  src="Images/play.svg" >
        </div></li>`
    }

    let songList = document.querySelector(".songlist").getElementsByTagName("li")
    Array.from(songList).forEach(e => {
        e.addEventListener("click", element => {
            let name = e.querySelector(".songname").firstElementChild.innerHTML.trim()
            console.log(name);
            
            playMusic(name)
        })
    })

    return songs
}

const playMusic = (music, pause = false) => {
    currentSong.src = `/${currFolder}/` + music
    if (!pause) {
        currentSong.play()
        playSong.src = "Images/pause.svg"
    }
    document.querySelector(".title").innerHTML = decodeURI(music)
    document.querySelector(".duration").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    let big_box = document.querySelector(".big_box")
    let songList = document.querySelector(".songlist")
    let box = document.querySelector(".box")
    let box1 = document.querySelector(".box1")


    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") ) {                    
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            big_box.innerHTML = big_box.innerHTML + `  <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
                            <circle class="circle"></circle>
                                <path d="M40 30 Q40 25, 45 28 L70 48 Q75 50, 70 52 L45 72 Q40 75, 40 70 Z"
                                    fill="#000000" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h1>${response.title}</h1>
                        <p>${response.description}</p>
                      
                        </div>`


        }
    }

    
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            songList.classList.remove("hide")
            box.classList.add("hide")
            box1.classList.add("hide")

            
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })

}
async function displayAlbums2() {
    let a = await fetch(`/songs1/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    
    let songList = document.querySelector(".songlist")
    let box = document.querySelector(".box")
    let box1 = document.querySelector(".box1")

    let bigbox2 = document.querySelector(".bigbox2")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs1") ) {                      
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`/songs1/${folder}/info.json`)
            let response = await a.json();

            bigbox2.innerHTML = bigbox2.innerHTML + `<div data-folder="${folder}" class="card2"> 
                        <img src="/songs1/${folder}/cover.jpeg" >
                        <p>${response.title}</p>
                      
                        </div>`;
        }
    }

    Array.from(document.getElementsByClassName("card2")).forEach(e => {
        e.addEventListener("click", async item => {
         
            songList.classList.remove("hide")
            box.classList.add("hide")
            box1.classList.add("hide")

            songs = await getSongs(`songs1/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}

async function main() {

    await getSongs("songs/asd")
    playMusic(songs[0], true)

    await getSongs("songs1/zxcv")
    playMusic(songs[0], true)

    await displayAlbums()
    await displayAlbums2()

    playSong.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playSong.src = "Images/pause.svg"
        }
        else {
            currentSong.pause()
            playSong.src = "Images/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".duration").innerHTML = `${secondsToMMSS(currentSong.currentTime)} / ${secondsToMMSS(currentSong.duration)}`
        document.querySelector(".dot").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seek").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".dot").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    prevSong.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    nextSong.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

    document.querySelector(".mute").addEventListener("click", e => {
        if (e.target.src.includes("Images/volume.svg")) {
            e.target.src = e.target.src.replace("Images/volume.svg", "Images/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("Images/mute.svg", "Images/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
}

main() 