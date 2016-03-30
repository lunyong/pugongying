/**
 * Created by lenovo on 2015/10/15.
 */

function FlyDandelion(contextId){
    var theCanvas = document.getElementById(contextId);
    if(!theCanvas || !theCanvas.getContext) return;
    //让canvas适应屏幕的宽度
    theCanvas.setAttribute("width", window.screen.width);
    theCanvas.setAttribute("height", 500);
    var context = theCanvas.getContext("2d");
    if(!context) return;
    //天空背景
    var SkyBack = {
        src: "images/sky_bg.jpg"
    }
    //整株蒲公英树
    var DandelionTree = {
        src: "images/dandelion.png"
    }
    var canvasW = theCanvas.width;
    var canvasH = theCanvas.height;
    var dandelions = [];
    var staticDans = [];

    var maxNum = 10;//飘动的蒲公英数量
    var loaded = 0;//已加载完成的图片数量

    //加载动画所需的图片
    function loadImages(){
        loadSkyBackground();
        loadLargeDandelion();
        loadSmallDandelions();

        //loadSky();
        //loadSun();
        //loadCloud();
        //loadGrass();
    }
    //加载单个的小蒲公英
    function loadSmallDandelions(){
        var sdImg = new Image();
        sdImg.src = "images/dandelions.png";
        sdImg.onload = function () {
            loaded += 1;
            for(var i = 0; i < maxNum; i++){
                var danObj = new Dandelion(sdImg);
                //danObj.draw(context, sdImg);
                dandelions.push(danObj);
            }
            renderSmallDandelions();
        }
    }
    //适时渲染小蒲公英
    function renderSmallDandelions(){
        var tx = 0, ty = 0;
        var sdImg, newDan;
        for(var i=0; i<dandelions.length; i++){
            dandelions[i].update();//更新蒲公英的状态
            sdImg = dandelions[i].imgData;
            tx = dandelions[i].renderX + dandelions[i].halfWidth;
            ty = dandelions[i].renderY + dandelions[i].halfHeight;
            var uy = canvasH - 80;
            //如果飞舞的蒲公英超出了canvas的范围，就把这个对象删掉，重新产生一个新的
            if( tx< -dandelions[i].renderW || tx > canvasW || ty < -dandelions[i].renderH || ty > canvasH){
                dandelions[i] = new Dandelion(sdImg);
            }
            //当蒲公英掉落地面的时候，有的会隐藏在草丛里不可见，有的可见的就停留在草地上
            if(tx > 0 && tx < canvasW && ty > uy && ty < canvasH){
                if(Math.random()<0.5){
                    staticDans.push(dandelions[i]);
                    delete dandelions[i];
                }

                dandelions[i] = new Dandelion(sdImg);
            }
            //绘制当前的蒲公英
            dandelions[i].draw(context);
        }
    }
    //渲染掉落草地上静态的蒲公英
    function renderStaticDandelions(){
        for(var i=0; i<staticDans.length; i++){
            staticDans[i].draw(context);
        }
    }
    //加载整株蒲公英树
    function loadLargeDandelion(){
        var danImg = new Image();
        danImg.src = DandelionTree.src;
        danImg.onload = function(){
            loaded += 1;
            DandelionTree.cutX = 300;
            DandelionTree.cutY = 0;
            DandelionTree.cutW = 200;
            DandelionTree.cutH = 383;
            DandelionTree.renderX = -80;
            DandelionTree.renderY = -333;
            DandelionTree.renderW = 200;
            DandelionTree.renderH = 383;
            DandelionTree.rotation = 30;
            DandelionTree.rotationInc = 1;
            DandelionTree.delay = 3;
            DandelionTree.img = danImg;
            renderLargeDandelion();
        }
    }
    //渲染蒲公英树，它会随着风轻轻摆动
    function renderLargeDandelion(){
        DandelionTree.delay --;
        if(DandelionTree.delay <= 0){
            DandelionTree.delay = 3;
            DandelionTree.rotation += DandelionTree.rotationInc;
            if(DandelionTree.rotation >= 35 || DandelionTree.rotation <= 25){
                DandelionTree.rotationInc *= -1;
            }
        }


        var angleInRadians = DandelionTree.rotation*Math.PI/180;
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);

        context.translate(50, 500);

        context.rotate(angleInRadians);
        //context.fillText("hello", 0, -100);
        context.drawImage(DandelionTree.img, DandelionTree.cutX, DandelionTree.cutY, DandelionTree.cutW, DandelionTree.cutH, DandelionTree.renderX, DandelionTree.renderY, DandelionTree.renderW, DandelionTree.renderH);
        context.restore();
    }

    function loadSkyBackground(){
        var skybackImg = new Image();
        skybackImg.src = SkyBack.src;
        skybackImg.onload = function(){
            loaded += 1;
            SkyBack.width = skybackImg.width;
            SkyBack.height = skybackImg.height;
            SkyBack.rate = SkyBack.width / SkyBack.height;
            SkyBack.rHeight = canvasH;
            SkyBack.rWidth = SkyBack.rate*SkyBack.height;
            SkyBack.img = skybackImg;
            renderSkyBackground();
        }
    }
    function renderSkyBackground(){
        context.drawImage(SkyBack.img, 0, 0, SkyBack.width, SkyBack.height, 0, 0, SkyBack.rWidth, SkyBack.rHeight);
    }

    /*function loadGrass(){
        var grassImg = new Image();
        grassImg.src = Grass.src;
        grassImg.onload = function(){
            Grass.width = grassImg.width;
            Grass.height = grassImg.height;
            Grass.rate = Grass.width / Grass.height;
            Grass.rWidth = canvasW;
            Grass.rHeight = Grass.height;
            Grass.x = 0;
            Grass.y = canvasH - Grass.rHeight;
            var fillPattern = context.createPattern(grassImg, "repeat");
            context.fillStyle = fillPattern;
            context.fillRect(Grass.x, Grass.y, Grass.rWidth, Grass.rHeight);
            //renderGrass();
        }
    }
    function renderGrass(){
        context.fillStyle = Grass.img;
        context.fillRect(Grass.x, Grass.y, Grass.rWidth, Grass.rHeight);
    }

    function loadCloud(){
        var cloudImg = new Image();
        cloudImg.src = Cloud.src;
        cloudImg.onload = function(){
            Cloud.width = cloudImg.width;
            Cloud.height = cloudImg.height;
            Cloud.rate = Cloud.width / Cloud.height;
            Cloud.rWidth = canvasW;
            Cloud.rHeight = canvasH;
            Cloud.x = 0;
            Cloud.y = 100;
            Cloud.img = cloudImg;
            renderCloud();
        }
    }
    function renderCloud(){
        context.drawImage(Cloud.img, 0, 0, Cloud.width, Cloud.height, Cloud.x, Cloud.y, Cloud.rWidth, Cloud.rHeight);
    }

    function loadSun(){
        var sunImg = new Image();
        sunImg.src = Sun.src;
        sunImg.onload = function(){
            Sun.width = sunImg.width;
            Sun.height = sunImg.height;
            Sun.rate = Sun.width / Sun.height;
            Sun.rHeight = 0.5 * canvasH;
            if(Sun.height<Sun.rHeight){
                Sun.rHeight = Sun.height;
            }
            Sun.rWidth = Sun.rHeight*Sun.rate;
            Sun.x = canvasW - Sun.rWidth;
            Sun.y = 0;
            Sun.img = sunImg;
            renderSun();
        }
    }
    function renderSun(){
        context.drawImage(Sun.img, 0, 0, Sun.width, Sun.height, Sun.x, Sun.y, Sun.rWidth, Sun.rHeight);
    }

    function loadSky(){
        var skyImg = new Image();
        skyImg.src = Sky.src;
        skyImg.onload = function(){
            Sky.width = skyImg.width;
            Sky.height = skyImg.height;
            Sky.rate = Sky.width / Sky.height;
            Sky.img = skyImg;
            renderSky();
        }
    }
    function renderSky(){
        context.drawImage(Sky.img, 0, 0, Sky.height, Sky.height, 0, 0, canvasW, canvasH);
    }*/

    loadImages();

    //计时开始时重绘到达最新位置的蒲公英
    function reRender(){
        renderSkyBackground();
        renderLargeDandelion();
        renderSmallDandelions();
        renderStaticDandelions();
    }
    //计时器
    var animateOut;
    function gameLoop(){
        reRender();
        clearTimeout(animateOut);
        animateOut = window.setTimeout(gameLoop, 40);
    }

    var startAnimate = window.setInterval(function(){
        if(loaded == 3){
            gameLoop();
            clearInterval(startAnimate);
        }
    })

    //落在草地上的蒲公英会越来越多，5分钟后，每隔半分钟隐藏一个
    var rmStaticDandelion = window.setTimeout(function(){
        window.setInterval(function(){
            staticDans.shift();
        }, 30000);
    }, 180000);


}
//蒲公英对象
function Dandelion(sdImg){
    this.imgData = sdImg;//蒲公英图片源
    this.gravity = 1;//重力
    //截取大小
    this.cutW = 150;
    this.cutH = 150;
    //截取坐标
    this.cutX = this.cutW*(Math.floor(Math.random()*3));
    this.cutY = this.cutH*(Math.floor(Math.random()*2));
    //旋转角度
    this.rotation = 0;
    this.rotationInc = Math.random()*5 + 1;
    if(Math.random()<0.5){
        this.rotationInc *= -1;
    }
    //大小范围
    var maxRender = 35;
    var minRender = 25;
    var maxSpeedAdjust = 1;//最大速度校准
    this.dx = Math.random()*2 + maxSpeedAdjust;
    if(Math.random()<0.5){
        this.dx *= -1;
    }
    this.dy = Math.random()*2 + maxSpeedAdjust;
    if(Math.random()<0.5){
        this.dy *= -1;
    }

    //最终渲染图片的大小
    this.renderW = minRender + Math.random()*(maxRender - minRender);
    this.renderH = this.renderW;
    this.halfWidth = this.renderW / 2;
    this.halfHeight = this.renderH / 2;

    //图片渲染最开始的位置
    var startPos = {x: 180, y: 260, differ: 50};
    if(Math.random()<0.5){
        this.renderX = startPos.x - startPos.differ;
    }else{
        this.renderX = startPos.x + startPos.differ;
    }
    if(Math.random()<0.5){
        this.renderY = startPos.y - startPos.differ;
    }else{
        this.renderY = startPos.y + startPos.differ;
    }

}
//更新蒲公英的最新位置和角度
Dandelion.prototype.update = function(){
    this.renderX += this.dx;
    this.renderY += this.dy;
    this.renderY += this.gravity;
    this.rotation += this.rotationInc;
}
//绘制蒲公英
Dandelion.prototype.draw = function(context, imgData){
    var angleInRadians = this.rotation*Math.PI/180;
    context.save();
    context.setTransform(1,0,0,1,0,0);

    context.translate(this.renderX+this.halfWidth, this.renderY+this.halfHeight);
    context.rotate(angleInRadians);

    context.drawImage(this.imgData, this.cutX, this.cutY, this.cutW, this.cutH, 0, 0, this.renderW, this.renderH);

    context.restore();
}






