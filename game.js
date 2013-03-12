$(document).ready(function(){
    game();
    });

var game=function(){
    var bounds={};
if (!window.innerWidth){
    bounds={bottom:300,top:0,right:(screen.width-200),left:0};
    }
else{
     bounds={bottom:window.innerHeight/2,top:0,right:window.innerWidth,left:0};
    }
var protag={x:100 ,y:(bounds.bottom-40) ,h:40, w:40 };
Crafty.init(bounds.right, bounds.bottom);
Crafty.background('rgb(0,255,255)');


for (var i=0;i<20;i++){
var height=100*Math.sin(i);
var cloud=new Crafty.e("Cloud, 2D, DOM, Color");
    cloud.color('rgb(255,255,255)');
    cloud.attr({
        alpha:0.8,
        x:davis.random(bounds.right),
        y:100-height,
        w:davis.bell(200),
        h:height
        });
    cloud.bind("EnterFrame",function(){
        this.x+=0.1;
        if (this.x>bounds.right){
            this.x=bounds.left-this.w;
            }
        });
}


var horizon=new Crafty.e("Horizon, 2D, DOM, Color");
    horizon.color('rgb(150,200,100)');
    horizon.attr({
        alpha:1,
        x:0,
        y:bounds.bottom-25,
        w:bounds.right,
        h:81
        });
        

    
var bushes=[];
for (var i=0;i<30;i++){
    var height=20+davis.bell(100);
    var leafColor="rgb("+davis.bell(150)+","+(100+davis.bell(150))+","+davis.bell(100)+")";
    bushes[i]=new Crafty.e("Bush,2D,DOM,Color,Tween,Collision")
        .color(leafColor)
        .attr({
            alpha:0.9,
            w:20+davis.bell(100),
            h:height,
            x:davis.random(bounds.right),
            y:davis.bell(bounds.bottom-height)
            })
        .bind('EnterFrame',function(){
            if (this.alpha<0){
                this.destroy();
                }
            })
        .onHit('Charge',function(){
            this.tween({
                alpha:this.alpha-0.1
                },10);
            });
    var trunk=new Crafty.e("Trunk,2D,DOM,Color")
        .color(davis.randomColor("grey"))
        .attr({
            x:(bushes[i].x+(0.5*bushes[i].w)-2),
            y:bushes[i].y+bushes[i].h,
            w:4,
            h:bounds.bottom-bushes[i].y-bushes[i].h
            });
    }

var look="left";
var colors={red:250,green:250,blue:250};
var colorString="rgb("+colors.red+","+colors.green+","+colors.blue+")";

//Enemy
var enemy=new Crafty.e("Enemy,2D,DOM,Color,Tween,Collision")
    .color('rgb(0,0,0)')
    .attr({
        x:300,
        y:bounds.bottom-150,
        w:100,
        h:150,
        dX:1,
        ready:true
        });
var enemyEye=new Crafty.e("EnemyEye,2D,DOM,Color,Tween,Collision")
    .attr({
        x:(enemy.x+20),
        y:(enemy.y+20),
        w:20,
        h:20,
        red:0,
        green:255,
        blue:255
        })    
        .color('rgb(0,255,255)')
        .bind("EnterFrame",function(){
            if (hero.x<this.x){
                this.x=enemy.x+20;
                }
            if (hero.x>(enemy.x+enemy.w)){
                this.x=enemy.x+60;
                }
            if (hero.x>this.x && hero.x<(enemy.x+enemy.w-40)){
                this.x=enemy.x+40;
                }
            });
            
var enemyBlast=new Crafty.e("EnemyBlast,2D,DOM,Tween,Color,Collision")
                .color('rgb(255,0,0)')
                .attr({
                    alpha:1,
                    x:enemyEye.x,
                    y:enemyEye.y,
                    w:enemyEye.w,
                    h:enemyEye.h,
                    ready:true,
                    chroma:'red'
                    })
                .bind("EnterFrame",function(){
                    
                    //reset logic
                    if (this.ready==true){
                        this.attr({
                            alpha:0,
                            w:enemyEye.w,
                            h:enemyEye.h,
                            x:enemyEye.x,
                            y:enemyEye.y
                            });
                        }
                    if (this.ready==false){
                        this.x=enemyEye.x;
                        this.y=enemyEye.y;
                        }
                    //blast logic    
                    if (Math.abs(this.x-hero.x)<100 && this.ready==true){
                        var max=Math.max(enemyEye.red,enemyEye.green,enemyEye.blue);
                        if (enemyEye.red==max){
                            this.chroma="red";
                            this.color='rgb(255,0,0)';
                            console.log("RedBlast");
                            }
                        else if (enemyEye.green==max){
                            this.chroma="green";
                            this.color='rgb(0,255,0)';
                            console.log("GreenBlast");
                            }
                        else {
                            this.chroma="blue";
                            this.color='rgb(0,0,255)';
                            console.log("BlueBlast");
                            }
                        this.ready=false;
                        this.alpha=1;
                        this.tween({
                            w:300,
                            h:300,
                            x:enemyEye.x-150,
                            y:enemyEye.y-150,
                            alpha:0.1,
                            ready:true
                            },20);
                        }
                    });
                    
enemy.bind("EnterFrame",function(){
        //the enemy ai
        if(Math.abs(enemy.x-hero.x)<100 || Math.abs((enemy.x+enemy.w)-hero.x)<100){
            enemy.tween({x:(enemy.x-(enemy.x-hero.x))},60);
            }
        })
    .onHit('Blast',function(){
        
        if (hero.blastColor=="red"){
            enemyEye.green -=3;
            enemyEye.red +=1;
        }
        else if (hero.blastColor=="green"){
            enemyEye.blue -=3;
            enemyEye.green +=1;
            
        }
        else if (hero.blastColor=="blue"){
            enemyEye.red -=3;
            enemyEye.blue+=1;
            
        }
        
        
        if (enemyEye.red>255){enemyEye.red=255;}
        if (enemyEye.green>255){enemyEye.green=255;}
        if (enemyEye.blue>255){enemyEye.blue=255;}

        if (enemyEye.red<0){enemyEye.red=0;}
        if (enemyEye.green<0){enemyEye.green=0;}
        if (enemyEye.blue<0){enemyEye.blue=0;}

        var colorString="rgb("+enemyEye.red+","+enemyEye.green+","+enemyEye.blue+")";

        enemyEye.color(colorString);
        
        if (enemyEye.red<20 && enemyEye.blue<20 && enemyEye.green<20){
            enemy.tween({alpha:0},40);
            enemyEye.tween({alpha:0},40);
            enemyBlast.destroy();
            }
        });
     
//Hero
var hero=new Crafty.e("Hero, 2D, DOM, Color, Multiway, Collision")
    .color(colorString)
    .attr({
        x:protag.x,
        y:protag.y,
        w:40,
        h:40,
        red:255,
        green:255,
        blue:255,
        facing:"left",
        blastColor:"green"
        })
    .multiway(4,{LEFT_ARROW:180,RIGHT_ARROW:360})
    .bind('EnterFrame',function(){
        if (this.x>bounds.right){
            this.x=(bounds.left-this.w);
            }
        if (this.x<(bounds.left-this.w)){
            this.x=bounds.right;
            }
        })
    .bind('KeyDown',function(e){
        if (e.key===Crafty.keys['LEFT_ARROW']){
            hero.facing="left";
            console.log(hero.facing);
            }
        if (e.key===Crafty.keys['RIGHT_ARROW']){
            hero.facing="right";
            console.log(hero.facing);
            }
        //console.log(e);
        })
    .onHit('Ball',function(){
        hero.red+=5;
        var colorString="rgb("+hero.red+","+hero.green+","+hero.blue+")";
        hero.color(colorString);
        })
    .onHit('EnemyBlast',function(){
        hero.red-=1;
        hero.green-=1;
        hero.blue-=1;
        if (enemyBlast.chroma=='red'){
            hero.red-=2;
            }
        else if (enemyBlast.chroma=='green'){
            hero.green-=2;
            }
        else {
            hero.blue-=2;
            }
        })    
    ;
        

var blast=new Crafty.e("Blast, 2D, DOM, Color, Tween, Multiway, Collision")
    .color('rgb(50,50,50)')
    .attr({
        alpha:1
        })
    .multiway(4,{LEFT_ARROW:180,RIGHT_ARROW:360})
    .bind('EnterFrame',function(){
        if (this.x>bounds.right){
            this.x=(bounds.left-this.w);
            }
        if (this.x<(bounds.left-this.w)){
            this.x=bounds.right;
            }
        })
    .bind('KeyUp',function(e){
        if (e.key == Crafty.keys['R'] && hero.red>10){
            hero.red -=20;
            var colorString="rgb("+hero.red+","+hero.green+","+hero.blue+")";
            hero.color(colorString);
            blast.color(colorString);
            blast.attr({
                alpha:1,
                w:40,
                h:40
                });
            blast.color('rgb(255,0,0)');
            hero.blastColor="red";
            blast.tween({
                alpha:0,
                w:blast.w+200,
                h:blast.h+200,
                x:blast.x-100,
                y:blast.y-200,
                }, 20);
            blast.attr({
                x:hero.x,
                y:hero.y,
                w:hero.w,
                h:hero.h
                });
            }
        if (e.key == Crafty.keys['G'] && hero.green>10){
            hero.green -=20;
            var colorString="rgb("+hero.red+","+hero.green+","+hero.blue+")";
            hero.color(colorString);
            blast.color(colorString);
            blast.attr({
                alpha:1,
                w:40,
                h:40
                });
            blast.color('rgb(0,255,0)');
            hero.blastColor="green";
            blast.tween({
                alpha:0,
                w:blast.w+200,
                h:blast.h+200,
                x:blast.x-100,
                y:blast.y-200
                }, 20);
            blast.attr({x:hero.x,y:hero.y,w:40,h:40});
            }
        if (e.key == Crafty.keys['B'] && hero.blue>10){
            hero.blue -=20;
            var colorString="rgb("+hero.red+","+hero.green+","+hero.blue+")";
            hero.color(colorString);
            blast.color(colorString);
            blast.attr({
                alpha:1,
                w:40,
                h:40
                });
            blast.color('rgb(0,0,255)');
            hero.blastColor="blue";
            blast.tween({
                alpha:0,
                w:blast.w+200,
                h:blast.h+200,
                x:blast.x-100,
                y:blast.y-200
                }, 20);
            blast.attr({x:hero.x,y:hero.y,w:40,h:40});
            }
        });
        
      
var charge=new Crafty.e("Charge, 2D, DOM, Color, Tween, Multiway, Collision")
    .color('rgb(0,0,0)')
    .attr({
        alpha:0.1,
        w:hero.w,
        h:hero.h,
        active:false
        })
    .bind('EnterFrame',function(){
        if (charge.active==false){
            charge.x=hero.x;
            charge.y=hero.y;
            charge.h=0;
            charge.w=hero.w;
            }
        })
    .bind('KeyUp',function(e){
        if (e.key == Crafty.keys['C'] && charge.active==false){
            charge.active=true;
            charge.alpha=1;
            charge.x=hero.x-100;
            charge.y=hero.y-100;
            charge.w=hero.w+200;
            charge.h=hero.h+200;
            this.tween({
                active:false,
                alpha:0,
                x:hero.x,
                y:hero.y,
                h:hero.h,
                w:hero.w
                },50);
            
            }
        })
        .onHit('Bush',function(){
            
                hero.red+=1;
                hero.green+=2;
                hero.blue+=1;
            
            })
        ;
          
        
var leftEye=new Crafty.e("LeftEye, 2D, DOM, Color, Multiway, Collision")
    .attr({
        x:hero.x+12,
        y:hero.y+15,
        w:10,
        h:5
        })
    .bind('EnterFrame',function(){
        if (hero.red>50 && hero.green>50 && hero.blue>50){
            this.color('rgb(0,0,0)');   
            }
        else {
            this.color('rgb(255,255,255)');
            }
        
        if (hero.facing=="right"){
            this.x=hero.x+12;
            this.w=10;
            }
        if (hero.facing=="left"){
            this.x=hero.x+5;
            this.w=7;
            }
        })
        ;
var rightEye=new Crafty.e("RightEye, 2D, DOM, Color, Multiway, Collision")
    .attr({
        x:hero.x+28,
        y:hero.y+15,
        w:7,
        h:5
        })
    .bind('EnterFrame',function(){
        if (hero.red>50 && hero.green>50 && hero.blue>50){
            this.color('rgb(0,0,0)');   
            }
        else {
            this.color('rgb(255,255,255)');
            }
            
        if (hero.facing=="right"){
            this.x=hero.x+28;
            this.w=7;
            }
        if (hero.facing=="left"){
            this.x=hero.x+18;
            this.w=10;
            }
        })
        ;
        

    var redBar=new Crafty.e("RedBar, DOM, 2D, Color, Tween")
        .color('rgb(255,0,0)')
        .attr({
            alpha:0.9,
            x:20,
            y:20,
            w:hero.red,
            h:10
            })
        .bind('EnterFrame',function(){
            this.tween({w:hero.red},10);
            });

    var greenBar=new Crafty.e("GreenBar, DOM, 2D, Color, Tween")
        .color('rgb(0,255,0)')
        .attr({
            alpha:0.9,
            x:20,
            y:40,
            w:hero.green,
            h:10
            })
        .bind('EnterFrame',function(){
            this.tween({w:hero.green},10);
            });

    var blueBar=new Crafty.e("BlueBar, DOM, 2D, Color, Tween")
        .color('rgb(0,0,255)')
        .attr({
            alpha:0.9,
            x:20,
            y:60,
            w:hero.blue,
            h:10
            })
        .bind('EnterFrame',function(){
            this.tween({w:hero.blue},10);
            });
    
 
//Ball
var ball=new Crafty.e("Ball, 2D, DOM, Color, Collision")
	.color('rgb(255,0,0)')
	.attr({ x: 300, y: 150, w: 10, h: 10, 
			dX: Crafty.math.randomInt(2, 5), 
			dY: Crafty.math.randomInt(2, 5) })
	.bind('EnterFrame', function () {
		//hit floor or roof
		if (this.y <= bounds.top || this.y >= bounds.bottom)
			this.dY *= -1;

		if (this.x > bounds.right) {
			this.dX *= -1;
            //below was the score increment
			//Crafty("LeftPoints").each(function () { 
			//	this.text(++this.points + " Points") });
		}
		if (this.x < bounds.left) {
			this.dX *= -1;
			//Crafty("RightPoints").each(function () { 
			//	this.text(++this.points + " Points") });
		}

		this.x += this.dX;
		this.y += this.dY;
	})
	.onHit('Paddle', function () {
	this.dX *= -1;
});

/*
var menu=new Crafty.e("Menu,DOM,2D,Text,Color,Tween")
    .color('rgb(0,0,0)')
    .attr({
        x:0,
        y:0,
        w:0,
        h:bounds.bottom,
        alpha:0,
        ready:false
        });
    menu.bind("EnterFrame",function(){
        if (hero.red<20 && hero.green<20 && hero.blue<20 && this.ready==false){
            this.ready===true;
            this.tween({alpha:1,w:bounds.right+10},20);
            this.text("GAME OVER");
            this.textColor("rgb(255,255,255)",1);
            }
        });
*/
//Score boards
Crafty.e("Blackboard, DOM, 2D, Tween, Color, Text")
    .attr({ 
        alpha:0,
        x: 0, 
        y: 0, 
        w: bounds.right, 
        h: bounds.bottom, 
        ready:true,
        points: 0 
        })
    .bind("EnterFrame",function(){
        if (hero.red<20 && hero.green<20 && hero.blue<20 && this.ready==true){
            this.ready===false;
            this.tween({alpha:1},20);
            this.color('rgb(0,0,0)');
            }
        });
    
//Score boards
Crafty.e("Message, DOM, 2D, Tween, Color, Text")
	.attr({ 
        alpha:0,
        x: 0, 
        y: 100, 
        w: bounds.right, 
        h: bounds.bottom, 
        ready:true,
        points: 0 
        })
    .bind("EnterFrame",function(){
        if (hero.red<20 && hero.green<20 && hero.blue<20 && this.ready==true){
            this.ready===false;
            this.tween({alpha:1},20);
            this.text("GAME OVER");
            this.textColor('#ffffff');
            }
        });
    
/*
Crafty.e("RightPoints, DOM, 2D, Text")
	.attr({ x: 515, y: 20, w: 100, h: 20, points: 0 })
	.text("0 Points");
    */
    
};