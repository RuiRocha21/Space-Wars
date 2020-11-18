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
    
	var btnJogar = document.getElementById("jogar");
	if(btnJogar){
		btnJogar.addEventListener("click",jogar);
	}

	var btnAjuda = document.getElementById("ajuda");
	if(btnAjuda){
		btnAjuda.addEventListener("click",ajuda);
	}

	var btnScore = document.getElementById("score");
	if(btnScore){		
		btnScore.addEventListener("click",score);
	}

	var btnOpcoes = document.getElementById("opcoes");
	if(btnOpcoes){
		btnOpcoes.addEventListener("click",opcoes);
	}

	var btnCreditos = document.getElementById("creditos");
	if(btnCreditos){
		btnCreditos.addEventListener("click",creditos);
	}

	var btnSair = document.getElementById("sair");
	if(btnSair){
		btnSair.addEventListener("click",sair);
	}
}

function jogar(ev){
	parent.postMessage("ecraJogo.html","*");
}

function ajuda(ev){
	parent.postMessage("ajuda.html","*");
}

function score(ev){
	parent.postMessage("score.html ","*");
}

function opcoes(ev){
	parent.postMessage("opcoes.html","*");
}

function creditos(ev){
	parent.postMessage("creditos.html","*");
}

function sair(ev)
{
	parent.postMessage("sair","*");
	window.close();
}