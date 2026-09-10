"""Render letter sprites with ordinary typography and pixel-based material shading. No AI."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import json,base64,io
ROOT=Path(__file__).resolve().parents[1]
styles=[('chrome','liquid chrome','audiowide',0),('glass','blue glass','audiowide',0),('titanium','titanium wide','michroma',0),('holo','violet metal','michroma',.18)]
catalog={c:[] for c in 'onder'}; previews=[]
for style,label,font,shear in styles:
 for char in 'onder':
  f=ImageFont.truetype(str(ROOT/'assets/y2k-fonts'/f'{font}.ttf'),220)
  box=f.getbbox(char);m=Image.new('L',(box[2]-box[0]+70,box[3]-box[1]+70));ImageDraw.Draw(m).text((35-box[0],35-box[1]),char,font=f,fill=255)
  # Distance from outline builds a rounded bevel and its lighting normals.
  a=np.asarray(m,dtype=float)/255;dist=np.zeros_like(a);eroded=m
  for j in range(22):
   dist+=np.asarray(eroded,dtype=float)/255;eroded=eroded.filter(ImageFilter.MinFilter(3))
  height=np.sin(np.minimum(dist/20,1)*np.pi/2)*12
  gy,gx=np.gradient(height);normal=np.stack([-gx,-gy,np.ones_like(gx)],axis=2);normal/=np.linalg.norm(normal,axis=2)[:,:,None]
  nx,ny,nz=[normal[:,:,i] for i in range(3)];y,x=np.indices(a.shape);v=y/a.shape[0]
  light=np.maximum(0,-nx*.45-ny*.65+nz*.62)
  spec=np.maximum(0,-nx*.25-ny*.62+nz*.74)**30
  reflection=np.clip(.5+ny*.46+(v-.5)*.26,0,1)
  if style in ['chrome','titanium','holo']:
   stops=[0,.22,.4,.47,.49,.57,.7,1];values=[.12,.85,1,.92,.035,.10,.72,.94]
   metal=np.interp(reflection,stops,values)
   rgb=np.stack([metal*.90,metal*.97,metal],axis=2)
   if style=='titanium':rgb=rgb*.72+.12
   if style=='holo':
    tint=np.stack([.8+.2*np.sin(v*12),.65+.3*np.cos(v*10),np.ones_like(v)],axis=2);rgb*=tint
   rgb+=spec[:,:,None]*.75
  else:
   rgb=np.stack([.01+.08*light,.15+.45*light,.35+.55*light],axis=2)
   gloss=np.exp(-((v-.28)/.105)**2)*.36
   rgb+=gloss[:,:,None]*np.array([.8,.95,1])+spec[:,:,None]*.9
   rgb+=((1-nz)*.5)[:,:,None]*np.array([.08,.4,.6])
  # A small solid extrusion gives the sprite actual visible depth.
  face=Image.fromarray(np.uint8(np.clip(rgb,0,1)*255),'RGB').convert('RGBA');face.putalpha(m)
  out=Image.new('RGBA',m.size)
  for dx,dy in [(7,8),(6,7),(5,6),(4,5),(3,4),(2,3),(1,2)]:
   side=Image.new('RGBA',m.size,(15,28,48,255));side.putalpha(m);out.alpha_composite(side,(dx,dy))
  out.alpha_composite(face)
  if shear:
   out=out.transform((out.width+int(out.height*shear),out.height),Image.Transform.AFFINE,(1,shear,-out.height*shear,0,1,0),Image.Resampling.BICUBIC)
  out=out.crop(out.getbbox());out.thumbnail((190,190),Image.Resampling.LANCZOS)
  b=io.BytesIO();out.save(b,format='PNG',optimize=True)
  catalog[char].append({'id':f'Y2K_{style.upper()}_{char.upper()}','label':label,'category':'y2k','src':'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()})
  previews.append(out)
(ROOT/'assets/y2k-letter-catalog.js').write_text('window.y2kLetterCatalog = '+json.dumps(catalog,separators=(',',':'))+';\n')
sheet=Image.new('RGB',(650,400),'#777');d=ImageDraw.Draw(sheet)
for i,im in enumerate(previews):
 im=im.copy();im.thumbnail((105,76));x=i%5*130;y=i//5*100;sheet.paste(im,(x,y),im);d.text((x,y+80),styles[i//5][1],fill='white')
sheet.save('/tmp/y2k-preview.png')
print('Rendered 20 new sprites')
