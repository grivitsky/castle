var WIDTH = window.innerWidth,
    HEIGHT = WIDTH/16*9;
var castle, 
    frame, maskIllu, cornerTL, cornerTR, cornerBL, cornerBR, frameLineTop, frameLineBottom, frameTopMiddle, frameBottomMiddle;

var sizeL = 1200;
var sizeM = 960;
var sizeS = 720;
var sizeXS = 480;

var pixiCanvas = document.getElementById("pixiCanvas");
var framePadding = 0;
var framePaddingTarget = 0;
var parallaxCoeff = 2;
var globalScale = 1;
var brightness = 1;
var repulsion = .95;
var noise = .0;
var InitScaleAmount= 0.28;
   
/*    var cw=0;
  $(document).ready(function() {
     cw = $(window).width();

  });
  $(window).resize(function() {
    cw = $(window).width();
    if(cw<=1920 && cw>=1680 && InitScaleAmount!=0.28)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.28;
      
    onAssetsLoaded(loader,loader);
    }
    if(cw<=1680 && cw>=1536 && InitScaleAmount!=0.24)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.24;
      
    onAssetsLoaded(loader,loader);
    }
    if(cw<=1536 && cw>=1440 && InitScaleAmount!=0.22)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.22;
      
    onAssetsLoaded(loader,loader);
    }
    if(cw<=1440 && cw>=1366 && InitScaleAmount!=0.2)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.2;
      
    onAssetsLoaded(loader,loader);
    }
    if(cw<=1366 && cw>=1280 && InitScaleAmount!=0.18)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.18;
      
    onAssetsLoaded(loader,loader);
    }
    if(cw<=1280 && cw>=1024 && InitScaleAmount!=0.16)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.16;
      
    onAssetsLoaded(loader,loader);
    }
    if(cw<=1024 && cw>=768 && InitScaleAmount!=0.14)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.14;
      
    onAssetsLoaded(loader,loader);
    }
    if(cw<=768 && cw>=720 && InitScaleAmount!=0.12)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.12;
      
    onAssetsLoaded(loader,loader);
    }
    if(cw<=720 && cw>=576 && InitScaleAmount!=0.1)
    {
    console.log('lol');
    container.removeChild(illu);
      //renderer.render(container);
    InitScaleAmount= 0.1;
      
    onAssetsLoaded(loader,loader);
    }
  });
*/

var elements = [];
var mousePos = {x:window.innerWidth/2, y:window.innerHeight/2};
var myDisplayResolution = window.devicePixelRatio;

var renderer = PIXI.autoDetectRenderer(576, 576, {
    antialiasing:true,
    transparent:true,
    resolution:1
});
pixiCanvas.appendChild(renderer.view);
var container = new PIXI.Container();

//*
var noiseFilter = new PIXI.filters.NoiseFilter()
noiseFilter.noise = noise;
var colorMatrix = new PIXI.filters.ColorMatrixFilter();
colorMatrix.brightness(brightness);
container.filters = [noiseFilter, colorMatrix];
//*/


var loader = new PIXI.loaders.Loader('',30);

loader.add('world', 'world.json');
loader.once('complete', onAssetsLoaded);
loader.load();

window.addEventListener('resize', onWindowResize, false);

document.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
  globalScale = .9 + (event.clientX / WIDTH)*.0015;
  repulsion = 0.9 + (event.clientX / WIDTH)*.0015;
}

function onWindowResize() {
  
  WIDTH = window.innerWidth;
  HEIGHT = WIDTH/16*9;
  //renderer.resize(WIDTH, HEIGHT);
  repositionAll();
}

function repositionAll(speed){
  
  for(var i=0, l = elements.length; i<l; i++){
    var el = elements[i];
    el.updatePosition(speed);
  }
  repositionFrame();
}

function repositionFrame(){
  
  if (frameLineTop){
    frameLineTop.sprite.width = WIDTH - framePadding*2;
    frameLineTop.sprite.y = framePadding;
    frameLineTop.sprite.x = framePadding;
    
    frameLineBottom.sprite.width = WIDTH - framePadding*2;
    frameLineBottom.sprite.y = HEIGHT - framePadding;
    frameLineBottom.sprite.x = framePadding;
    
    frameLineRight.sprite.width = HEIGHT- framePadding*2;
    frameLineRight.sprite.x = WIDTH- framePadding;
    frameLineRight.sprite.y = framePadding;
    
    frameLineLeft.sprite.width = HEIGHT - framePadding*2;
    frameLineLeft.sprite.x = framePadding;
    frameLineLeft.sprite.y = framePadding;
    
    
    frameTopMiddle.sprite.x = WIDTH/2;
    frameTopMiddle.sprite.y = framePadding+5;
    
    frameBottomMiddle.sprite.x = WIDTH/2;
    frameBottomMiddle.sprite.y = HEIGHT - framePadding-5;
    
    cornerTL.sprite.x = framePadding;
    cornerTL.sprite.y = framePadding;
    
    cornerTR.sprite.x = WIDTH - framePadding;
    cornerTR.sprite.y = framePadding;
    
    cornerBR.sprite.x = WIDTH - framePadding;
    cornerBR.sprite.y = HEIGHT - framePadding;
    
    cornerBL.sprite.x = framePadding;
    cornerBL.sprite.y = HEIGHT - framePadding;
    
    backgroundPlane.sprite.width = WIDTH*2;
    backgroundPlane.sprite.height = HEIGHT*2;
  }
  
  
  if (maskIllu){
    maskIllu.clear();
    maskIllu.beginFill(0xFFFF00);
    maskIllu.drawRect(framePadding+2, framePadding+2, WIDTH-framePadding*2, HEIGHT-framePadding*2);
  }
}

TweenMax.to(this, 4, {framePadding:framePaddingTarget, ease:Power4.easeInOut, onUpdate:repositionFrame});
    

var pic;
  

    
function onAssetsLoaded(loader,resources){
  
  //backgroundPlane = new FloatingObject( "background-base.png", container, { tiling:true, depth:0, initPcX:0, initPcY:0, initDispY:0, initDispX:0, centerPivotX:false, centerPivotY:false, affectedByScale:false});
  //TODO: background repeat
    
  illu = new PIXI.Sprite();
  container.addChild(illu);
  
  maskIllu = new PIXI.Graphics();
  container.addChild(maskIllu);
  illu.mask = maskIllu;    
    
    
  BusinessAnalyse = new FloatingObject( "ba.png", illu, { depth:14, initPcX:0, initPcY:0, floatFrequency:.02, floatAmplitude:5, initDispX:155, initDispY:78,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
    
  Design = new FloatingObject( "ux.png", illu, { depth:14, initPcX:.0, initPcY:.0, initDispX:-45, initDispY:300, floatFrequency:.025, floatAmplitude:7,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
  
  WebDev = new FloatingObject( "wd.png", illu, { depth:14, initPcX:.0, initPcY:.0, initDispX:-15, initDispY:180, floatFrequency:.027, floatAmplitude:7,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
  //cupolaRight = new FloatingObject( "db.png", illu, { depth:-7, initPcX:.5, initPcY:0, initDispY:125, initDispX:220, initScaleX:-.5, hideBelowX:sizeM });
  QA = new FloatingObject( "qa.png", illu, { depth:14, initPcX:.0, initPcY:.0,  initDispX:372, initDispY:300, floatFrequency:.023, floatAmplitude:7,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
    
  MobileDev = new FloatingObject( "md.png", illu, { depth:14, initPcX:.0, initPcY:0,  initDispX:372, initDispY:173, floatFrequency:.021, floatAmplitude:7,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
    
    

  CloudWithStar = new FloatingObject( "cloud2.png", illu, { depth:14, initPcX:0, initPcY:0, initDispX:132, initDispY:400, floatFrequency:.02, floatAmplitude:2, initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });   
  
  CloudWithHDD = new FloatingObject( "cloud1.png", illu, { depth:14, initPcX:0, initPcY:0, initDispX:40, initDispY:380, floatFrequency:.03, floatAmplitude:2, initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
    
  planet = new FloatingObject( "erth.png", illu, { depth:14, initPcX:.0, initPcY:.0, initDispX:205, initDispY:254, floatFrequency:.03, floatAmplitude:3,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
    
  orbit = new FloatingObject( "orbit.png", illu, { depth:14, initPcX:.0, initPcY:.0, initDispX:226, initDispY:234, floatFrequency:.03, floatAmplitude:5,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
    
  database = new FloatingObject( "db.png", illu, { depth:14, initPcX:0, initPcY:0, initDispX:96, initDispY:228, floatFrequency:.03, floatAmplitude:5, floatAngle:0, initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
     
  Circle = new FloatingObject( "circle.png", illu, { depth:14, initPcX:.0, initPcY:.0, initDispX:230, initDispY:446, floatFrequency:.03, floatAmplitude:2,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
    
  CloudWithChip = new FloatingObject( "cloudmin.png", illu, { depth:14, initPcX:0, initPcY:0, initDispX:220, initDispY:355,  floatFrequency:.03, floatAmplitude:3,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
  
  bitArray = new FloatingObject( "bin.png", illu, { depth:14, initPcX:.0, initPcY:.0, initDispX:142, initDispY:440,  floatFrequency:.03, floatAmplitude:2,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
    
  instruments = new FloatingObject( "inst.png", illu, { depth:14, initPcX:.0, initPcY:.0, floatFrequency:.03, floatAmplitude:2, initDispX:74, initDispY:436,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
   
  Diagramm = new FloatingObject( "diagr.png", illu, { depth:14, initPcX:.0, initPcY:.0, initDispX:278, initDispY:386, floatFrequency:.05, floatAmplitude:2,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
  
    
    
  //BusinessAnalyse = new FloatingObject( "ba.png", illu, { depth:14, initPcX:0.89, initPcY:0.17, floatFrequency:.02, floatAmplitude:7, initDispY:125, initDispX:-220,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
    
  //Design = new FloatingObject( "ux.png", illu, { depth:14, initPcX:.68, initPcY:.5, floatFrequency:.025, floatAmplitude:7,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
  
  //WebDev = new FloatingObject( "wd.png", illu, { depth:14, initPcX:.69, initPcY:.40, floatFrequency:.027, floatAmplitude:7,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
  //cupolaRight = new FloatingObject( "db.png", illu, { depth:-7, initPcX:.5, initPcY:0, initDispY:125, initDispX:220, initScaleX:-.5, hideBelowX:sizeM });
  //QA = new FloatingObject( "qa.png", illu, { depth:14, initPcX:.89, initPcY:.5, floatFrequency:.023, floatAmplitude:7,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
    
  //MobileDev = new FloatingObject( "md.png", illu, { depth:14, initPcX:.88, initPcY:0.18, floatFrequency:.021, floatAmplitude:7, initDispX:0, initDispY:200, initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
    
    

  //CloudWithStar = new FloatingObject( "cloud2.png", illu, { depth:14, initPcX:0.76, initPcY:0.61, initDispX:10, initDispY:0, floatFrequency:.02, floatAmplitude:2, initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });   
  
  //CloudWithHDD = new FloatingObject( "cloud1.png", illu, { depth:14, initPcX:0.61, initPcY:0.44, initDispY:155, initDispX:215, floatFrequency:.03, floatAmplitude:2, initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
    
  //planet = new FloatingObject( "erth.png", illu, { depth:14, initPcX:.81, initPcY:.47, floatFrequency:.03, floatAmplitude:3,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
    
  //orbit = new FloatingObject( "orbit.png", illu, { depth:14, initPcX:.82, initPcY:.45, floatFrequency:.03, floatAmplitude:5,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
    
  //database = new FloatingObject( "db.png", illu, { depth:14, initPcX:.75, initPcY:.45, floatFrequency:.03, floatAmplitude:5, floatAngle:0, initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
     
  //Circle = new FloatingObject( "circle.png", illu, { depth:14, initPcX:.81, initPcY:.65, initDispX: 15, floatFrequency:.03, floatAmplitude:2,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
    
  //CloudWithChip = new FloatingObject( "cloudmin.png", illu, { depth:14, initPcX:0.8, initPcY:0.57, initDispX:25, initDispY:0, floatFrequency:.03, floatAmplitude:3,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
  
  //bitArray = new FloatingObject( "bin.png", illu, { depth:14, initPcX:.77, initPcY:.66, initDispX: -4, initDispY: -5, floatFrequency:.03, floatAmplitude:2,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
    
  //instruments = new FloatingObject( "inst.png", illu, { depth:14, initPcX:.73, initPcY:.63, floatFrequency:.03, floatAmplitude:2, initDispX: 10, initDispY: 20,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount });
   
  //Diagramm = new FloatingObject( "diagr.png", illu, { depth:14, initPcX:.84, initPcY:.59, floatFrequency:.05, floatAmplitude:2,  initScaleX: InitScaleAmount, initScaleY: InitScaleAmount }); 
  

  
  
  

  
  
  //shelfLeftSmall = new FloatingObject( "shelf-left-small.png", illu, { depth:-4, initPcX:.23, initPcY:.48, hideBelowX:sizeL, floatFrequency:.02, floatAmplitude:2, floatAngle:0});
  
  //cloudB = new FloatingObject( "cloud-b.png", illu, { depth:-3, initPcX:.25, initPcY:.53, hideBelowX:sizeM });
  
  //shipLeftSmall = new FloatingObject( "ship-left-small.png", illu, { depth:-3, initPcX:.28, initPcY:.55, hideBelowX:sizeS,floatFrequency:.035, floatAmplitude:3, floatAngle:0 });
  
  //cloudA = new FloatingObject( "cloud-a.png", illu, { depth:-2, initPcX:.25, initPcY:.6, hideBelowX:sizeS });
  
  //balloonRightSmall = new FloatingObject( "balloon-right-small.png", illu, { depth:-3, initPcX:.77, initPcY:.48, hideBelowX:sizeL,floatFrequency:.02, floatAmplitude:2, floatAngle:0 });
  
  //balloonsCastle = new FloatingObject( "balloons-castle.png", illu, { depth:-1, initPcX:.25, initPcY:.15, hideBelowX:sizeM });
  
  //troy = new FloatingObject( "troy.png", illu, { depth:2, initPcX:.7, initPcY:.45, hideBelowX:sizeM,floatFrequency:.02, floatAmplitude:3, floatAngle:0 });
  
  //cloudC = new FloatingObject( "cloud-c.png", illu, { depth:2, initPcX:.03, initPcY:.27 });
  
  //bubblesCastle = new FloatingObject( "bubbles-castle.png", illu, {depth:3, initPcX:.23, initPcY:.35, hideBelowX:sizeM,floatFrequency:.01, floatAmplitude:3, floatAngle:0 });
  
  //smallCastle = new FloatingObject( "small-castle.png", illu, { depth:3, initPcX:.80, initPcY:.25, hideBelowX:sizeL,floatFrequency:.025, floatAmplitude:2, floatAngle:0});
  
  //balloonTopRightSmall = new FloatingObject( "balloon-top-right-small.png", illu, { depth:3, initPcX:.70, initPcY:.22, hideBelowX:sizeL,floatFrequency:.02, floatAmplitude:1, floatAngle:0 });
  
  
  //mountainLeftSmall = new FloatingObject( "mountain-left-small.png", illu, { depth:7, initPcX:.05, initPcY:.4, hideBelowX:sizeS});
  
 // mountainLeftSmall4 = new FloatingObject( "mountain-right-small2.png", illu, { depth:7.5, initPcX:.12, initPcY:.46,  hideBelowX:sizeL });
    
  //var mountain= new PIXI.Sprite();
  //container.addChild(mountain)
  
  //cloudA2 = new FloatingObject( "cloud-a.png", illu, { depth:8, initPcX:.13, initPcY:.5, hideBelowX:sizeL });
  
  //cloudBottomLeft = new FloatingObject( "cloud-top.png", illu, { depth:8, initPcX:.35, initPcY:.75, initRotation:Math.PI/6, hideBelowX:sizeL });
  
  //mountainLeftBig = new FloatingObject( "mountain-left-big.png", illu, { depth:9, initPcX:.15, initPcY:.69 });
  
  //mountainRightSmall3 = new FloatingObject( "mountain-right-small3.png", illu, { depth:8, initPcX:.90, initPcY:.50   });
  
  //smokeBig = new FloatingObject( "smoke-big.png", mountainRightSmall3.sprite, {initScaleX:1, initScaleY:1, initDispX:90, initDispY:30, hideBelowX:sizeL});
  
  //smokeSmall = new FloatingObject( "smoke-small.png", mountainRightSmall3.sprite, {initScaleX:1, initScaleY:1, initDispX:70, initDispY:-80, hideBelowX:sizeM});
  
  //cloudB2  = new FloatingObject( "cloud-b.png", illu, { depth:8, initRotation:-.75, initPcX:.71, initPcY:.57, hideBelowX:sizeS });
  
  //mountainRightBig = new FloatingObject( "mountain-right-big.png", illu, { depth:9, initPcX:.80, initPcY:.65 });
  
  //diamond = new FloatingObject( "diamond.png", mountainRightBig.sprite, {initScaleX:1, initScaleY:1, initDispX:440, initDispY:-60, hideBelowX:sizeM,floatFrequency:.02, floatAmplitude:4, floatAngle:0});
  
   //cloudC2 = new FloatingObject( "cloud-c.png", illu, { depth:11, initPcX:.6, initPcY:.7, hideBelowX:sizeM });
  
  //mountainRightSmall3 = new FloatingObject( "mountain-right-small2.png", illu, { depth:12, initPcX:.77, initPcY:.65, hideBelowX:sizeS });
  
  //mountainRightSmall1 = new FloatingObject( "mountain-right-small1.png", illu, { depth:12, initPcX:.70, initPcY:.70, hideBelowX:sizeS });
  
  //cloudC3 = new FloatingObject( "cloud-c.png", illu, { depth:13, initPcX:.55, initPcY:.75, initRotation:-Math.PI/6, hideBelowX:sizeL });
  
  //mountainRightSmall2 = new FloatingObject( "mountain-right-small2.png", illu, { depth:12, initPcX:.95, initPcY:.65, hideBelowX:sizeS });
  
   //cloudC4 = new FloatingObject( "cloud-c.png", illu, { depth:13, initPcX:.85, initPcY:.7, hideBelowX:sizeL });
   
  //hillsBottomLeft = new FloatingObject( "hills-bottom-left.png", illu, { depth:11, initPcX:.15, initPcY:.74, hideBelowX:sizeS });
  
  
  
 // waterSurfaceA = new FloatingObject( "water-surface-a.png", illu, { depth:12, initPcX:.25, initPcY:.91, initDispY:-65, hideBelowX:sizeM });
  
  //waterSurfaceB = new FloatingObject( "water-surface-b.png", illu, { depth:12, initPcX:.35, initPcY:.91, initDispY:-65 });
  
  //waterSurfaceC = new FloatingObject( "water-surface-c.png", illu, { depth:12, initPcX:.45, initPcY:.91, initDispY:-65 });
  
  //waterSurfaceD = new FloatingObject( "water-surface-d.png", illu, { depth:12, initPcX:.65, initPcY:.91, initDispY:-65 });
  
  //waterSurfaceE = new FloatingObject( "water-surface-e.png", illu, { depth:12, initPcX:.85, initPcY:.91, initDispY:-65 });
  
  
  //tentacleLeft = new FloatingObject( "tentacle-left.png", illu, { depth:18, initPcX:.5, initDispX:-115, initPcY:.92, initDispY:-70, hideBelowX:sizeL });
  
  //tentacleRight = new FloatingObject( "tentacle-right.png", illu, { depth:18, initPcX:.5, initDispX:115, initPcY:.92, initDispY:-70, hideBelowX:sizeL });
  
  
  //whale = new FloatingObject( "whale.png", illu, { depth:22, initPcX:.5, initPcY:.97, initDispY:-70, hideBelowX:sizeXS });
  
  
 // beachLeft = new FloatingObject( "beach-left.png", illu, { depth:21, initPcX:.17, initPcY:.91 });
  
  //beachRight = new FloatingObject( "beach-left.png", illu, { depth:21, initPcX:.9, initPcY:.91, initScaleX:-.5 });
  
  //smallShipBottomRight = new FloatingObject( "small-ship-bottom-right.png", illu, { depth:21, initPcX:.82, initPcY:.8});
  
  //swordTreeLeft = new FloatingObject( "sword-tree-left.png", illu, { depth:22, initPcX:.17, initPcY:.91 });
  
  //treesLeft = new FloatingObject( "trees-left.png", illu, { depth:22, initPcX:.11, initPcY:.86 });
  
  //columnLeft = new FloatingObject( "column-left.png", illu, { depth:25, initPcX:.05, initPcY:1, initDispY:-150 });
  
 // treeBottomRight = new FloatingObject( "tree-bottom-right.png", illu, { depth:25, initPcX:.95, initPcY:1, initDispY:-150 });
  
  //spartan = new FloatingObject( "spartan.png", illu, { depth:26, initPcX:.3, initPcY:1, initDispY:-110, hideBelowX:sizeS });
  
  //viking = new FloatingObject( "viking.png", illu, { depth:26, initPcX:.7, initPcY:1, initDispY:-110, hideBelowX:sizeS });
  
  
  frame = new PIXI.Sprite();
  container.addChild(frame);
  
  
  //frameLineTop = new FloatingObject( "frame-line.png", frame, { centerPivotX:false, initDispX:framePadding, initDispY:framePadding, affectedByScale:false});
  
  //frameLineBottom = new FloatingObject( "frame-line.png", frame, { centerPivotX:false, initDispX:framePadding, initPcY:1, initDispY:-framePadding, affectedByScale:false});
  
  //frameLineLeft = new FloatingObject( "frame-line.png", frame, { centerPivotX:false, initRotation:Math.PI/2, initDispX:framePadding, initDispY:framePadding, affectedByScale:false });
  
  //rameLineRight = new FloatingObject( "frame-line.png", frame, { centerPivotX:false, initRotation:Math.PI/2, initPcX:1, initDispX:-framePadding, initDispY:framePadding, affectedByScale:false });
  
  //frameTopMiddle = new FloatingObject( "frame-top-middle.png", frame, { initPcX:.5, initDispY:framePadding+5, affectedByScale:false });
  //frameBottomMiddle = new FloatingObject( "frame-top-middle.png", frame, { initPcX:.5, initPcY:1, initDispY:-framePadding-5, initRotation:Math.PI, affectedByScale:false });
  
  //cornerTL = new FloatingObject( "frame-corner.png", frame, { initDispX:framePadding, initDispY:framePadding, affectedByScale:false });
  //cornerTR = new FloatingObject( "frame-corner.png", frame, { initPcX:1, initDispX:-framePadding, initDispY:framePadding, affectedByScale:false });
  //cornerBL = new FloatingObject( "frame-corner.png", frame, { initDispX:framePadding, initPcY:1, initDispY:-framePadding, affectedByScale:false });
  //cornerBR = new FloatingObject( "frame-corner.png", frame, { initPcX:1, initDispX:-framePadding, initPcY:1, initDispY:-framePadding, affectedByScale:false });
  
  onWindowResize();
  animate();
}


var FloatingObject = function(texName, parent, params){
  this.params = params || {};
  this.initPcX = this.params.initPcX || 0;
  this.initPcY = this.params.initPcY || 0;
  this.initDispX = this.params.initDispX || 0;
  this.initDispY = this.params.initDispY || 0;
  this.depth = this.params.depth || 0;
  this.tiling = (this.params.tiling) ? true : false;
  this.initRotation = this.params.initRotation || 0; 
  this.initScaleX = this.params.initScaleX || .5;
  this.initScaleY = this.params.initScaleY || .5;
  this.affectedByScale = (this.params.affectedByScale==false)? false : true;
  this.centerPivotX = (this.params.centerPivotX==false) ? false : true;
  this.centerPivotY = (this.params.centerPivotY==false)? false : true;
  this.hideBelowX = this.params.hideBelowX || 0;
  this.hideBelowY = this.params.hideBelowY || 0;
  this.floatFrequency = this.params.floatFrequency || 0;
  this.floatAmplitude= this.params.floatAmplitude || 0;
  this.floatAngle = this.params.floatAngle || 0;
  
  this.texName = texName;
  this.visible = true;
  
  this.parent = parent;
  if (this.tiling){
    this.sprite = PIXI.TilingSprite.fromFrame(texName);
  }else{
    this.sprite = PIXI.Sprite.fromFrame(texName);  
  }
  
  
  if (this.centerPivotX) this.sprite.pivot.x = this.sprite.width/2;
  if (this.centerPivotY) this.sprite.pivot.y = this.sprite.height/2;
    
  
  
  this.parent.addChild(this.sprite);
  elements.push(this);
  
  this.updatePosition();
}








FloatingObject.prototype.updatePosition = function(speed){
  var sp = speed || 0;
  
  var floatY = 0;
  
  if (this.floatFrequency>0){
    this.floatAngle += this.floatFrequency;
    floatY = Math.cos(this.floatAngle)*this.floatAmplitude*2;
  }
  
  var tx = (WIDTH*this.initPcX) + this.initDispX - mousePos.x * this.depth * parallaxCoeff;
  var ty = (HEIGHT*this.initPcY) + this.initDispY + floatY + mousePos.y * this.depth * parallaxCoeff;
  
  var tsx = this.initScaleX;
  var tsy = this.initScaleY;
  
  
  if (this.affectedByScale){
    var ratioS = (1 + ((this.depth-18)/100));
    var ratioT = (1 + ((this.depth-18)/50));
    
    tsx *= globalScale * ratioS;
    tsy *= globalScale * ratioS;
    
    tx = (WIDTH/2) + (tx - WIDTH/2) * globalScale * repulsion; 
    ty = (HEIGHT/2) + (ty - HEIGHT/2) * globalScale * repulsion; 
  }
  
  this.sprite.rotation = this.initRotation;  
  
  // not visible but it should be visible
  if (!this.visible && WIDTH > this.hideBelowX && HEIGHT > this.hideBelowY){
    this.visible = true;
    TweenMax.to(this.sprite.scale, 1, {x:tsx, y:tsy, ease:Power4.easeInOut});
    this.sprite.x = tx;
    this.sprite.y = ty;
    return;
  // not visible and it should stay not visible
  }else if (!this.visible){
    this.sprite.x = tx;
    this.sprite.y = ty;
    return;
    
  // visible but it should be not visible
  }else if (this.visible && (WIDTH < this.hideBelowX || HEIGHT < this.hideBelowY)){
    this.visible = false;
    TweenMax.killTweensOf(this.sprite.scale);
    TweenMax.to(this.sprite.scale, 1, {x:0, y:0, ease:Power4.easeInOut});
    
    return;
  }
  
  this.visible = true;
  
  if (this.affectedByScale){
    this.sprite.x += (tx-this.sprite.x) *.1;
    this.sprite.y += (ty-this.sprite.y) *.1;
    this.sprite.scale.x += (tsx-this.sprite.scale.x)*.1;
    this.sprite.scale.y += (tsy-this.sprite.scale.y)*.1;
    
    //TweenMax.to(this.sprite.scale, .5, {x:tsx, y:tsy, ease:Power4.easeInOut});
  
  }else{
    this.sprite.x = tx;
    this.sprite.y = ty;
    this.sprite.scale.x = tsx;
    this.sprite.scale.y = tsy;
  }

  
  //this.sprite.visible = (WIDTH > this.hideBelowX) && (HEIGHT > this.hideBelowY);
}


function animate() {
  requestAnimationFrame( animate );
  repositionAll();
  renderer.render(container);
}