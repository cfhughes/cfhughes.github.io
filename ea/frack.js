var pages= ['facebook','reddit','nytimes','ebay','okcupid','google','youtube','craigslist','apple','amazon'];
var num = 10;
var p1;
var paths = [];
var loaded=false;
$(function(){

    var data = [];

    var init = function(){

        paths = [];
        data = [];
        data[0] = [];
        $("path").each(function(){
            paths.push($(this).get(0));
            var hist = [];
            var segments = $(this).get(0).getPathData();
            for(var i = 0;i<segments.length;i++){
                hist[i] = [segments.getItem(i).x,segments.getItem(i).y];
            }
            data[0].push(hist);
        });

        //console.log("Paths: "+paths.length);

        for(var i = 1;i<50;i++){
            var hist = [];
            var factor = Math.pow(i,3)/5;
            var d = factor/2;
            //console.log(c);
            if (c % 3 == 1){
                d = 0;
            }
            for(var j = 0;j<data[i-1].length;j++){
                hist[j] = [];
                for (var k = 0;k<data[i-1][j].length;k++){
                    hist[j][k] = [];
                    hist[j][k][0] = data[i-1][j][k][0] + (Math.random() * 12) - 6;
                    hist[j][k][1] = data[i-1][j][k][1] + (Math.random() * factor) - d;
                }

                //$(paths[j]).show();
            }
            //console.log("Entry added with "+hist.length+" entries");
            data.push(hist);
        }
        $("body").css('cursor','none');
        loaded = true;
    };

    //******Assemble******

    var enable_assemble = function(){
        $("#start").hide();
        $("#main").show();
        for (var k = 0; k < paths.length; k++) {
            var segments = paths[k].pathSegList;
            for (var i = 0; i < segments.length; i++) {
                segments.getItem(i).y = data[0][k][i][1];
                segments.getItem(i).x = data[0][k][i][0];
            }
        }
        p1=0;
        var disassemble = window.setInterval(function(){
            for (var p2 = p1;p2<paths.length;p2+=10){
                $(paths[p2]).hide();
            }
            if (p1 >= 9){
                window.clearInterval(disassemble);
                p1 = 0;
                var assemble = window.setInterval(function(){
                    for (var p2 = p1;p2<paths.length;p2+=10){
                        $(paths[p2]).show();
                    }
                    if (p1 >= 9){
                        window.clearInterval(assemble);
                        $("#main").hide();
                        $("#start").show();
                    }
                    p1++;
                },400);
            }else {
                p1++;
            }
        },400);
    };

    //******Fracture******
    var update = function () {
        var posX = Math.floor(currentMousePos.x * 50 / window.innerWidth);
        if (Math.abs(posX - prevx) > diff) {
            diff++;
        } else if (diff > 0) {
            diff--;
        }
        if (diff == 0) {
            $("#main").hide();
            $("#start").show();
        } else {
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
    };
    var diff;
    var prevx = 0;
    var updateI;
    var enable_fracture = function() {
        window.clearInterval(chaosI);
        $("#main").hide();
        $("#start").show();

        diff = 0;
        updateI = window.setInterval(update, 100);

    };

    //******Chaos******

    var p = 0;
    var chaos = function(){
        for (var k = 0; k < paths.length; k++) {
            var segments = paths[k].pathSegList;
            for (var i = 0; i < segments.length; i++) {
                segments.getItem(i).y+=(Math.random() * .8) - .4;
                segments.getItem(i).x+=(Math.random() * .8) - .4;
            }
        }
    };
    var chaosI;
    var enable_chaos = function(){
        $("#start").hide();
        $("#main").show();
        for (var k = 0; k < paths.length; k++) {
            var segments = paths[k].pathSegList;
            for (var i = 0; i < segments.length; i++) {
                segments.getItem(i).y = data[0][k][i][1];
                segments.getItem(i).x = data[0][k][i][0];
            }
        }
        chaosI = window.setInterval(chaos, 100);

    };

    //*******Reset******
    var reset = function(){
        window.clearInterval(chaosI);
        window.clearInterval(updateI);
    };

    var start = Math.floor(Math.random()*num);
    var c = start;
    $("body").css('cursor', 'wait');
    $("#start").attr('src',"src/"+pages[c]+".png");
    $("#main").load("src/"+pages[c]+".svg",function(){
        init();
    });
    var mode = 0;
    $("body").click(function(){
        //Don't change while loading
        if (loaded) {
            if (mode == 6) {
                reset();
                $("#main").hide();
                $("#start").show();
                c++;
                if (c == num)c = 0;
                if (c == start){
                    //Stream
                    window.location.href = "https://www.google.com/";
                }
                $("body").css('cursor', 'wait');
                loaded = false;
                $("#start").attr('src', "src/" + pages[c] + ".png");
                $("#main").load("src/" + pages[c] + ".svg", function () {
                    init();
                });
            } else if (mode % 3 == 0) {
                reset();
                enable_assemble();
            } else if (mode % 3 == 1) {
                enable_chaos();
            } else if (mode % 3 == 2) {
                enable_fracture();
            }
            mode++;
            if (mode == 7)mode = 0;
        }
    });

    //*****Mouse Tracking*****
    var currentMousePos = { x: -1, y: -1 };
    $(document).mousemove(function(event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
    });

});
