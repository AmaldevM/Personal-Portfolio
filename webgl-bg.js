// WebGL Red Particle Field - Mouse-reactive glowing particles
(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'webgl-particle-bg';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.5;';
    document.body.insertBefore(canvas, document.body.firstChild);
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) { canvas.remove(); return; }
    const vs = `attribute vec2 a_pos;attribute float a_sz;attribute float a_al;uniform vec2 u_res;uniform vec2 u_mouse;uniform float u_time;varying float v_al;void main(){vec2 diff=a_pos-u_mouse;float d=length(diff);float rp=smoothstep(0.0,0.18,d);vec2 p=a_pos+(normalize(diff+0.0001)*(1.0-rp)*0.025*u_res.x);vec2 c=(p/u_res)*2.0-1.0;c.y=-c.y;gl_Position=vec4(c,0.0,1.0);gl_PointSize=a_sz*(0.8+0.2*sin(u_time*1.8+a_al*6.28));v_al=a_al;}`;
    const fs = `precision mediump float;varying float v_al;uniform vec3 u_col;void main(){vec2 cxy=2.0*gl_PointCoord-1.0;float r=dot(cxy,cxy);if(r>1.0)discard;float alpha=(1.0-sqrt(r))*v_al;gl_FragColor=vec4(u_col,alpha);}`;
    function mkShader(t,s){const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);return sh;}
    const prog=gl.createProgram();
    gl.attachShader(prog,mkShader(gl.VERTEX_SHADER,vs));
    gl.attachShader(prog,mkShader(gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){canvas.remove();return;}
    gl.useProgram(prog);
    const aPos=gl.getAttribLocation(prog,'a_pos'),aSz=gl.getAttribLocation(prog,'a_sz'),aAl=gl.getAttribLocation(prog,'a_al');
    const uRes=gl.getUniformLocation(prog,'u_res'),uMouse=gl.getUniformLocation(prog,'u_mouse'),uTime=gl.getUniformLocation(prog,'u_time'),uCol=gl.getUniformLocation(prog,'u_col');
    const N=150;
    const pos=new Float32Array(N*2),vel=new Float32Array(N*2),sz=new Float32Array(N),al=new Float32Array(N);
    let W=0,H=0,mx=0,my=0;
    function resize(){const dpr=Math.min(devicePixelRatio||1,2);W=canvas.width=innerWidth*dpr;H=canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';gl.viewport(0,0,W,H);mx=W/2;my=H/2;}
    function init(){for(let i=0;i<N;i++){pos[i*2]=Math.random()*W;pos[i*2+1]=Math.random()*H;vel[i*2]=(Math.random()-0.5)*0.5;vel[i*2+1]=(Math.random()-0.5)*0.5;sz[i]=Math.random()*3.5+1.5;al[i]=Math.random()*0.55+0.15;}}
    window.addEventListener('resize',()=>{resize();init();});
    resize();init();
    window.addEventListener('mousemove',e=>{const dpr=Math.min(devicePixelRatio||1,2);mx=e.clientX*dpr;my=e.clientY*dpr;});
    const pbuf=gl.createBuffer(),sbuf=gl.createBuffer(),abuf=gl.createBuffer();
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    const t0=Date.now();
    function draw(){
        const t=(Date.now()-t0)/1000;
        for(let i=0;i<N;i++){pos[i*2]+=vel[i*2];pos[i*2+1]+=vel[i*2+1];if(pos[i*2]<0)pos[i*2]=W;if(pos[i*2]>W)pos[i*2]=0;if(pos[i*2+1]<0)pos[i*2+1]=H;if(pos[i*2+1]>H)pos[i*2+1]=0;}
        gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uRes,W,H);gl.uniform2f(uMouse,mx,my);gl.uniform1f(uTime,t);gl.uniform3f(uCol,0.882,0.024,0.0);
        gl.bindBuffer(gl.ARRAY_BUFFER,pbuf);gl.bufferData(gl.ARRAY_BUFFER,pos,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(aPos);gl.vertexAttribPointer(aPos,2,gl.FLOAT,false,0,0);
        gl.bindBuffer(gl.ARRAY_BUFFER,sbuf);gl.bufferData(gl.ARRAY_BUFFER,sz,gl.STATIC_DRAW);gl.enableVertexAttribArray(aSz);gl.vertexAttribPointer(aSz,1,gl.FLOAT,false,0,0);
        gl.bindBuffer(gl.ARRAY_BUFFER,abuf);gl.bufferData(gl.ARRAY_BUFFER,al,gl.STATIC_DRAW);gl.enableVertexAttribArray(aAl);gl.vertexAttribPointer(aAl,1,gl.FLOAT,false,0,0);
        gl.drawArrays(gl.POINTS,0,N);
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
})();
