console.log("javascript");
let currentSong=new Audio;

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs

}
const playmusic = (music)=>{
    // let audio = new Audio("/songs/"+music)
    currentSong.src = "/songs/"+ music
    currentSong.play()
}

async function main() {
    let songs = await getSongs()
    console.log(songs);

    //push songs to library
    let songsUL = document.querySelector(".songlist")
    let songUL = songsUL.getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img src="music.svg" alt="">
                            <div class="songname">
                              ${song.replaceAll("%20", " ")}
                            </div>
                            <div class="playnow">
                              <span>Play now</span>
                              <img src="play.svg" alt="">
                            </div></li>`;
    }
    let songlist = document.querySelector(".songlist").getElementsByTagName("li")
    Array.from(songlist).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".songname").innerText);
            playmusic(e.querySelector(".songname").innerText.trim())

        })
        
        
    });

   
}
main()