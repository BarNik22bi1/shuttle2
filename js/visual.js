//visualization

const gravity = 3.71;
//Работа с пользователем
var power = 0.978;
var angle = 0;
var FuelUsage = 0;
let validFunc = new Function('return[0,0]');
let funcResult = [0,0];
//Приложение
var app;
var height=700;
var width=400;
//Настройка шатла
const shuttle = PIXI.Sprite.from('img/shuttle2.png');
const flare = PIXI.Sprite.from('img/lens2.png');
var defaultX =100;
var defaultY =100;
let xSpeed, ySpeed, pX1, pX2, pY = 0;

document.addEventListener('DOMContentLoaded', () => {
  let pixContainer = document.getElementById("shuttle-holder");
    // Create a new PIXI Application
    app = new PIXI.Application({
      width: pixContainer.clientWidth,
      height: pixContainer.clientHeight,
      antialias: true,
      transparent: false,
      resolution: 1
    });
    height = app.renderer.height;
    width = app.renderer.width;
    
    // Resize the renderer when the container size changes
    window.addEventListener('resize', function() {
      app.renderer.resize(pixContainer.clientWidth, pixContainer.clientHeight);
      height = app.renderer.height;
      width = app.renderer.width;
    });
  
    if(pixContainer) {
      pixContainer.appendChild(app.view);
  
      // Now you can start creating sprites and adding them to stage.
      app.stage.addChild(shuttle);
      shuttle.width = 128;
      shuttle.height = 128;
      shuttle.anchor.set(0.5, 0.5);
      shuttle.x = 100; //defaultX;
      shuttle.y = 100; //defaultY;
      shuttle.speedX = 0;
      shuttle.speedY = 0;
      shuttle.shuttleAngle = this.shuttleAngle;
      shuttle.shuttleFuel = this.shuttleFuel;
      shuttle.pX1=this.pX1;
      shuttle.pX2=this.pX2;
      shuttle.pY=this.pY;
      
      //Пламя под шатлом
      shuttle.addChild( flare);
      flare.anchor.x = 0.5;
      flare.anchor.y = 0.2;


      // Установка среды для шатла
      MM = new MissionManager(shuttle);
          
      
      // Тик времени
      app.ticker.add((delta) => {

        // Обработка функцией пользователя значений с получением значений угла и ускорения
        funcResult = validFunc();

        //Проверка топлива
        if(shuttle.shuttleFuel>0){
          power = funcResult[0];
          shuttle.shuttleFuel = shuttle.shuttleFuel-power;
          angle = funcResult[1];
        }
        else{
          power=0;
          angle = funcResult[1];
        }
    
        // Обновление среды (кроме шатла) в данной итерации 
        MM.update(); 

        //Проверка коллизии
        if (MM.land.hasColision(shuttle)) {
          console.log(MM.land+`Visual: Collision ${shuttle.x} ${ Point.rY(shuttle.y)}`);
          if (!nextMissionFlag){
            app.ticker.stop();
          }
          
        }
        else  {
          // Convert angle from degrees to radians and adjust by -90 degrees
          var angleInRadians = (angle) * (Math.PI / 180);
          shuttle.rotation = angleInRadians;
          //gravity
          shuttle.speedY += gravity * delta;
      
          // Correct y speed calculation: positive should go down in screen coordinates, but we want up
          shuttle.speedX += Math.sin(angleInRadians) * power * delta;
          shuttle.speedY -= Math.cos(angleInRadians) * power * delta;
          
          let newX = shuttle.x + shuttle.speedX;
          let newY = shuttle.y + shuttle.speedY;
      
          // Prevent shuttle from going below container height,
          if(newY >= app.renderer.height - (shuttle.height / 2)) {
              newY = app.renderer.height - (shuttle.height / 2);
              shuttle.speedY = 0; // Reset vertical speed upon "landing"
              shuttle.speedX= 0.95; // Optionally apply horizontal friction
          }
        
          // Update sprite position with new values.
          shuttle.x = newX;
          shuttle.y = newY;
        
          // Rotate sprite based on original degree value minus offset
          shuttle.rotation = angleInRadians;
        }; 
        xSpeed = shuttle.speedX;
        ySpeed = shuttle.speedY; 
        pX1=shuttle.pX1;
        pX2=shuttle.pX2;
        pY=shuttle.pY;
      });
      

    
    } 

    else {
      console.error("Could not find the '#pixi-container' element.");
    }
  }
);
