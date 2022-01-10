var segments = 1;
function CreateElement(type, attributes, path)
{
  const parent = document.querySelector(path);
  const el = document.createElement(type);
  for(var attribute in attributes)
  {
    el.setAttribute(attribute, attributes[attribute]);
  }
  parent.appendChild(el);
  return "#" + attributes["id"];
}

function min(a,b) { return (a < b)? a : b; }
function max(a,b) { return (a > b)? a : b; }
function clamp(val, minV, maxV) { return max(min(val, maxV), minV); }
function RandomInt(min, max) { return Math.round(Math.random() * (max - min) + min); }
function RandomFloat(min, max) { return Math.random() * (max - min) + min; }
function Dist(x1, y1, x2, y2)
{
  var dx = x2 - x1;
  var dy = y2 - y1;
  var dist = Math.sqrt((dx*dx) + (dy*dy));
  return dist;
}
function DegreesToRadians(degrees) {
  return degrees / 180 * Math.PI;
}
function RadiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}
function ReplaceInnerHTML(id, innerHTML)
{
  document.querySelector(id).innerHTML = innerHTML;
}
function MoveInDirection(x, y, dir, length)
{
  var pos = {x: x, y: y};
  pos.x += (Math.cos(DegreesToRadians(dir + 45)) + Math.sin(DegreesToRadians(dir + 45))) * length;
  pos.y += (Math.cos(DegreesToRadians(dir + 45)) - Math.sin(DegreesToRadians(dir + 45))) * length;
  return pos;
}
function GetDir(x1, y1, x2, y2) {
  var x = x2 - x1;
  var y = y2 - y1;
  var dir;
  if(y == 0) {
    if(x > 0) {
      dir = DegreesToRadians(90);
    }
    else {
      dir = DegreesToRadians(-90);
    }
  }
  else {
    dir = Math.atan(x / y);
    if(y < 0) {
      if(x > 0) {
        dir += DegreesToRadians(180);
      }
      else if(x < 0) {
        dir -= DegreesToRadians(180);
      }
      else {
        dir = DegreesToRadians(180);
      }
    }
  }
  return dir;
}
function round(val, dec)
{
  return Math.round(val * dec) / dec;
}

function Collision(x, y, w, h, x2, y2, w2, h2, render, cam = {x: 0, y: 0}, hitbox = false)
{
  if(hitbox)
  {
    render.SetStroke(0, 0, 255, 1);
    render.DrawRect(x - cam.x, y - cam.y, x + w - cam.x, y + h - cam.y);
    render.DrawRect(x2 - cam.x, y2 - cam.y, x2 + w2 - cam.x, y2 + h2 - cam.y);
  }

  if(x - render.render.lineWidth < x2 + w2)
  {
    if(x + w + render.render.lineWidth > x2)
    {
      if(y - render.render.lineWidth < y2 + h2)
      {
        if(y + h + render.render.lineWidth > y2)
        {
          return true;
        }
      }
    }
  }
  return false;
}
function CircleOnRectCollision(render, cx, cy, cr, rx, ry, rw, rh)
{
  var x = cx;
  var y = cy;

  if (cx < rx)         x = rx;
  else if (cx > rx+rw) x = rx+rw;
  if (cy < ry)         y = ry;
  else if (cy > ry+rh) y = ry+rh;

  var distance = Dist(cx, cy, x, y);

  render.SetStroke(255, 0, 0, 1);
  render.DrawLine(cx, cy, x, y);
  render.DrawCircle(cx, cy, cr);

  if (distance <= cr) {
    render.SetStroke(0, 255, 0, 1);
    render.DrawCircle(cx, cy, cr);
    return true;
  }
}
function DistToRect(x, y, platform) {
  var dx = Math.max(platform.x1 - x, 0, x - platform.x2);
  var dy = Math.max(platform.y1 - y, 0, y - platform.y2);
  return Math.sqrt(dx*dx + dy*dy);
}
function SnapToGrid(val, snap)
{
  return Math.round(val / snap) * snap
}
function FindMinDist(x, y, platforms)
{
  var min_index = 0;
  var min_dist = DistToRect(x, y, platforms.platforms[0]);
  for(var i = 1; i < platforms.platforms.length; i++)
  {
    var dist = DistToRect(x, y, platforms.platforms[i]);
    if(dist < min_dist)
    {
      min_dist = dist;
      min_index = i;
    }
  }

  return {minD: min_dist, minI: min_index};
}

function RayCast(x, y, dir, platforms, maxI, render, cam)
{
  var i = 0;
  var rx = x;
  var ry = y;
  var collision = false;
  var platformColor = {type: 0};
  // && rx - cam.x < render.Width && rx - cam.x > 0 && ry - cam.y < render.Height && ry - cam.y > 0
  while(i < maxI && collision != true && rx - cam.x < 10000 && rx - cam.x > -10000 && ry - cam.y < 10000 && ry - cam.y > -10000)
  {
    var dist = FindMinDist(rx, ry, platforms);
    //render.SetFill(255, 255, 255, 0.5);

    //render.DrawFillCircleNoStroke(rx - cam.x, ry - cam.y, dist.minD);

    if(dist.minD < 1.5)
    {
      platformColor = platforms.platforms[dist.minI];
      collision = true;
      if(platforms.platforms[dist.minI].type >= 2 && platforms.platforms[dist.minI].type <= 4) {
        var platform = platforms.platforms[dist.minI];
        var plat = new Platform(platform.x1 / platforms.Scale, platform.y1 / platforms.Scale * platforms.inverted, platform.x2 / platforms.Scale, platform.y2 / platforms.Scale * platforms.inverted, platform.type);
        var w = plat.x2 - plat.x1;
        var h = plat.y2 - plat.y1;
		segments = RandomInt(2, 2);
		console.log(segments);
        var cols = RandomInt(2, 2)
        var rows = RandomInt(2, 2)
        platforms.platforms.splice(dist.minI, 1);

        for(var y = plat.y1; y <= plat.y2 - h / rows; y += h / rows)
        {
          for(var x = plat.x1; x <= plat.x2 - w / cols; x += w / cols)
          {
            platforms.Add(x, y, x + w / cols, y + h / rows, plat.type + 1);
          }
        }
      }
      else if(platforms.platforms[dist.minI].type == 5)
      {
        platforms.platforms.splice(dist.minI, 1);
      }
      break;
    }

    //render.SetFill(255, 0, 0, 1);
    //render.DrawFillCircleNoStroke(rx - cam.x, ry - cam.y, 5);

    var newPos = MoveInDirection(rx, ry, dir, dist.minD / 1.42);
    rx = newPos.x;
    ry = newPos.y;

    //render.SetFill(255, 0, 0, 1);
    //render.DrawFillCircleNoStroke(rx - cam.x, ry - cam.y, 5);
    i++;
  }

  return {x: rx, y: ry, i: i, collision: collision, color: FindColor(platformColor)};
}

function FindColor(platform)
{
  var platform = platform;
  var plat = 0;
  if(platform != undefined)
  {
    plat = platform.type;
  }
  var color = {r: 255, g: 255, b: 255}

  if(plat == 2 || plat == 3 || plat == 4 || plat == 5)
  {
    color.r = 66 - (plat * 15);
    color.g = 212 - (plat * 15);
    color.b = 245 - (plat * 15);
  }

  return color;
}
