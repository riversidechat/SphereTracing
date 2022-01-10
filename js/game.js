var canvasDiv = CreateElement('div', {id: "AllCanvs"}, '#main');

var renderer = new Renderer(CreateElement('canvas', {id: "mainCanvas"}, canvasDiv));
var game = new Game();
var camera = new Camera(0, 0, renderer);
var player = new Player(0, 0, 40, 70, 0, 0, 40, 70);
var particles = new ParticleArray();
var platforms = new PlatformArray();


platforms.Invert();
platforms.SetScale(100);
platforms.Add(-4, -2, 7, -5, 1);
platforms.Add(-4, -100, 4, -101, 1);
for(var y = -5.5; y < 4.5; y++)
{
  for(var x = -5.5; x < 4.5; x++)
  {
    if(RandomInt(0, 5) != 0)
    {
      if(x != -0.5 || y != -0.5)
      {
        platforms.Add(x * 4, y * 4, x * 4 + 4, y * 4 + 4, 2);

      }
    }
  }
}

game.StartUpdateFunction(Update);

function Update(ts)
{
    game.Update(ts);

    if(GetKeyState(Keys.space))
    {
      segments ++;
      segments = segments % 5;
      console.log("Hello");
    }

    ReplaceInnerHTML("title", "FPS: " + Math.round(game.FPS))

    renderer.ResetColor();
    renderer.FullScreen();
    renderer.FillScreen();

    camera.MoveTo_Soft(player.x, player.y, renderer, game);
    particles.Update(platforms, renderer, camera, game);
    player.Update(platforms, particles, renderer, camera, game);

    particles.Draw(renderer, camera);
    platforms.Draw(renderer, camera);
    player.Draw(renderer, camera);

    if(GetKeyState(Keys.space))
    {
      var x = SnapToGrid((Mouse.x + camera.x), 25);
      var y = SnapToGrid((Mouse.y + camera.y), 25);
      if(!platforms.Collision(x, y, 15, 15, renderer, camera)) // && DistToRect(Mouse.x + camera.x, Mouse.y + camera.y, {x1: player.x + player.bbx - player.bbw / 2, y1: player.y + player.bby - player.bbh / 2, x2: player.x + player.bbw, y2: player.y + player.bbh}) > 100)
      {
        platforms.Invert();
        platforms.Add(x / 100, y / 100, (x + 25) / 100, (y + 25) / 100, 5);
        platforms.Invert();
      }
    }

    Mouse.Update();
    game.RecallUpdate();
}
