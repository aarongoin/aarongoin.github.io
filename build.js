const 
	fs = require('fs'),
	foldAndBelow = /\<!--FOLD--\>[\s\S]*/m,
	mainSection = /\<section id="posts"\>[\s\S]*\<\/section\>/m;

// get list of posts
var posts = fs.readdirSync("./post", "utf8").reverse(),
	rendered = '<section id="posts">',
	file,
	i = -1;
// compile all above-fold text from every post in post directory
while (++i < posts.length) if (posts[i] !== "YYYY-MM-DD_TEMPLATE" && posts[i] !== ".DS_Store") {
	console.log(posts[i] + "\n");

	file = fs.readFileSync("./post/" + posts[i], "utf8");

	rendered += '<article class="box">';
	rendered += file.replace(foldAndBelow, "");
	rendered += '<div><span class="fold" data-url="post/' + posts[i] + '">more</span></div>';
	rendered += '</article>';
}

rendered += "</section>"

var index = fs.readFileSync("./index.html", "utf8");

index = index.replace(mainSection, rendered);

fs.writeFileSync("./index.html", index, "utf8");