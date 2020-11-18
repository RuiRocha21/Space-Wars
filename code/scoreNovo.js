"use strict";

var volume = 50;

(function(){
	window.addEventListener("load", main);
}());


function main() {
	var som = new Audio('../resources/sounds/somEcraPrincipal.mp3');
	
	
    som.play();
    som.loop = true;
    som.volume = window.volume / 100;
	//acrescentar aqui maneira de guardar pontuacoes
	var x = document.getElementById("myText").value;
    document.getElementById("demo").innerHTML = x;

	var btnVoltar = document.getElementById("voltar");
	if(btnVoltar){
		btnVoltar.addEventListener("click",voltar);
	}
}

function voltar(ev){
	parent.postMessage("voltar","*");
}