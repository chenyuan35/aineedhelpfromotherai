export const imageTools = [
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize JPG, PNG and WebP images to exact pixel dimensions directly in your browser, with optional aspect-ratio locking.',
    eyebrow: 'Image tool',
    intro: 'Resize an image to exact width and height without uploading it to a server.',
    body: `
      <section class="calculator-card calculator-wide">
        <div class="input-row"><label>Choose image<input id="file" type="file" accept="image/jpeg,image/png,image/webp"></label></div>
        <div class="input-row"><label>Width (px)<input id="w" inputmode="numeric" type="number" min="1" placeholder="1200"></label><label>Height (px)<input id="h" inputmode="numeric" type="number" min="1" placeholder="630"></label></div>
        <label class="check"><input id="lock" type="checkbox" checked> Keep aspect ratio</label>
        <div class="input-row"><button type="button" onclick="preset(1080,1080)">1080×1080</button><button type="button" onclick="preset(1200,630)">1200×630</button><button type="button" onclick="preset(1920,1080)">1920×1080</button></div>
        <button type="button" onclick="go()">Resize image</button>
        <div class="result" id="out" aria-live="polite">Choose an image to begin</div><div class="result-details" id="details"></div>
        <a id="download" class="text-link" hidden>Download resized image</a>
      </section>`,
    script: `
      let img=null,source=null,ratio=1,last='';
      file.addEventListener('change',async()=>{const f=file.files[0];if(!f)return;if(source)URL.revokeObjectURL(source);source=URL.createObjectURL(f);img=new Image();img.onload=()=>{ratio=img.naturalWidth/img.naturalHeight;w.value=img.naturalWidth;h.value=img.naturalHeight;out.textContent=img.naturalWidth+' × '+img.naturalHeight+' px';details.textContent=(f.size/1024).toFixed(1)+' KB · '+(f.type||'image');};img.src=source});
      w.addEventListener('input',()=>{if(lock.checked&&img&&Number(w.value)>0)h.value=Math.max(1,Math.round(Number(w.value)/ratio))});
      h.addEventListener('input',()=>{if(lock.checked&&img&&Number(h.value)>0)w.value=Math.max(1,Math.round(Number(h.value)*ratio))});
      function preset(a,b){w.value=a;h.value=b;lock.checked=false}
      function go(){if(!img){out.textContent='Choose an image first';return}const W=Math.round(Number(w.value)),H=Math.round(Number(h.value));if(!W||!H||W<1||H<1){out.textContent='Enter valid dimensions';return}if(W*H>50000000){out.textContent='Output is too large (max 50 megapixels)';return}const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(img,0,0,W,H);const type=file.files[0].type==='image/png'?'image/png':file.files[0].type==='image/webp'?'image/webp':'image/jpeg';c.toBlob(blob=>{if(!blob){out.textContent='Could not create image';return}if(last)URL.revokeObjectURL(last);last=URL.createObjectURL(blob);download.href=last;download.download='resized-'+W+'x'+H+'.'+(type==='image/png'?'png':type==='image/webp'?'webp':'jpg');download.hidden=false;out.textContent=W+' × '+H+' px';details.textContent=(blob.size/1024).toFixed(1)+' KB · processed locally';},type,.92)}
    `,
    sections: [
      ['How image resizing works', `<p>Resizing changes the pixel dimensions of an image. Smaller dimensions reduce the number of pixels, which usually reduces file size as well. This tool uses the browser canvas and keeps the selected image on your device.</p>`],
      ['Keep aspect ratio to avoid stretching', `<p>If aspect ratio is locked, changing one dimension automatically adjusts the other. Unlock it only when you intentionally need exact dimensions such as 1200×630 or 1080×1080.</p>`],
      ['Common image sizes', `<p>Square images such as 1080×1080 are common for social posts. 1200×630 is widely used for link preview images. 1920×1080 is standard Full HD. Always verify the latest requirements of the site where you plan to upload the image.</p>`]
    ],
    faqs: [
      ['Are my images uploaded?', 'No. The current resizer processes supported images locally in your browser.'],
      ['What formats are supported?', 'JPG, PNG and WebP are supported by modern browsers.'],
      ['Will resizing reduce image quality?', 'Downscaling normally preserves good visual quality. Enlarging an image cannot create missing detail.'],
      ['Why should I keep the aspect ratio locked?', 'It prevents the image from looking stretched or squashed when you change its size.']
    ],
    related: ['image-compressor','percentage-calculator','date-difference-calculator']
  },
  {
    slug: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress JPG, PNG and WebP images in your browser with adjustable quality, optional resizing and no server upload.',
    eyebrow: 'Image tool',
    intro: 'Reduce image file size with a quality slider and optional maximum width.',
    body: `
      <section class="calculator-card calculator-wide">
        <div class="input-row"><label>Choose image<input id="file" type="file" accept="image/jpeg,image/png,image/webp"></label></div>
        <div class="input-row"><label>Quality <span id="qv" class="muted">80%</span><input id="quality" type="range" min="20" max="100" value="80"></label><label>Max width (px) <span class="muted">optional</span><input id="maxw" inputmode="numeric" type="number" min="1" placeholder="Keep original"></label><label>Output format<select id="format"><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option><option value="image/png">PNG</option></select></label></div>
        <button type="button" onclick="go()">Compress image</button>
        <div class="result" id="out" aria-live="polite">Choose an image to begin</div><div class="result-details" id="details"></div>
        <a id="download" class="text-link" hidden>Download compressed image</a>
      </section>`,
    script: `
      let img=null,source=null,last='',original=0;quality.addEventListener('input',()=>qv.textContent=quality.value+'%');
      file.addEventListener('change',()=>{const f=file.files[0];if(!f)return;original=f.size;if(source)URL.revokeObjectURL(source);source=URL.createObjectURL(f);img=new Image();img.onload=()=>{out.textContent=(original/1024).toFixed(1)+' KB original';details.textContent=img.naturalWidth+' × '+img.naturalHeight+' px';format.value=f.type==='image/png'?'image/png':f.type==='image/webp'?'image/webp':'image/jpeg'};img.src=source});
      function go(){if(!img){out.textContent='Choose an image first';return}let W=img.naturalWidth,H=img.naturalHeight,m=Number(maxw.value);if(m>0&&W>m){H=Math.max(1,Math.round(H*m/W));W=Math.round(m)}if(W*H>50000000){out.textContent='Image is too large to process safely';return}const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');if(format.value==='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,W,H)}x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(img,0,0,W,H);const q=Number(quality.value)/100;c.toBlob(blob=>{if(!blob){out.textContent='Could not create image';return}if(last)URL.revokeObjectURL(last);last=URL.createObjectURL(blob);download.href=last;const ext=format.value==='image/webp'?'webp':format.value==='image/png'?'png':'jpg';download.download='compressed-image.'+ext;download.hidden=false;const pct=original?Math.round((1-blob.size/original)*100):0;out.textContent=(blob.size/1024).toFixed(1)+' KB';details.textContent=(pct>=0?pct+'% smaller':Math.abs(pct)+'% larger')+' · '+W+' × '+H+' px · processed locally';},format.value,q)}
    `,
    sections: [
      ['How browser image compression works', `<p>JPEG and WebP support adjustable lossy quality. Lower quality generally produces a smaller file. PNG is lossless in the browser canvas, so converting a photographic PNG to WebP or JPG often saves much more space than keeping PNG.</p>`],
      ['Resize before compressing', `<p>Pixel dimensions often matter more than the quality slider. A 4000-pixel photo used at 1200 pixels wastes file size. Set a maximum width when you know the image will never be displayed larger.</p>`],
      ['Privacy and limits', `<p>The selected file stays in your browser for processing. Very large images can use substantial device memory, so this tool limits output processing to about 50 megapixels.</p>`]
    ],
    faqs: [
      ['Are images uploaded to a server?', 'No. Supported images are decoded and compressed in your browser.'],
      ['Which output format is smallest?', 'WebP often gives a strong size-to-quality tradeoff for web use. JPG is widely compatible. PNG is best when lossless transparency is required.'],
      ['Why did my PNG get larger?', 'The browser PNG encoder is lossless and does not use the quality slider. Try WebP or JPG for photographic images.'],
      ['What quality should I use?', 'Around 75–85% is a practical starting range for JPG or WebP, then compare the result visually.']
    ],
    related: ['image-resizer','discount-calculator','percentage-calculator']
  }
];
