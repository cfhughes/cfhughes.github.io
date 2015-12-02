var pages= ['facebook','reddit','nytimes','ebay','okcupid','google','youtube','craigslist','apple','amazon'];
var num = 10;

$(function(){

    var paths = [];
    var data = [];
    var init = function(){

        paths = [];
        data = [];
        data[0] = [];
        $("path").each(function(){
            paths.push($(this).get(0));
            var hist = [];
            var segments = $(this).get(0).pathSegList;
            for(var i = 0;i<segments.length;i++){
                hist[i] = [segments.getItem(i).x,segments.getItem(i).y];
            }
            data[0].push(hist);
        });

        for(var i = 1;i<50;i++){
            var hist = [];
            for(var j = 0;j<data[i-1].length;j++){
                hist[j] = [];
                for (var k = 0;k<data[i-1][j].length;k++){
                    hist[j][k] = [];
                    hist[j][k][0] = data[i-1][j][k][0] + (Math.random() * 12) - 6;
                    var factor = Math.pow(i,3);
                    var d = factor/2;
                    if (c % 3 == 1){
                        d = 0;
                    }
                    hist[j][k][1] = data[i-1][j][k][1] + (Math.random() * factor) - d;
                }
            }
            //console.log("Entry added with "+hist.length+" entries");
            data.push(hist);
        }

    };

    init();

    var prevx = 0;
    var diff = 0;

    var update = function(){
        var posX = Math.floor(currentMousePos.x*50/window.innerWidth);
        if (Math.abs(posX - prevx) > diff) {
            diff++;
        } else if (diff > 0) {
            diff--;
        }
        if (diff == 0){
            $("#main").hide();
            $("#start").show();
        }else {
            $("#start").hide();
            $("#main").show();
            //console.log("Position: "+diff);
            for (var k = 0; k < paths.length; k++) {
                var segments = paths[k].pathSegList;
                for (var i = 0; i < segments.length; i++) {
                    segments.getItem(i).y = data[diff][k][i][1];
                    segments.getItem(i).x = data[diff][k][i][0];
                }
            }
        }
        prevx = posX;
    }

    var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

    window.setInterval(update, 100);
    var c = 0;
    $("body").click(function(){
        c++;
        if (c == num)c=0;

        $("#start").attr('src',"src/"+pages[c]+".png");
        $("#main").load("src/"+pages[c]+".svg",function(){
            init();
        })
    });
});
