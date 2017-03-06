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
		frame = document.createElement('iframe'),
		expanded,
		more,
		i,
		isLooping = false,
		html = document.documentElement,
		windowOffset = window.pageYOffset || (html.clientHeight ? html : document.body).scrollTop,

		handleScroll = function() {
			windowOffset = window.pageYOffset || (html.clientHeight ? html : document.body).scrollTop;
		},

		handleResize = function() {
			if (frame.parentNode) frame.style.height = (frame.contentDocument.body.clientHeight + 60) + 'px';
		},

		scroll = function() {
			scrollTo(0, this.y);
		},

        loop = function() {
			window.raf(loop);
			TWEEN.update();
		},

		expand = function() {
			frame.style.height = this.y + 'px';
		},

		insertFrame = function() {
			more = expanded.removeChild(expanded.children[0]);
			more.textContent = "loading...";
			expanded.appendChild(frame);
			expanded.appendChild(more); // put button below the iframe
		},
		collapseArticle = function() {
			expanded.removeChild(frame);
			more.textContent = "more";
			more.removeEventListener('click', collapseFrame);
			more.addEventListener('click', expandArticle);
		},

		collapseFrame = function() {
			var pos = {y: frame.clientHeight},
    			tween = new TWEEN.Tween(pos).to({y: 0}, 1000);

	    	tween.onUpdate(expand);
	    	tween.onComplete(function() {
	    		window.raf(collapseArticle);
	    	});
	    	tween.easing(TWEEN.Easing.Exponential.InOut);
	    	tween.start();
	    	if (!isLooping) {
	    		isLooping = true;
	    		loop();
	    	}
		}

		expandFrame = function() {
			var pos = {y: 0},
    			tween = new TWEEN.Tween(pos).to({y: frame.contentDocument.body.clientHeight + 60}, 1000);

	    	tween.onUpdate(expand);
	    	tween.onComplete(function() {
	    		window.raf(function() {
	    			more.textContent = "less";
	    			more.removeEventListener('click', expandArticle);
	    			more.addEventListener('click', collapseFrame);
	    		});
	    	});
	    	tween.easing(TWEEN.Easing.Exponential.InOut);
	    	tween.start();
	    	if (!isLooping) {
	    		isLooping = true;
	    		loop();
	    	}
		},

		expandArticle = function() {
			if (expanded && expanded.parentNode !== this) {
				more.textContent = "more"
			}
			expanded = this.parentNode;
			frame.src = this.dataset.url;
			frame.style.height = '0px';
			frame.style.width = '100%';
			frame.style.borderStyle = 'none';
			frame.onload = expandFrame;
			window.raf(insertFrame);
		};

	i = posts.length;
	while (i--) {
		posts[i].addEventListener('click', expandArticle);
	}

	window.addEventListener('scroll', handleScroll);
	window.addEventListener('resize', handleResize);

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