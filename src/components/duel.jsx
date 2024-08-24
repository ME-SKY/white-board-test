import React, { useEffect, useRef, useState } from 'react';

function Settings({ hero, onClose }) {
  const [color, setColor] = useState(hero.color);
  const [fireRate, setFireRate] = useState(hero.fireRate);

  const handleSave = () => {
    hero.color = color;
    hero.fireRate = fireRate;
    onClose();
  };

  return (
    <div className="settings-menu">
      <div>
        <label>Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <div>
        <label>Fire Rate:</label>
        <input
          type="range"
          min="100"
          max="2000"
          value={fireRate}
          onChange={(e) => setFireRate(Number(e.target.value))}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

function Duel() {
  const canvasRef = useRef(null);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const score = useRef({ hero1: 0, hero2: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const spells = [];

    const hero1 = { x: 50, y: 100, radius: 20, color: 'blue', dy: 2, fireRate: 1000 };
    const hero2 = { x: 450, y: 100, radius: 20, color: 'red', dy: 2, fireRate: 1000 };

    const shootSpell = (hero, direction) => {
      spells.push({
        fromHero: direction === 'left' ? 'hero2' : 'hero1',
        x: hero.x,
        y: hero.y,
        radius: 5,
        color: hero.color,
        dx: direction === 'left' ? -2 : 2
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw heroes
      ctx.beginPath();
      ctx.arc(hero1.x, hero1.y, hero1.radius, 0, Math.PI * 2);
      ctx.fillStyle = hero1.color;
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(hero2.x, hero2.y, hero2.radius, 0, Math.PI * 2);
      ctx.fillStyle = hero2.color;
      ctx.fill();
      ctx.closePath();

      // Draw spells
      spells.forEach((spell, index) => {
        ctx.beginPath();
        ctx.arc(spell.x, spell.y, spell.radius, 0, Math.PI * 2);
        ctx.fillStyle = spell.color;
        ctx.fill();
        ctx.closePath();

        spell.x += spell.dx;

        // Remove spell if it goes off screen
        if (spell.x < 0 || spell.x > canvas.width) {
          spells.splice(index, 1);
        }

        if ((spell.x > (hero1.x - hero1.radius) && spell.x < (hero1.x + hero1.radius) && spell.fromHero === 'hero2') && (spell.y > (hero1.y - hero1.radius) && spell.y < (hero1.y + hero1.radius))) {
          spells.splice(index, 1);
          score.current.hero2++;
        }

        if ((spell.x > (hero2.x - hero2.radius) && spell.x < (hero2.x + hero2.radius) && spell.fromHero === 'hero1') && (spell.y > (hero2.y - hero2.radius) && spell.y < (hero2.y + hero2.radius))) {
          spells.splice(index, 1);
          score.current.hero1++;
        }

        // if (spell.y > (hero1.y - hero1.radius) && spell.y < (hero1.y + hero1.radius) && spell.x > (hero1.x - hero1.radius) && spell.x < (hero1.x + hero1.radius) && spell.fromHero === 'hero1') {
        //   spells.splice(index, 1);
        //   console.log('spell hit hero 1');

        // }
      });

      //draw score
      ctx.beginPath();

      ctx.fillStyle = 'white';
      ctx.fillRect((canvas.width / 2) - 20, 20, 40, 20);
      ctx.font = "14px serif";
      
      // ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.font = "14px serif";
      ctx.fillText(`${score.current.hero1}:${score.current.hero2}`, (canvas.width / 2) - 20, 30);
      ctx.closePath();
    };

    const update = () => {
      hero1.y += hero1.dy; //todo add condition before change coordinates
      hero2.y += hero2.dy;

      // Collision with top and bottom
      if (hero1.y + hero1.radius > canvas.height || hero1.y - hero1.radius < 0) {
        hero1.dy *= -1;
      }

      if (hero2.y + hero2.radius > canvas.height || hero2.y - hero2.radius < 0) {
        hero2.dy *= -1;
      }

      const curPos = cursorPosition.current;

      if ((curPos.x > (hero1.x - hero1.radius)) && (curPos.x < (hero1.x + hero1.radius))) {
        // console.log('inside!');

        if (Math.abs(curPos.y - hero1.y) <= hero1.radius) {
          hero1.dy *= -1;
        }

      }

      render();
      requestAnimationFrame(update);
    };

    // Fire spells at regular intervals
    const hero1ShootInterval = setInterval(() => shootSpell(hero1, 'right'), hero1.fireRate);
    const hero2ShootInterval = setInterval(() => shootSpell(hero2, 'left'), hero2.fireRate);

    const handleMouseMove = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseY = event.clientY - rect.top;
      const mouseX = event.clientX - rect.left;

      cursorPosition.current = { x: mouseX, y: mouseY };

      // Check collision with heroes
      // if (Math.abs(mouseY - hero1.y) < hero1.radius) {
      // hero1.dy *= -1;
      // }

      // if (Math.abs(mouseY - hero2.y) < hero2.radius) {
      // hero2.dy *= -1;
      // }
    };

    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    update();

    return () => {
      console.log('it should call only once');
      clearInterval(hero1ShootInterval);
      clearInterval(hero2ShootInterval);
      canvasRef.current.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    <canvas ref={canvasRef} width={500} height={300} style={{ border: '1px solid black' }} />
  );
}

export default Duel;
