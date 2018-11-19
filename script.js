var url = 'https://leandrojsa.github.io/'
var url1 = 'https://www.googleapis.com/youtube/v3/search?part=id&key={api_KEY}&maxResults=1&type=video&q=trailer+'
var lastTime;
var xhttp1 = new XMLHttpRequest();
var xhttp2 = new XMLHttpRequest();

var formOpts = {};

var movies;
var movieList = [];


var infoMovieHtml = '<h3 id="m-title"></h3>' +
'<div class="flex-center"><div><img style="display: none;" id="img-movie" alt="Resultado" src="">' +
'<div id="vidbox" style="display: none;"><p>Trailer:</p><iframe id="vid-frame" width="420" height="315" src=""></iframe></div></div>' +
'<span style="margin: 20px"></span>'+
'<div><p id="m-year"></p><p id="m-categ"></p><p id="m-sinops"></p><p id="m-actors"></p></div></div>';

xhttp1.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        $("#storage").html(getBody(this.responseText));

        movies = $('.movie');

        extractMovieList();
        getMovie(movieList[Math.floor(Math.random() * (movieList.length-1))]);
    } else if(this.readyState == 4) {
        alert("Não possível encontrar recursos :(");
        // research();
    }
    
    // $("#load-mess").attr('style','display: none;');
};
xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText);
        // console.log("YT - " + this.responseText,res);
        $("#vid-frame").attr('src','https://www.youtube.com/embed/' + res.items[0].id.videoId);
        $("#vidbox").attr('style','');
        
    } else {
        
    }

    $("#load-mess").attr('style','display: none;');
};

function loadSearch(ev,el){
    ev.preventDefault();
    lastTime = new Date();
    el.style['display'] = 'none';
    formOpts = {
        'actors': new String(el[0].value).split(','),
        'year': el[1].value,
        'category': el[2].value,
        'others': new String(el[3].value).split(' ')
    };
    xhttp1.open("GET",url + '/movies.html', true);
    xhttp1.send();
    $("#load-mess").attr('style','');
}

function extractMovieList() {

    var formState = formOpts.actors[0] || formOpts.year || formOpts.category || formOpts.others;
    if (!formState) {
        for (var m in movies) {

            // tratar :/



            movieList.push(movies[m]);
        }
    } else {
        movieList = movies;
    }
}


function getMovie(movie){

    // console.log("Capturado " + movies.length + " filmes.");

    // posso acessar seus filhos
    // pelo atributo children
    // $('#img-movie').attr('src',"https://leandrojsa.github.io/" + movies[0].children[0].attributes.src.value)

    // movies[x].children
    // [0].attributes.src.value  imagem
    // [1].textContent título
    // [2].textContent ano (Ano: XXXX)
    // [3].textContent sinopse
    // [5].children[y].textContent categorias
    // [7].children[y].textContent atores


    $("#m-title").html(movie.children[1].textContent);
    $("#m-year").html(movie.children[2].textContent);
    $("#m-sinops").html(movie.children[3].textContent);

    var mActors = 'Atores: ';
    var mCatego = 'Categorias: ';

    for (var a in movie.children[7].children) {
        if (movie.children[7].children[a].textContent)
            mActors += movie.children[7].children[a].textContent + "; ";
    }

    $("#m-actors").html(mActors);

    for (var c in movie.children[5].children) {
        if (movie.children[5].children[c].textContent)
            mCatego += movie.children[5].children[c].textContent + "; ";
    }
    $("#m-categ").html(mCatego);


    if (movie.children[0].attributes.src.value) {
        $("#img-movie").attr('src',url + movie.children[0].attributes.src.value).attr("style",'');
    }
    var mTitle = new String(movie.children[1].textContent).replace(/ /g,"+");

    xhttp2.open("GET",url1 + mTitle, true);
        
    xhttp2.send();
        
    $("#resbox").attr("style",'');
    $('#sec-req').html(Math.floor((new Date() - lastTime)/1000));

}



function remix() {
    // console.log("Remix clicked");
    $("#resbox").attr("style",'display: none;');
    $("#load-mess").attr('style','');
    $("#infomovie").html(infoMovieHtml);


    lastTime = new Date();
    getMovie(movieList[Math.floor(Math.random() * (movieList.length-1))]);
}

function research() {
    // console.log("Research clicked");
    $("#resbox").attr("style",'display: none;');
    $("#infomovie").html(infoMovieHtml);
    $('#form-movie').trigger('reset').attr('style','display: ""');
}

function getBody(content) 
{ 
    var x = content.indexOf("<body");
    if(x == -1) return "";
 
    x = content.indexOf(">", x);
    if(x == -1) return "";
 
    var y = content.lastIndexOf("</body>");
    if(y == -1) y = content.lastIndexOf("</html>");
    if(y == -1) y = content.length;    
    return content.slice(x + 1, y);   
}
