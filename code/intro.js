(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	
	var btn = document.getElementById("intro");
	
	
	showPage();
	btn.addEventListener("click", btIntro);  //escutar clicks no botão de navegação
	window.addEventListener("message", messageHandler);
}

function messageHandler(ev)
{
	if(ev.data=="next"){
		showPage();
	}
}

function showPage()
{
	parent.postMessage("next","*");
	//carregar página na frame e enviar mensagem para a página logo que esteja carregada (frameLoadHandler)
	var frm = document.getElementsByTagName("iframe")[0];
	frm.src = "../html/menuPrincipal.html";
}

function btIntro(ev){
	var frm = document.getElementsByTagName("iframe")[0];
	var frmName = frm.src;
	showPage();
}