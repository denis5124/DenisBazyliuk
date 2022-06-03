var cards = {
    
        imgUrl: "images/1_0_a0f3f020-6305-420a-aa4a-975967158fe7 1.png",
        firm: "Burton:"
    
}

var ul = document.querySelector ('.products ul');
var htmlStr = '';

for(var i=0; i<cards.length; i++){
    htmlStr += '
    <ul>
        <img src="${cards[i].imgUrl" alt = "">
        <p>${cards[i].title}</p>
    </ul>
    '
}

ul.innerHTML = htmlStr

console.log ("hello");