"use strict";

var mute = false;
var volumeSom = 50;
var som;

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	//adicionar som na pagina principal
	window.addEventListener("message", mensagemRecebida);
	var paginaInit = "../html/intro.html";
	showPage(paginaInit);

}

function showPage(numPagina)
{
	//carregar página na frame e enviar mensagem para a página logo que esteja carregada (frameLoadHandler)
	var frm = document.getElementsByTagName("iframe")[0];
	frm.src = numPagina;
}

function hidePage(pageNum)  //não é necessário (excepto se páginas diferentes tivessem zonas de navegação diferentes)
{
	var frm = document.getElementsByTagName("iframe")[0];
	frm.src = "";
}

function mensagemRecebida(ev)
{
	/*
	if(ev.data=="sair"){
		window.close();
	}*/
	var frm = document.getElementsByTagName("iframe")[0];
	var str = ev.data.split(" ");
	hidePage(frm.src);
	if(str[0] == "ecraJogo.html"){
		showPage(str[0]);
	}else if(str[0] == "opcoes.html"){
		showPage(str[0]);
	}else if(str[0] == "score.html"){
		showPage(str[0]);
	}else if(str[0] == "ajuda.html"){
		showPage(str[0]);
	}else if(str[0] == "creditos.html"){
		showPage(str[0]);
	}else if(str[0]== "voltar"){
		showPage("menuPrincipal.html");
	}else if(str[0] =="sair"){
		window.close();
	}
}

