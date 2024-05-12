var editor = ace.edit("userFunction");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
var missionIndex = 0;
var nextMissionFlag = false;
window.onload = function() {
  resetFunction();
};
//Кнопка сброса
function resetFunction() {
  editor.setValue(`function myFunction() {
  let power = 3.71;
  let angle = 0;
  //Your code here
  return [power, angle];
}`);
}

//Кнопка запуска миссии
function runFunction() {
  var userCode = editor.getValue();
    var userFunc;
  
    

    try {
      userFunc = new Function(`return ${userCode}`)();
      
    } catch (error) {
      document.getElementById("result").innerHTML = "Compilation Error: " + error.message;
      return;
    }
  
    if (typeof userFunc !== "function") {
      document.getElementById("result").innerHTML = "Error: Input is not a function.";
      return;
    }
  
    var result;
    try {
      result = userFunc();
    } catch (error) {
      document.getElementById("result").innerHTML = "Execution Error: " + error.message;
      return;
    }
  
    if (!Array.isArray(result) || result.length !== 2) {
      document.getElementById("result").innerHTML = "Error: Function must return an array with two numbers.";
      return;
    }
    var a = result[0];
    var b = result[1];
  
    if (typeof a !== 'number' || a < 0 || a > 10) {
      document.getElementById("result").innerHTML = "Error: The first item must be a number between 0 and 10.";
      return;
    }
  
    if (typeof b !== 'number' || b < -90 || b > 90) {
      document.getElementById("result").innerHTML = "Error: The second item must be between -90 and 90.";
      return;
    }
    validFunc = userFunc;
    power = result[0];
    angle = result[1];
    app.ticker.start();
    missionIndex = 0; // При кнопке ран начинаю с первой миссии
    MM.beginAgain(); 
    console.log('the mission has begun')
    document.getElementById("result").innerHTML = "Function executed successfully. Result: " + result;
  }



  


  // Dmitry Code

  //Связующий класс, отвечающий за общее состояние выполнения миссий
  class MissionManager{
    nextMission() {
      missionIndex++;
      
      // Если есть еще миссии
      if (missionIndex < Mission.Missions.length) {
          Mission.Missions[missionIndex].runMission(this.shuttle);
          this.Graf.clear();
          this.land = new Land();
          this.Graf.moveTo(0, height);
          this.Graf.lineStyle(5, 0xFF0000);
          this.land.points.forEach((p) => {this.Graf.lineTo(p.x, p.y)});
      }
      else{
        app.ticker.stop();
      }
      console.log(`${missionIndex} ${Mission.Missions.length} mission has begun ${shuttle.x} ${Point.rY(shuttle.y)}`)
    }
  
    // Графические объекты
    Graf = new PIXI.Graphics();
    shuttle; // Шатл, настроен в visual.js
    explosion = PIXI.Sprite.from('img/explosion.png'); //Взрыв
    indicator = new PIXI.Graphics(); // Обозначение поверхности ровно под марсоходом
    text = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});    // Текст с данными о шатле
    y = 0; // Позиция y ландшафта  ПОД марсоходом
    land; // Совокупность линий

    //Основной блок рисовки с использованием всех вспомогательных функций и классов 
    update(){
      
      this.explosion.visible = false;
      this.indicator.clear();
      this.indicator.beginFill(0xFFFF00);
      this.indicator.drawRect(this.shuttle.x-this.shuttle.width/2,Point.rY(MissionManager.y),this.shuttle.width,5);
      this.text.text = `Mission: ${missionIndex+1}/${Mission.Missions.length}
      Fuel: ${Math.round(this.shuttle.shuttleFuel*100)/100}
      X: ${Math.round(this.shuttle.x)}
      Y: ${Math.round(Point.rY(this.shuttle.y))}
      X Speed: ${ Math.round(this.shuttle.speedX*100)/100 }
      Y Speed: ${ Math.round(this.shuttle.speedY*-100)/100 }
      `;
      this.flareUpdate();

      //Проверяю был ли фоаг, и на этой итерации меняю всю среду
      if (nextMissionFlag){
        MM.nextMission();
        nextMissionFlag = false;
      }
    }  

    get land(){
      return this.land;
    }


    //Создание ММ и инициализация всего
    constructor(shuttle){
      Mission.Missions[0].runMission(shuttle);
      this.shuttle = shuttle;
      this.land = new Land();
      this.Graf.moveTo(0,height);
      this.Graf.lineStyle(5, 0xFF0000);
      this.land.points.forEach((p) => this.Graf.lineTo(p.x,p.y) );


      app.stage.addChild(this.indicator);
      app.stage.addChild(this.Graf);
      app.stage.addChild(this.text);

      app.stage.addChild(this.explosion);
      this.explosion.visible = false;

      


      this.text.x = 0.8 * width;
      this.text.y = 0.8 * Point.rY(height); 
      this.update();
    }
    
    beginAgain(){
      Mission.Missions[missionIndex].runMission(shuttle);
      this.Graf.clear();
      this.land = new Land();
      this.Graf.moveTo(0,height);
      this.Graf.lineStyle(5, 0xFF0000);
      this.land.points.forEach((p) => this.Graf.lineTo(p.x,p.y) );

    }
    //Обработка взрыва
    crush(){
      this.explosion.visible = true;
      this.explosion.width = this.shuttle.width;
      this.explosion.height = this.shuttle.height;
      this.explosion.x = this.shuttle.x-this.shuttle.width/2;
      this.explosion.y = this.shuttle.y-this.shuttle.height/2;
    }
    flareUpdate(){
      //Нормализация (val, max, min) => (val - min) / (max - min); 
      //Тут будет настройка графики отображения пламени  
      flare.alpha = 0.85+0.15*Math.random(1) //Math.round(power) )//(power - 0) / (3.71 - 0); 
      flare.width = 1500*Math.round(power); 
    }
    }
  
    //Обычный класс точки с x,y
    class Point{
      x;
      y;
      constructor(x,y) {
        this.x=x;
        this.y=Point.rY(y);
      } 
      //Переворачивает y (Изначально он равен 0 вверху)
      static rY(y){
        return height-y
      }
    }

    // Создает точку по проценту от размера области
    function percentPoint(x,y){
      p = new Point(x,y);
      p.x= Math.floor(width*x);
      p.y= Math.floor(height-height*y);
      return p;
    } 

    // Создает левел из процентных точек (Более универсально)
    function levelFromPercentCoords(coords){
      level=[];
      coords.forEach(p => {
        level.push( new percentPoint(p[0],p[1]));
      });
      return level;
    }
    
    // Отвечает за линии земли и коллизию с ними
    class Land{    
      // крайняя точка слева, затем беру точки из миссии, затем 0,0 справа
      points=[new Point(-200,0)];
      constructor() {
        this.points = this.points.concat( Mission.Missions[missionIndex].level)
        this.points = this.points.concat( [new Point(width+200,0)] ); 
      }
      
      
      // Ищу Y, который скорее всего не задан точкой.
      findPointY(x){
        // Поиск ближайших точек
        var y;
        let nearLeft = this.points.at(0);
        let nearRight = this.points.at(-1);
        this.points.forEach(p => {
          if (p.x<x){
            if (p.x>=nearLeft.x){
              nearLeft = p;
            }
          }
          else{
            if (p.x<=nearRight.x){
              nearRight = p;
            }
          }
        });

        
        //Плато
        if (nearRight.y==nearLeft.y){
          y = Point.rY(nearLeft.y)
        }
        else {
          //Спуск
          if (nearLeft.y<=nearRight.y){
            y = ( Point.rY(nearLeft.y)-Point.rY(nearRight.y) ) * Math.abs(nearRight.x-x) / Math.abs(nearRight.x-nearLeft.x)+Point.rY(nearRight.y);
          }
          //подъем
          else{
            y = ( Point.rY(nearRight.y)-Point.rY(nearLeft.y) ) * Math.abs(nearLeft.x-x) / Math.abs(nearLeft.x-nearRight.x)+Point.rY(nearLeft.y);
          }
        }
        return Point.rY(y);
      }
      //Поиск плато
      isPlateau(x){
        // Сначала поиск ближайших точек
        var y;
        let nearLeft = this.points.at(0);
        let nearRight = this.points.at(-1);
        this.points.forEach(p => {
          if (p.x<x){
            if (p.x>=nearLeft.x){
              nearLeft = p;
            }
          }
          else{
            if (p.x<=nearRight.x){
              nearRight = p;
            }
          }
        });  
        // Это плато
        if(nearRight.y==nearLeft.y) {
          return true 
        }
        // Есть уклон
        else{
          return false
        }     
      }
      // Проверка коллизиии тру если норм, false если краш
      hasColision(shuttle){
        
        var y = Point.rY(this.findPointY(shuttle.x));
        //console.log("HasCol0:"+y,Point.rY(shuttle.y));
        MissionManager.y = y;
        console.log();
        //Y Поверхности оказывается выше шаттла (с учетом погрешности)
        if ( y+(shuttle.height/2)-3>Point.rY(shuttle.y)){
          //console.log("HasCol1:"+y,Point.rY(shuttle.y));
          // Неудачная посадка
          if ((shuttle.speedX > 5)) {
            console.log("Crush!!!");
            MM.crush();
            MM.text.text = `Crush Cause - the horizontal
            speed was too high`;
          }
          if((shuttle.speedY > 5)){
            console.log("Crush!!!");
            MM.crush();
            MM.text.text = `Crush Cause - the verical 
            speed was too high`;
          }
          if((angle >= 10) || (angle <= -10)){
            console.log("Crush!!!");
            MM.crush();
            MM.text.text = `Crush Cause - the angle
            was too high`;
          }
          if(!(this.isPlateau(shuttle.x-shuttle.width/2)) || !(this.isPlateau(shuttle.x)) || !(this.isPlateau(shuttle.x+shuttle.width/2)))  {
            console.log("Crush!!!");
            MM.crush();
            MM.text.text = `Crush Cause - you are
            landing not on plateau`;
          }
          // Удачная посадка
          else {
            console.log("Congratulations!!!");
            nextMissionFlag = true;
          }
          return true;
        }
        //Улет более чем на 25% границ справа или сверху
        else if(Point.rY(shuttle.y)>=1.25*height || shuttle.x<=-0.25*width || shuttle.x>=1.25*width){
          MM.crush();
          MM.text.text = `Crush Cause - you leave
           land area`;
          console.log("Far distance");
          return true;
        } 
        else  {
          return false;
        }
      }
    }

    // Отвечает за линии земли, стартовые условия марсохода в каждой миссии
    class Mission{
      


      //Настройка старта шатла
      shuttleX=1000;
      shuttleY=200;
      shuttleXSpeed=0;
      shuttleYSpeed=0;
      shuttleAngle=0;
      shuttleFuel=600;
      //Настройка поверхности
      level = [];


      constructor(shuttleX = 1000, shuttleY = 200, shuttleXSpeed = 0, shuttleYSpeed = 0, shuttleAngle = 0, shuttleFuel = 600, level) {
        // Настройка старта шатла
        this.shuttleX = shuttleX;
        this.shuttleY = shuttleY;
        this.shuttleXSpeed = shuttleXSpeed;
        this.shuttleYSpeed = shuttleYSpeed;
        this.shuttleAngle = shuttleAngle;
        this.shuttleFuel = shuttleFuel;
        // Настройка поверхности
        this.level = level;
        
      }
      
      // Все миссии
      static Missions = [ 
        // Новые по концептам
        new Mission(0.9,0.15,0,0,0,2600,levelFromPercentCoords( [[0,0.8],[0.2,0.8],[0.27,0.55],[0.4,0.45],[0.5,0.50],[0.6,0.65],[0.75,0.55],[0.9,0.67],[1,0.63] ])   ),
        new Mission(0.5,0.2,0,0,0,1600,levelFromPercentCoords( [[0.0,0.5],[0.2,0.4],[0.3,0.55],[0.4,0.4],[0.6,0.4],[0.7,0.8],[0.8,0.7],[1,0.6] ])   ),
        new Mission(0.25,0.3,0,0,0,1600,levelFromPercentCoords( [[0.0,0.4],[0.2,0.6],[0.3,0.45],[0.4,0.35],[0.6,0.4],[0.7,0.3],[0.85,0.3],[1,0.8] ])   ),
        new Mission(0.12,0.3,1,0,0,1600,levelFromPercentCoords( [[0.0,0.3],[0.1,0.3],[0.15,0.65],[0.25,0.55],[0.30,0.6],[0.37,0.79],[0.40,0.3],[0.45,0.1],[0.50,0.3],[0.65,0.6],[0.68,0.72],[0.71,0.5],[0.75,0.45],[0.86,0.45],[0.99,0.9]] )   ),
        //old missions
        //new Mission(1000,200,0,0,0,1600,levelFromPercentCoords( [[0.1,0.4],[0.2,0.2],[0.3,0.7],[0.5,0.7]])   ),
        //new Mission(200,500,0,0,0,1600,levelFromPercentCoords( [[0.1,0.4],[0.9,0.4]  ] )),
        //new Mission(200,200,0,0,0,1600,levelFromPercentCoords( [[0.1,0.1],[0.2,0.1],[0.3,0.7],[0.5,0.7]]),   ),
        //new Mission(500,200,0,0,0,1600,levelFromPercentCoords( [[0.1,0.9],[0.2,0.1],[0.2,0.4],[0.9,0.9]]),   ),
      ]


      runMission(shuttle){

        //Стираю что осталось с предыдущей миссии
        if (this.shuttleX<=1){
          shuttle.x = width*this.shuttleX;
        }
        else{
          shuttle.x = this.shuttleX;
        }
        if (this.shuttleY<=1){
          shuttle.y = width*this.shuttleY;
        }
        else{
          shuttle.y = this.shuttleY;
        }
        shuttle.speedX = this.shuttleXSpeed;
        shuttle.speedY = this.shuttleYSpeed;
        shuttle.shuttleAngle = this.shuttleAngle;
        shuttle.shuttleFuel = this.shuttleFuel;
        

      }
      static runAllMissions(shuttle){
        
        Missions.forEach((m) => {
          m.runMission(shuttle);
        });
      }

    }
    

