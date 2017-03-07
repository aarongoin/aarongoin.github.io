// first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.raf = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function(){
	var	posts = document.getElementsByClassName('expand'),
		more,
		i,
		isLooping = false,
		html = document.documentElement,
		windowOffset = window.pageYOffset || (html.clientHeight ? html : document.body).scrollTop,

		handleScroll = function() {
			windowOffset = window.pageYOffset || (html.clientHeight ? html : document.body).scrollTop;
		},

		scroll = function() {
			scrollTo(0, this.y);
		},

        loop = function() {
			window.raf(loop);
			TWEEN.update();
		},

		collapseArticle = function() {
			var expanded = this.parentNode,
				more = expanded.lastChild;
			// remove all child nodes
			while (expanded.lastChild) expanded.removeChild(expanded.lastChild);

			more.textContent = "more";
			more.removeEventListener('click', collapseFrame);
			more.addEventListener('click', expandArticle);

			expanded.appendChild(more);
		},
		expandArticle = function() {
			var expanded = this.parentNode; // outer div
			this.textContent = "loading...";
			// request post
			Rest('GET', this.dataset.url, 'text/html', function(html){ // on success
				var more = expanded.removeChild(expanded.children[0]); // pull button out of div
				more.textContent = "less";
				more.removeEventListener('click', expandArticle);
	    		more.addEventListener('click', collapseArticle);
				expanded.innerHTML = html;
				expanded.appendChild(more); // put button below the new content
			});
		},
		Rest = function(message, path, type, onSuccess, onError) {
			var request = new XMLHttpRequest();
			request.onreadystatechange = function () {
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status === 200) onSuccess(request.response);
					else if (onError) onError(r);
				}
		    };
			request.open(message, path);
			request.responseType = type;
			request.send();
		};

	// add post expanding behavior to all articles
	i = posts.length;
	while (i--) {
		posts[i].addEventListener('click', expandArticle);
	}

	window.addEventListener('scroll', handleScroll);
    window.onunload = function() {
    	window.removeEventListener('scroll', handleScroll);
    }
    document.getElementById('scroller').addEventListener('click', function() {
    	var pos,
    		tween;

    	if (windowOffset !== 0) {
    		pos = {y: windowOffset};
    		tween = new TWEEN.Tween(pos).to({y: 0}, (windowOffset > 1000) ? 1000 : windowOffset );

    		tween.onUpdate(scroll);
	    	tween.easing(TWEEN.Easing.Exponential.Out);
	    	tween.start();
	    	if (!isLooping) {
	    		isLooping = true;
	    		loop();
	    	}
    	}
    });

})();