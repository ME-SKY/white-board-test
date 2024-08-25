import React, { useEffect, useRef, useState } from 'react';
import './duel.css'

function Settings({ hero, onClose }) {
  const [color, setColor] = useState(hero.heroColor);
  const [fireRate, setFireRate] = useState(hero.fireRate);
  const [speed, setSpeed] = useState(Math.abs(hero.dy));

  const handleSave = () => {
    onClose({fireRate, speed: parseInt(speed), heroColor: color, id: hero.id});
  };

  return (
    <div className="settings" style={{top: hero.y, left: hero.x}}>
      <div className='settings-option'>
        <label>Hero color:</label>
        
        <select name="hero-color" value={color} onChange={e => {console.log('hero-color changin');setColor(e.target.value)}}>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
          <option value="purple">Purple</option>
        </select>
        {/* <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        /> */}
      </div>
      
      <div className='settings-option'>
        <label>Hero fire rate: {fireRate}</label>
        
        <input type="range" name="hero-fire-rate" min="200" max="2000" value={fireRate} onChange={e =>{ console.log('fire rate changin', e.target.value); setFireRate(e.target.value)}} step='200'/>
      </div>

      <div className='settings-option'>
        <label>Hero speed: {speed}</label>
        <input type="range" name="hero-speed" min="1" max="10"  value={speed} onChange={e => setSpeed(e.target.value)}/>
      </div>

      
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

const CANVAS_SIZE = {
  width: 640,
  height: 360,
}

const GAME_FIELD_SIZE = {
  width: 640,
  height: 320,
}

function Duel() {
  console.log('rerendrs')
  const canvasRef = useRef(null);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const score = useRef({ hero1: 0, hero2: 0 });
  const canvasStyleSize = useRef({ width: 0, height: 0 });
  // const [settingsOpen, setSettingsOpen] = useState(true);
  const [heroClicked, setHeroClicked] = useState(null);
  // const [hero1Info, setHero1] = useState({ x: 50, y: 60, radius: 20, heroColor: 'blue', dy: 2, fireRate: 1000 });
  // const [hero2Info, setHero2] = useState({ x: 50, y: 60, radius: 20, heroColor: 'blue', dy: 2, fireRate: 1000 });
  // const [spellsInfo, setSpells] = useState([]);

  const hero1 = useRef({id: 1, x: 50, y: 60, radius: 20, heroColor: 'blue', dy: 2, fireRate: 1000 });
  const hero2 = useRef({id: 2, x: 590, y: 320, radius: 20, heroColor: 'red', dy: -2, fireRate: 1000 });
  const spells = useRef([]);

  const animationFrameCancelId = useRef(null);

  function changeHeroSettings({id, heroColor, fireRate, speed}) {
    if(hero1.current.id === id) {
      hero1.current.heroColor = heroColor;
      hero1.current.fireRate = fireRate;
      hero1.current.dy = speed;
    } else {
      hero2.current.heroColor = heroColor;
      hero2.current.fireRate = fireRate;
      hero2.current.dy = speed;
    }

    setHeroClicked(null);
  }

  // const [score, setScore] = useState({ hero1: 0, hero2: 0 });

  useEffect(() => {
    // let animationFrameCancelId = null;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext('2d');
    const ratio = Math.ceil(window.devicePixelRatio);
    canvas.width = CANVAS_SIZE.width * ratio;
    canvas.height = CANVAS_SIZE.height * ratio;
    // canvasRescaledInnerSize.current = { width: canvas.width , height: canvas.height };
    canvas.style.width = `${CANVAS_SIZE.width}px`;
    canvas.style.height = `${CANVAS_SIZE.height}px`;
    // canvas.width = canvas.clientWidth * scale;
    // canvas.height = canvas.clientHeight * scale;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    console.log('canvas.height', canvas.height)
    console.log('canvas.style.height', canvas.style.height);
    console.log('ctx.height', ctx.height);


    // const spells = [];

    // const hero1 = { x: 50, y: 60, radius: 20, heroColor: 'blue', dy: 2, fireRate: 1000 };
    // const hero2 = { x: 590, y: 320, radius: 20, heroColor: 'red', dy: -2, fireRate: 1000 };

    const shootSpell = (hero, direction) => {
      spells.current.push({
        fromHero: direction === 'left' ? 'hero2' : 'hero1',
        x: hero.x,
        y: hero.y,
        radius: 5,
        color: hero.heroColor,
        dx: direction === 'left' ? -2 : 2
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

       // draw game field rectangle
      ctx.beginPath();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, 40, GAME_FIELD_SIZE.width, GAME_FIELD_SIZE.height);
      ctx.closePath();

      const h1 = hero1.current;
      console.log(h1.dy);
      // Draw heroes
      ctx.beginPath();
      ctx.arc(h1.x, h1.y, h1.radius, 0, Math.PI * 2);
      ctx.fillStyle = h1.heroColor;
      ctx.fill();
      ctx.closePath();

      const h2 = hero2.current;
      // if(!h1 && !h1.dy) {
      //   console.log('h1', h1);
      //   // console.log('h2', h2);
      // }
      ctx.beginPath();
      ctx.arc(h2.x, h2.y, h2.radius, 0, Math.PI * 2);
      ctx.fillStyle = h2.heroColor;
      ctx.fill();
      ctx.closePath();

      // Draw spells
      spells.current.forEach((spell, index) => {
        ctx.beginPath();
        ctx.arc(spell.x, spell.y, spell.radius, 0, Math.PI * 2);
        ctx.fillStyle = spell.color;
        ctx.fill();
        ctx.closePath();

        spell.x += spell.dx;

        // Remove spell if it goes off screen
        if (spell.x < 0 || spell.x > canvas.width) {
          spells.current.splice(index, 1);
        }

        if ((spell.x > (h1.x - h1.radius) && spell.x < (h1.x + h1.radius) && spell.fromHero === 'hero2') && (spell.y > (h1.y - h1.radius) && spell.y < (h1.y + h1.radius))) {
          spells.current.splice(index, 1);
          // setScore(score => ({ ...score, hero2: score.hero2 + 1 }));
          score.current.hero2 = score.current.hero2 + 1
        }

        if ((spell.x > (h2.x - h2.radius) && spell.x < (h2.x + h2.radius) && spell.fromHero === 'hero1') && (spell.y > (h2.y - h2.radius) && spell.y < (h2.y + h2.radius))) {
          spells.current.splice(index, 1);
          // setScore(score => ({ ...score, hero1: score.hero1 + 1 }));
          score.current.hero1 = score.current.hero1 + 1
        }

        // if (spell.y > (hero1.y - hero1.radius) && spell.y < (hero1.y + hero1.radius) && spell.x > (hero1.x - hero1.radius) && spell.x < (hero1.x + hero1.radius) && spell.fromHero === 'hero1') {
        //   spells.splice(index, 1);
        //   console.log('spell hit hero 1');

        // }
      });

      //draw score rectangle
      ctx.beginPath();

      ctx.fillStyle = 'white';
      ctx.fillRect((CANVAS_SIZE.width / 2) - 30, 10, 60, 20);
      ctx.font = "14px serif";

      // ctx.fill();
      ctx.closePath();

      //draw score text
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.font = "16px serif";
      const text = `${score.current.hero1}:${score.current.hero2}`;
      const textWidth = ctx.measureText(text).width;
      ctx.fillText(`${score.current.hero1}:${score.current.hero2}`, (CANVAS_SIZE.width / 2) - (textWidth / 2), 25);
      ctx.closePath();


     

      
    };

    const update = () => {

      const nextHero1YCoord = hero1.current.y + hero1.current.dy;
      const nextHero2YCoord = hero2.current.y + hero2.current.dy;
      
      
      if(nextHero1YCoord + hero1.current.radius > parseInt(canvas.style.height) || nextHero1YCoord - hero1.current.radius < 40) {
        hero1.current.dy *= -1;
      } else {
        hero1.current.y += hero1.current.dy;
      }

      if(nextHero2YCoord + hero2.current.radius > parseInt(canvas.style.height) || nextHero2YCoord - hero2.current.radius < 40) {
        hero2.current.dy *= -1;
      } else {
        hero2.current.y += hero2.current.dy;
      }
      // hero1.current.y += hero1.current.dy; //TODO: add condition before change coordinates
      // hero2.current.y += hero2.current.dy;

      // Collision with top and bottom
      // if (hero1.current.y + hero1.current.radius > parseInt(canvas.style.height) || hero1.current.y - hero1.current.radius < 40) {
      //   hero1.current.dy *= -1;
      // }

      // if (hero2.current.y + hero2.current.radius > parseInt(canvas.style.height) || hero2.current.y - hero2.current.radius < 40) {
      //   hero2.current.dy *= -1;
      // }

      const curPos = cursorPosition.current;

      if ((curPos.x > (hero1.current.x - hero1.current.radius)) && (curPos.x < (hero1.current.x + hero1.current.radius))) {
        // console.log('inside!');


        // if (curPos.y == (hero1.y - hero1.radius) || curPos.y == (hero1.y + hero1.radius)) {
        //   hero1.dy *= -1;
        // }
        if (Math.abs(curPos.y - hero1.current.y) <= hero1.current.radius) {
          hero1.current.dy *= -1;
        }

      }

      render();
      animationFrameCancelId.current = requestAnimationFrame(update);
    };

    // Fire spells at regular intervals
    const hero1ShootInterval = setInterval(() => shootSpell(hero1.current, 'right'), hero1.current.fireRate);
    const hero2ShootInterval = setInterval(() => shootSpell(hero2.current, 'left'), hero2.current.fireRate);

    const handleMouseMove = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseY = event.clientY - rect.top;
      const mouseX = event.clientX - rect.left;

      cursorPosition.current = { x: mouseX, y: mouseY };
    };

    const handleClick = (event) => {
      if(cursorPosition.current.x > (hero1.current.x - hero1.current.radius) && cursorPosition.current.x < (hero1.current.x + hero1.current.radius) && cursorPosition.current.y > (hero1.current.y - hero1.current.radius) && cursorPosition.current.y < (hero1.current.y + hero1.current.radius)) {
        console.log('hero clicked');
        setHeroClicked(hero1.current);
      }
    }

    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('click', handleClick);

    if( animationFrameCancelId.current && heroClicked) {
      console.log('we are here!', animationFrameCancelId.current);
      cancelAnimationFrame(animationFrameCancelId.current);
      animationFrameCancelId.current = null;
      render();
      // heroClicked = null;
    } else {
      // console.log('we are here!', animationFrameCancelId.current);
      console.log('animation continue!', animationFrameCancelId.current)
      update();
    }
    

    return () => {
      clearInterval(hero1ShootInterval);
      clearInterval(hero2ShootInterval);
      canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current.removeEventListener('click', handleClick);
      animationFrameCancelId.current && cancelAnimationFrame(animationFrameCancelId.current);
      // animationFrameCancelId.current = null;
    };
  }, [heroClicked]);

  // useEffect(() => {
  //   const handleMouseMove = (event) => {
  //     const rect = canvasRef.current.getBoundingClientRect();
  //     const mouseY = event.clientY - rect.top;

  //     // Check collision with heroes
  //     if (Math.abs(mouseY - hero1.y) < hero1.radius) {
  //       hero1.dy *= -1;
  //     }

  //     if (Math.abs(mouseY - hero2.y) < hero2.radius) {
  //       hero2.dy *= -1;
  //     }
  //   };

  //   canvasRef.current.addEventListener('mousemove', handleMouseMove);

  //   return () => {

  //   };
  // }, []);

  const checkCollision = (spell, hero) => {
    const distX = spell.x - hero.x;
    const distY = spell.y - hero.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < spell.radius + hero.radius;
  };

  // useEffect(() => {
  //   const update = () => {
  //     hero1.y += hero1.dy;
  //     hero2.y += hero2.dy;

  //     spells.forEach((spell, index) => {
  //       spell.x += spell.dx;

  //       if (checkCollision(spell, hero1)) {
  //         spells.splice(index, 1);
  //         // Update score or handle collision
  //       }

  //       if (checkCollision(spell, hero2)) {
  //         spells.splice(index, 1);
  //         // Update score or handle collision
  //       }

  //       if (spell.x < 0 || spell.x > canvas.width) {
  //         spells.splice(index, 1);
  //       }
  //     });

  //     render();
  //     requestAnimationFrame(update);
  //   };

  //   update();
  // }, [spells]);




  return (

    <div className="duel-game-container">
      <canvas ref={canvasRef} />
      {heroClicked && <Settings hero={heroClicked} onClose={changeHeroSettings} />}
     </div>

  );
}

export default Duel;
