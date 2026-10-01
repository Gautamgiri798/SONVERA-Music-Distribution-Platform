import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeAudioRibbonCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Camera set higher and looking downward toward the lower horizon
    camera.position.set(0, 4, 75);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Mouse Tracking for Parallax & Wave Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 3. Ultra-Fine Glowing Fiber-Optic Sound Ribbon (26 Parallel Filaments)
    // Positioned gracefully across the lower-third so it frames the visual cleanly
    const lineCount = 24;
    const pointsPerLine = 140;
    const xSpan = 150;
    const xStart = -xSpan * 0.52;
    const xStep = xSpan / (pointsPerLine - 1);

    const colorPalette = [
      new THREE.Color('#7C3AED'), // Deep Violet
      new THREE.Color('#9333EA'), // Purple
      new THREE.Color('#C084FC'), // Light Purple
      new THREE.Color('#E879F9'), // Fuchsia
      new THREE.Color('#EC4899'), // Magenta
      new THREE.Color('#38BDF8'), // Electric Cyan
    ];

    const lines: {
      line: THREE.Line;
      geometry: THREE.BufferGeometry;
      positions: Float32Array;
      lineIndex: number;
    }[] = [];

    for (let l = 0; l < lineCount; l++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(pointsPerLine * 3);
      const colors = new Float32Array(pointsPerLine * 3);

      // Color interpolation along length and strand
      const strandFactor = l / (lineCount - 1);
      for (let p = 0; p < pointsPerLine; p++) {
        const t = p / (pointsPerLine - 1);
        const col = new THREE.Color();

        if (t < 0.35) {
          col.lerpColors(colorPalette[0], colorPalette[1], t / 0.35);
        } else if (t < 0.7) {
          col.lerpColors(colorPalette[2], colorPalette[4], (t - 0.35) / 0.35);
        } else {
          col.lerpColors(colorPalette[4], colorPalette[5], (t - 0.7) / 0.3);
        }

        // Taper opacity/brightness at ends
        const envelope = Math.sin(t * Math.PI);
        const brightness = (0.35 + envelope * 0.65) * (0.6 + strandFactor * 0.4);

        colors[p * 3] = col.r * brightness;
        colors[p * 3 + 1] = col.g * brightness;
        colors[p * 3 + 2] = col.b * brightness;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.52,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);

      lines.push({ line, geometry, positions, lineIndex: l });
    }

    // 4. Subtle, Delicate Ambient Background Bokeh
    const bokehCount = 30;
    const bokehGeometry = new THREE.BufferGeometry();
    const bokehPositions = new Float32Array(bokehCount * 3);
    const bokehColors = new Float32Array(bokehCount * 3);
    const bokehData: { x: number; y: number; z: number; speed: number; phase: number }[] = [];

    const bColorViolet = new THREE.Color('#9333EA');
    const bColorCyan = new THREE.Color('#38BDF8');

    for (let i = 0; i < bokehCount; i++) {
      const x = (Math.random() - 0.5) * 120;
      const y = -22 + (Math.random() - 0.5) * 20;
      const z = -20 + (Math.random() - 0.5) * 30;

      bokehPositions[i * 3] = x;
      bokehPositions[i * 3 + 1] = y;
      bokehPositions[i * 3 + 2] = z;

      bokehData.push({
        x,
        y,
        z,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });

      const c = Math.random() < 0.6 ? bColorViolet : bColorCyan;
      bokehColors[i * 3] = c.r;
      bokehColors[i * 3 + 1] = c.g;
      bokehColors[i * 3 + 2] = c.b;
    }

    bokehGeometry.setAttribute('position', new THREE.BufferAttribute(bokehPositions, 3));
    bokehGeometry.setAttribute('color', new THREE.BufferAttribute(bokehColors, 3));

    // Smooth circular radial texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.4)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const bokehTexture = new THREE.CanvasTexture(canvas);

    const bokehMaterial = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      map: bokehTexture,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const bokeh = new THREE.Points(bokehGeometry, bokehMaterial);
    scene.add(bokeh);

    // 5. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Subtle 3D camera drift looking toward the lower horizon
      camera.position.x = mouseX * 2.5;
      camera.position.y = 4 - mouseY * 1.8;
      camera.lookAt(0, -12, 0);

      // Animate Filaments in lower tier
      lines.forEach(({ geometry, positions, lineIndex }) => {
        const strandOffset = lineIndex * 0.08;
        const baseY = -22 + (lineIndex - lineCount / 2) * 0.24;

        for (let p = 0; p < pointsPerLine; p++) {
          const x = xStart + p * xStep;
          const t = p / (pointsPerLine - 1);

          // Smooth bell envelope
          const envelope = Math.pow(Math.sin(t * Math.PI), 1.5);

          // Harmonic waves placed in lower section
          const w1 = Math.sin(x * 0.08 + elapsedTime * 1.2 + strandOffset) * 3.4;
          const w2 = Math.cos(x * 0.04 - elapsedTime * 0.7 + strandOffset * 1.5) * 2.2;
          const mouseRipple = Math.sin(x * 0.05 + mouseX * 2.0) * 0.8;

          const y = baseY + (w1 + w2 + mouseRipple) * envelope;
          const z = (lineIndex - lineCount / 2) * 0.4 + Math.sin(x * 0.03 + elapsedTime * 0.6) * 3;

          positions[p * 3] = x;
          positions[p * 3 + 1] = y;
          positions[p * 3 + 2] = z;
        }

        (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      });

      // Animate Subtle Bokeh
      const bPos = bokehGeometry.attributes.position as THREE.BufferAttribute;
      const bArr = bPos.array as Float32Array;
      for (let i = 0; i < bokehCount; i++) {
        const d = bokehData[i];
        bArr[i * 3 + 1] = d.y + Math.sin(elapsedTime * d.speed + d.phase) * 2.5;
        bArr[i * 3] = d.x + Math.cos(elapsedTime * (d.speed * 0.6) + d.phase) * 1.5;
      }
      bPos.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      lines.forEach(({ geometry, line }) => {
        geometry.dispose();
        (line.material as THREE.Material).dispose();
      });

      bokehGeometry.dispose();
      bokehMaterial.dispose();
      bokehTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      style={{
        mixBlendMode: 'screen',
      }}
    />
  );
};
