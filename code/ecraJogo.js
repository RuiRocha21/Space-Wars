"use strict";
(function()
{
	window.addEventListener("load", main);
}());

function main(){
	var canvas = document.getElementById("canvas");
	canvas.width = 1000;
	canvas.height = 590;
	var jogo = new Jogo();
		
	jogo.init(canvas);

	//arranque do jogo
	jogo.start();

    var keydown = function(e) {
        var keycode = e.which || window.event.keycode;
        //  seta esquerda, seta direita, espaco (37/29/32)
        if(keycode == 37 || keycode == 39 || keycode == 32) {
            e.preventDefault();
        }
        jogo.keyDown(keycode);
    }
	
    var keyup =  function(e) {
        var keycode = e.which || window.event.keycode;
        jogo.keyUp(keycode);
    }

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup",keyup);
}