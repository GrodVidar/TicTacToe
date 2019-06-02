const url = "http://5cd130b0d4a78300147be599.mockapi.io/Score";

var hiscore = document.getElementById("highScore");
fetch(url)
    .then(resp => resp.json())
        .then(data =>
        {
            change = data;
            change.sort(compare);
            for(var i=0;i<3;i++)
            {
                console.log()
                hiscore.innerHTML += change[i].name + ": " + String(change[i].score) + "<br>"
            }
        })


function compare(a, b)
{
    return b.score - a.score;
}
