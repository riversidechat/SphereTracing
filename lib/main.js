class Game
{
  constructor()
  {
    this.DeltaTime = 0;
    this.OldTime = 0;
    this.FPS = 0;
    this.SafeDeltaTime = 0;
    this.ticks = 0;
    this.funcName;
  }
  StartUpdateFunction(funcName)
  {
    this.funcName = funcName;
    window.requestAnimationFrame(funcName);
  }
  Update(timeStamp)
  {
    this.ticks ++;
    this.DeltaTime = (timeStamp - this.OldTime) / 1000;
    this.SafeDeltaTime = clamp(this.DeltaTime, 0, (1 / 60));
    this.FPS = (1 / this.DeltaTime);
    this.OldTime = timeStamp;
  }
  RecallUpdate()
  {
    window.requestAnimationFrame(this.funcName);
  }
}
class Renderer
{
  constructor(id, width = window.innerWidth, height = window.innerHeight)
  {
    this.ctx = document.querySelector(id).getContext('2d');
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;

    this.Width = width;
    this.Height = height;

    this.render = {
      scale: 1,
      lineWidth: 1,
      lineCap: "round",
      lineJoin: "round",
      fill: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      },
      stroke: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      }
    }
  }
  GetFill()
  {
    return `rgba(${this.render.fill.r}, ${this.render.fill.g}, ${this.render.fill.b}, ${this.render.fill.a})`;
  }
  GetStroke()
  {
    return `rgba(${this.render.stroke.r}, ${this.render.stroke.g}, ${this.render.stroke.b}, ${this.render.stroke.a})`;
  }
  SetFill(r, g, b, a)
  {
    this.render.fill.r = r;
    this.render.fill.g = g;
    this.render.fill.b = b;
    if(a)
    {
      this.render.fill.a = a;
    }
  }
  SetStroke(r, g, b, a)
  {
    this.render.stroke.r = r;
    this.render.stroke.g = g;
    this.render.stroke.b = b;
    if(a)
    {
      this.render.stroke.a = a;
    }
  }
  ResetColor()
  {
    this.render.lineWidth = 1;
    this.render.lineCap = "round";
    this.render.lineJoin = "round";
    this.SetFill(0, 0, 0, 1);
    this.SetStroke(0, 0, 0, 1);
  }
  SetLineWidth(lineWidth)
  {
    this.render.lineWidth = lineWidth;
  }
  SetRenderInfo(scale, lineWidth, lineCap, lineJoin, fill, stroke)
  {
    if(scale)
    {
      this.render.scale = scale;
    }
    if(lineWidth)
    {
      this.render.lineWidth = lineWidth;
    }
    if(lineCap)
    {
      this.render.lineCap = lineCap;
    }
    if(lineJoin)
    {
      this.render.lineJoin = lineJoin;
    }
    if(fill)
    {
      this.SetFill(fill.r, fill.g, fill.b, fill.a)
    }
    if(stroke)
    {
      this.SetStroke(stroke.r, stroke.g, stroke.b, stroke.a)
    }
  }
  FullScreen()
  {
    this.Width = window.innerWidth;
    this.Height = window.innerHeight;
    this.ctx.canvas.width = this.Width;
    this.ctx.canvas.height = this.Height;
  }
  SetScreenSize(w, h)
  {
    this.Width = w;
    this.Height = h;
    this.ctx.canvas.width = this.Width;
    this.ctx.canvas.height = this.Height;
  }
  FillScreen()
  {
    this.ctx.fillStyle = this.GetFill();
    this.ctx.fillRect(0, 0, this.Width, this.Height);
  }
  DrawRect(x1, y1, x2, y2)
  {
    this.ctx.strokeStyle = this.GetStroke();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.moveTo(x1 / this.render.scale, y1 / this.render.scale);
    this.ctx.lineTo(x1 / this.render.scale, y2 / this.render.scale);
    this.ctx.lineTo(x2 / this.render.scale, y2 / this.render.scale);
    this.ctx.lineTo(x2 / this.render.scale, y1 / this.render.scale);
    this.ctx.lineTo(x1 / this.render.scale, y1 / this.render.scale);

    this.ctx.stroke();
  }
  DrawFillText(text, x, y, fontSize, cam)
  {
    this.ctx.fillStyle = this.GetFill();
    this.ctx.font = `${fontSize / this.render.scale}px Arial`;
    this.ctx.fillText(text, (x / this.render.scale) - cam.x, y - cam.y);
  }
  DrawStrokeText(text, x, y, fontSize, cam)
  {
    this.ctx.strokeStyle = this.GetStroke();
    this.ctx.font = `${fontSize / this.render.scale}px Arial`;
    this.ctx.strokeText(text, (x / this.render.scale) - ((text.length * (fontSize / 2))/ 2) - cam.x, y - (fontSize / 4) - cam.y);
  }
  DrawFillRect(x1, y1, x2, y2)
  {
    this.ctx.strokeStyle = this.GetStroke();
    this.ctx.fillStyle = this.GetFill();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.moveTo(x1 / this.render.scale, y1 / this.render.scale);
    this.ctx.lineTo(x1 / this.render.scale, y2 / this.render.scale);
    this.ctx.lineTo(x2 / this.render.scale, y2 / this.render.scale);
    this.ctx.lineTo(x2 / this.render.scale, y1 / this.render.scale);
    this.ctx.lineTo(x1 / this.render.scale, y1 / this.render.scale);

    this.ctx.stroke();
    this.ctx.fill();
  }
  DrawFillRectNoStroke(x1, y1, x2, y2)
  {
    this.ctx.fillStyle = this.GetFill();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.moveTo(x1 / this.render.scale, y1 / this.render.scale);
    this.ctx.lineTo(x1 / this.render.scale, y2 / this.render.scale);
    this.ctx.lineTo(x2 / this.render.scale, y2 / this.render.scale);
    this.ctx.lineTo(x2 / this.render.scale, y1 / this.render.scale);
    this.ctx.lineTo(x1 / this.render.scale, y1 / this.render.scale);

    this.ctx.fill();
  }
  DrawLine(x1, y1, x2, y2)
  {
    this.ctx.strokeStyle = this.GetStroke();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.moveTo(x1 / this.render.scale, y1 / this.render.scale);
    this.ctx.lineTo(x2 / this.render.scale, y2 / this.render.scale);

    this.ctx.stroke();
  }
  DrawCircle(x, y, radius)
  {
    this.ctx.strokeStyle = this.GetStroke();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.arc(x / this.render.scale, y / this.render.scale, radius / this.render.scale, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
  DrawFillCircle(x, y, radius)
  {
    this.ctx.strokeStyle = this.GetStroke();
    this.ctx.fillStyle = this.GetFill();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.arc(x / this.render.scale, y / this.render.scale, radius / this.render.scale, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
  }
  DrawFillCircleNoStroke(x, y, radius)
  {
    this.ctx.fillStyle = this.GetFill();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.arc(x / this.render.scale, y / this.render.scale, radius / this.render.scale, 0, 2 * Math.PI);
    this.ctx.fill();
  }
  DrawEllipse(x, y, radiusX, radiusY)
  {
    this.ctx.strokeStyle = this.GetStroke();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.ellipse(x / this.render.scale, y / this.render.scale, radiusX / this.render.scale, radiusY / this.render.scale, 0, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
  DrawFillEllipse(x, y, radiusX, radiusY)
  {
    this.ctx.strokeStyle = this.GetStroke();
    this.ctx.fillStyle = this.GetFill();
    this.ctx.lineCap = this.render.lineCap;
    this.ctx.lineJoin = this.render.lineJoin;
    this.ctx.lineWidth = this.render.lineWidth / this.render.scale;

    this.ctx.beginPath();
    this.ctx.ellipse(x / this.render.scale, y / this.render.scale, radiusX / this.render.scale, radiusY / this.render.scale, 0, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
  }
  DrawBar(bx, by, min, max, value, size, colors)
  {
    var x = bx - max / 2;
    var y = by;

    var prev = this.render.lineWidth;
    this.SetLineWidth(size);
    this.SetStroke(255, 255, 255, 1);

    this.DrawLine(x + min, y, x + max, y);
    this.SetLineWidth(size - 5);
    this.SetStroke(0, 0, 0, 1);
    this.DrawLine(x + min, y, x + max, y);

    this.SetLineWidth(size - 10);
    this.SetStroke(colors.bg.r, colors.bg.g, colors.bg.b, 1);
    this.DrawLine(x + min, y, x + max, y);
    this.SetStroke(colors.fg.r, colors.fg.g, colors.fg.b, 1);
    this.DrawLine(x + min, y, x + min + clamp(value, 0, max - min), y);

    this.SetLineWidth(prev);
  }
}
class Camera
{
  constructor(x, y, render)
  {
    this.x = x - render.Width/2;
    this.y = y - render.Height/2;
  }
  MoveTo(x, y, render)
  {
    this.x = x;
    this.y = y;
  }
  MoveTo_Soft(x, y, render, game)
  {
    var dist = Dist(x, y, this.x, this.y);
    this.x += (((x - (render.Width / 2 * render.render.scale)) - this.x) / 16) * 60 * game.SafeDeltaTime;
    this.y += (((y - (render.Height / 2 * render.render.scale)) - this.y) / 16) * 60 * game.SafeDeltaTime;
  }
  MoveTo_Medium(x, y, render, game)
  {
    this.x += (((x - (render.Width / 2 * render.render.scale)) - this.x) / 8) * 60 * game.SafeDeltaTime;
    this.y += (((y - (render.Height / 2 * render.render.scale)) - this.y) / 8) * 60 * game.SafeDeltaTime;
  }
  MoveTo_Hard(x, y, render, game)
  {
    this.x += (((x - (render.Width / 2 * render.render.scale)) - this.x) / 4) * 60 * game.SafeDeltaTime;
    this.y += (((y - (render.Height / 2 * render.render.scale)) - this.y) / 4) * 60 * game.SafeDeltaTime;
  }
  MoveTo_Custom(x, y, friction, render, game)
  {
    this.x += (((x - (render.Width / 2 * render.render.scale)) - this.x) / friction) * 60 * game.SafeDeltaTime;
    this.y += (((y - (render.Height / 2 * render.render.scale)) - this.y) / friction) * 60 * game.SafeDeltaTime;
  }
}
class Player
{
  constructor(x, y, w, h, bbx, bby, bbw, bbh)
  {
    this.x = x;
    this.y = y;
    this.xv = 0;
    this.yv = 0;
    this.w = w;
    this.h = h;
    this.bbx = bbx;
    this.bby = bby;
    this.bbw = bbw;
    this.bbh = bbh;

    this.Gravity = 0.8;
    this.Friction = 1.1;
    this.FloorFriction = 1.005;
    this.MovementSpeed = 1;
    this.JumpHeight = -25;
    this.MaxHealth = 100;
    this.MaxPos = 10000;

    this.MaxGunCooldown = 0;
    this.gunCooldown = 0;

    this.Accuracy = 5;
    this.Recoil = 0.5;

    this.health = this.MaxHealth;

    this.FloorBouce = -0.5;
    this.WallBouce = -0.5;

    this.radius = 10;

    this.Keys = {
      right_arrow: Keys.right_arrow,
      left_arrow: Keys.left_arrow,
      up_arrow: Keys.up_arrow,
      down_arrow: Keys.down_arrow,
    }
    this.AltKeys = {
      right_arrow: Keys.d,
      left_arrow: Keys.a,
      up_arrow: Keys.w,
      down_arrow: Keys.s,
    }
  }
  Draw(render, cam)
  {
    render.SetStroke(255, 255, 255, 1);
    render.render.lineWidth = this.radius;
    render.DrawRect(this.x - (this.w / 2) - cam.x, this.y  - (this.h / 2) - cam.y, this.x + (this.w / 2) - cam.x, this.y + (this.h /2) - cam.y);
    render.DrawRect((this.x - (this.w / 2)) / 40 + render.Width / 2, (this.y - (this.h / 2)) / 40 + 200, (this.x + (this.w / 2)) / 40 + render.Width / 2, (this.y + (this.h /2)) / 40 + 200);

    //var hpX = (Math.sin(GetDir(this.x, this.y, Mouse.x + cam.x, Mouse.y + cam.y) + DegreesToRadians(180)) * 100) + this.x;
    //var hpY = (Math.cos(GetDir(this.x, this.y, Mouse.x + cam.x, Mouse.y + cam.y) + DegreesToRadians(180)) * 90) + this.y;

    render.DrawBar(this.x - cam.x, this.y - (this.h / 1.5) - cam.y, 0, this.MaxHealth, this.health, 20, {fg: { r: 0, g: 200, b: 0 }, bg: { r: 200, g: 0, b: 0 }});
  }
  Update(platforms, particles, render, cam, game)
  {
    render.render.lineWidth = this.radius;
    this.Death();
    if(GetKeyState(this.Keys.right_arrow) || GetKeyState(this.AltKeys.right_arrow))
    {
      this.xv += this.MovementSpeed;
    }
    if(GetKeyState(this.Keys.left_arrow) || GetKeyState(this.AltKeys.left_arrow))
    {
      this.xv -= this.MovementSpeed;
    }
    this.xv /= this.Friction;
    this.x += this.xv * 60 * game.SafeDeltaTime;

    if(platforms.Collision(this.x + this.bbx - (this.bbw / 2), this.y + this.bby - (this.bbh / 2), this.bbw, this.bbh, render, cam))
    {
      this.x -= this.xv * 60 * game.SafeDeltaTime;
      this.xv *= this.WallBouce;
    }

    this.yv += this.Gravity;
    this.y += this.yv * 60 * game.SafeDeltaTime;

    if(platforms.Collision(this.x + this.bbx - (this.bbw / 2), this.y + this.bby - (this.bbh / 2), this.bbw, this.bbh, render, cam))
    {
      this.y -= this.yv * 60 * game.SafeDeltaTime;
      if(!(GetKeyState(this.Keys.up_arrow) || GetKeyState(this.AltKeys.up_arrow)))
      {
        this.yv *= this.FloorBouce;
      }
      else {
        this.yv = 0;
      }
      this.xv /= this.FloorFriction;
    }

    this.y ++;

    if(GetKeyState(this.Keys.up_arrow) || GetKeyState(this.AltKeys.up_arrow))
    {
      if(platforms.Collision(this.x + this.bbx - (this.bbw / 2), this.y + this.bby - (this.bbh / 2), this.bbw, this.bbh, render, cam))
      {
        this.yv = this.JumpHeight;
      }
    }

    this.y --;
    this.Shoot(platforms, particles, render, cam);
  }
  Death()
  {
    if(Math.abs(this.x) > this.MaxPos || Math.abs(this.y) > this.MaxPos)
    {
      location.reload();
    }
  }
  Shoot(platforms, particles, render, cam)
  {
    this.gunCooldown ++;
    this.gunCooldown = clamp(this.gunCooldown, 0, this.MaxGunCooldown)
    if(Mouse.held && this.gunCooldown == this.MaxGunCooldown)
    {
        var xDif = RandomFloat(-this.Recoil, this.Recoil);
        var yDif = RandomFloat(-this.Recoil, this.Recoil);
        var dir = RadiansToDegrees(GetDir(this.x, this.y, Mouse.x + cam.x, Mouse.y + cam.y) - DegreesToRadians(RandomFloat( -this.Accuracy, this.Accuracy ) + 90));
        var pos = RayCast(this.x + xDif, this.y + yDif, dir, platforms, 50, render, cam);
        render.SetStroke(255, 98, 0, 1);
        var oldWidth = render.render.lineWidth;
        render.render.lineWidth = 10;
        render.DrawLine(this.x + xDif - cam.x, this.y + yDif - cam.y, pos.x - cam.x, pos.y - cam.y);
        render.SetStroke(255, 230, 0, 1);
        render.render.lineWidth = 5;
        render.DrawLine(this.x + xDif - cam.x, this.y + yDif - cam.y, pos.x - cam.x, pos.y - cam.y);


        var recoilPos = MoveInDirection(this.x, this.y, dir, -this.Recoil);
        var oldPos = {x: this.x, y: this.y}
        this.xv += recoilPos.x - this.x;
        this.yv += recoilPos.y - this.y;

        if(pos.collision)
        {
          for(var i = 0; i < 4; i++)
          {
            var color = RandomInt(55, 155);
            var newPos = MoveInDirection(pos.x, pos.y, dir, -5);
            particles.Add(newPos.x + RandomFloat(-5,5), newPos.y + RandomFloat(-5,5), RandomInt(-10, 10), RandomInt(-10, 10), RandomInt(2, 10), {r: pos.color.r, g: pos.color.g, b: pos.color.b, a: 1}, "blood")
            particles.particles[particles.particles.length - 1].wallBouce = -2;
            particles.particles[particles.particles.length - 1].floorBouce = -5;
            particles.particles[particles.particles.length - 1].floorFriction = 2;
          }
        }

        this.gunCooldown = 0;
        render.render.lineWidth = oldWidth;
    }
  }
}
class ParticleArray
{
  constructor(particles)
  {
    this.particles = [];
    this.Count = 0;

    if(particles)
    {
      this.particles = particles;
      this.Count = particles.Count;
    }
  }
  Add(x, y, xv, yv, radius, color, type)
  {
    this.Count ++;
    this.particles.push(new Particle(x, y, xv, yv, radius, color, type));
  }
  Delete(index)
  {
    this.Count --;
    this.particles.splice(index, 1);
  }
  Draw(render, cam)
  {
    for(var i in this.particles)
    {
      this.particles[i].Draw(render, cam);
    }
  }
  Update(platforms, render, cam, game)
  {
    for(var i = this.particles.length - 1; i >= 0; i--)
    {
      if(this.particles[i].Update(platforms, render, cam, game))
      {
        this.particles.splice(i, 1);
      }
    }
  }
}
class Particle
{
  constructor(x, y, xv, yv, radius, color, type)
  {
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    this.radius = radius;
    this.color = color;
    this.type = type;

    this.friction = 1.01;
    this.floorFriction = 1.01;
    this.gravity = 0.8;
    this.smooth = false;
    this.wallBouce = -1.1;
    this.floorBouce = -1.1;
    this.maxPos = 10000;
  }
  Draw(render, cam)
  {
    render.SetStroke(this.color.r, this.color.g, this.color.b, this.color.a);
    render.SetFill(this.color.r, this.color.g, this.color.b, this.color.a);
    render.render.lineWidth = this.radius * 2;
    if(this.smooth)
    {
      render.DrawLine(this.x - cam.x, this.y - cam.y, (this.x + this.xv) - cam.x, (this.y + this.yv) - cam.y);
    }
    else {
      render.DrawFillCircleNoStroke(this.x - cam.x, this.y - cam.y, this.radius);
    }
  }
  Update(platforms, render, cam, game)
  {
    if(Math.abs(this.x) > this.maxPos || Math.abs(this.y) > this.maxPos)
    {
      return true;
    }
    if(this.type == "blood")
    {
      if(round(this.xv, 1) == 0 && round(this.yv, 1) == 0)
      {
        if(this.color.a < 0)
        {
          return true;
        }
        else {
          this.color.a -= 0.1;
          this.radius -= this.radius * 0.1;
        }
      }
    }

    this.xv /= this.friction;
    this.x += this.xv * 60 * game.SafeDeltaTime;

    //if(platforms.Collision(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2, render, cam))
    if(false)
    {
      this.x -= this.xv * 60 * game.SafeDeltaTime;
      this.xv /= this.wallBouce;
    }

    this.yv += this.gravity;
    this.y += this.yv * 60 * game.SafeDeltaTime;

    //if(platforms.Collision(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2, render, cam))
    if(false)
    {
      this.y -= this.yv * 60 * game.SafeDeltaTime;
      this.yv /= this.floorBouce;
      this.xv /= this.floorFriction;
    }
  }
}
class Platform
{
  constructor(x1, y1, x2, y2, type)
  {
    var vals = this.SortVals(x1, y1, x2, y2);
    this.x1 = vals.x1;
    this.y1 = vals.y1;
    this.x2 = vals.x2;
    this.y2 = vals.y2;

    this.type = type;
  }
  Draw(render, cam)
  {
    if(this.x1 - cam.x <= render.Width && this.x2 - cam.x >= 0 && this.y1 - cam.y <= render.Height && this.y2 - cam.y >= 0)
    {
        render.SetFill(0, 0, 0, 1);
        render.render.lineWidth = 10;
        if(this.type == 1)
        {
          render.SetStroke(255, 255, 255, 1);
          render.DrawFillRect(this.x1 - cam.x, this.y1 - cam.y, this.x2 - cam.x, this.y2 - cam.y);
        }
        else if(this.type == 2 || this.type == 3 || this.type == 4 || this.type == 5)
        {
          render.SetFill(66 - (this.type * 25), 212 - (this.type * 25), 245 - (this.type * 25), 1);
          render.SetStroke(66 - (this.type * 25), 212 - (this.type * 25), 245 - (this.type * 25), 0);
          render.render.lineWidth = 5;
          render.DrawFillRectNoStroke(this.x1 - cam.x, this.y1 - cam.y, this.x2 - cam.x, this.y2 - cam.y);
        }
    }
  }
  DrawMap(render, cam)
  {
    render.SetFill(0, 0, 0, 1);
    render.render.lineWidth = 1;
    if(this.type == 1)
    {
      render.SetStroke(255, 255, 255, 1);
    }
    else if(this.type == 2 || this.type == 3 || this.type == 4 || this.type == 5)
    {
      render.SetFill(66 - (this.type * 15), 212 - (this.type * 15), 245 - (this.type * 15), 1);
      render.SetStroke(66 - (this.type * 15), 212 - (this.type * 15), 245 - (this.type * 15), 1);
    }
    render.DrawFillRect(this.x1 / 40 + render.Width / 2, this.y1 / 40 + 200, this.x2 / 40 + render.Width / 2, this.y2 / 40 + 200);
  }
  Collision(x, y, w, h, render, cam = {x: 0, y: 0}, hitbox = false)
  {
    return Collision(x, y, w, h, this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1, render, cam, hitbox)
  }
  SortVals(x1, y1, x2, y2)
  {
    var vals = {x1: x1, y1: y1, x2: x2, y2: y2};

    if(y1 > y2)
    {
      vals.y1 = y2;
      vals.y2 = y1;
    }
    if(x1 > x2)
    {
      vals.x1 = x2;
      vals.x2 = x1;
    }

    return vals;
  }
}
class Dummy
{
  constructor(x, y, w, h, bbx, bby, bbw, bbh)
  {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.bbx = bbx;
    this.bby = bby;
    this.bbw = bbw;
    this.bbh = bbh;

    this.radius = 50;
  }
  Draw(render, cam)
  {
    render.SetStroke(255, 255, 255, 1);
    render.render.lineWidth = this.radius;
    render.DrawLine(this.x - cam.x, this.y - cam.y, this.x + this.w - cam.x, this.y + this.h - cam.y)
  }
  Fall(platforms, render, cam)
  {
    var pos = RayCast(this.x, this.y, 270, platforms, 50, render, cam);
    this.x = pos.x;
    this.y = pos.y - (this.h + (this.radius / 2));
  }
}
class PlatformArray
{
  constructor(platforms)
  {
    this.platforms = [];
    this.Count = 0;
    this.Scale = 1;
    this.inverted = 1;

    if(platforms)
    {
      this.platforms = platforms;
      this.Count = platforms.Count;
    }
  }

  Add(x1, y1, x2, y2, type)
  {
    this.Count ++;
    this.platforms.push(new Platform(x1 * this.Scale, (y1 * this.inverted) * this.Scale, x2 * this.Scale, (y2 * this.inverted) * this.Scale, type));
  }
  Delete(index) {
    this.platforms.splice(index, 1);
    this.Count --;
  }
  Clear() {
    this.platforms = [];
    this.Count = 0;
  }
  Draw(render, cam) {
    for(var i in this.platforms) {
      this.platforms[i].Draw(render, cam);
    }
    for(var i in this.platforms) {
      this.platforms[i].DrawMap(render, cam);
    }
  }
  Collision(x, y, w, h, render, cam = {x: 0, y: 0}, hitbox = false)
  {
    for(var i in this.platforms)
    {
      render.lineWidth = 10;
      if(this.platforms[i].Collision(x, y, w, h, render, cam, hitbox))
      {
        return true;
      }
    }
    return false;
  }
  SetScale(scale) {
    this.Scale = scale;
  }
  Invert() {
    this.inverted = -1 * this.inverted;
  }
}
