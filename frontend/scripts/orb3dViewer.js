function initORB3D(containerId = "sphere-container") {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === "undefined") return;

    container.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.id = "orbCanvas";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const sphereGeom = new THREE.SphereGeometry(1, 32, 16);
    const posAttr = sphereGeom.attributes.position;
    const basePos = new Float32Array(posAttr.array);
    const vel = new Float32Array(posAttr.count * 3);

    const pointsMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.035,
        transparent: true,
        opacity: 0.98
    });
    const pointsMesh = new THREE.Points(sphereGeom, pointsMat);
    scene.add(pointsMesh);

    let wireMesh;
    function buildWire() {
        if (wireMesh) {
            wireMesh.geometry.dispose();
            scene.remove(wireMesh);
        }

        const wireGeom = new THREE.WireframeGeometry(sphereGeom);
        const wireMat = new THREE.LineBasicMaterial({
            color: 0xd8d8d8,
            transparent: true,
            opacity: 0.58
        });
        wireMesh = new THREE.LineSegments(wireGeom, wireMat);
        scene.add(wireMesh);
    }
    buildWire();

    let dragging = false;
    let sx = 0;
    let sy = 0;
    let rotX = 0;
    let rotY = 0;
    const K = 0.005;
    const DAMP = 0.92;
    const NOISE = 0.0045;

    function onPointerDown(event) {
        dragging = true;
        sx = event.clientX;
        sy = event.clientY;
    }

    function onPointerUp() {
        dragging = false;
    }

    function onPointerMove(event) {
        if (!dragging) return;
        rotY += (event.clientX - sx) * 0.005;
        rotX += (event.clientY - sy) * 0.005;
        sx = event.clientX;
        sy = event.clientY;
    }

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    function resize() {
        const width = container.clientWidth || 320;
        const height = container.clientHeight || 320;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }

    function animate() {
        requestAnimationFrame(animate);

        for (let i = 0; i < posAttr.count; i++) {
            const idx3 = i * 3;
            const x0 = basePos[idx3];
            const y0 = basePos[idx3 + 1];
            const z0 = basePos[idx3 + 2];
            const x = posAttr.array[idx3];
            const y = posAttr.array[idx3 + 1];
            const z = posAttr.array[idx3 + 2];

            const fx = (x0 - x) * K + (Math.random() - 0.5) * NOISE;
            const fy = (y0 - y) * K + (Math.random() - 0.5) * NOISE;
            const fz = (z0 - z) * K + (Math.random() - 0.5) * NOISE;

            vel[idx3] = (vel[idx3] + fx) * DAMP;
            vel[idx3 + 1] = (vel[idx3 + 1] + fy) * DAMP;
            vel[idx3 + 2] = (vel[idx3 + 2] + fz) * DAMP;

            posAttr.array[idx3] = x + vel[idx3];
            posAttr.array[idx3 + 1] = y + vel[idx3 + 1];
            posAttr.array[idx3 + 2] = z + vel[idx3 + 2];
        }

        posAttr.needsUpdate = true;
        buildWire();

        rotY += dragging ? 0 : 0.002;
        pointsMesh.rotation.x = wireMesh.rotation.x = rotX;
        pointsMesh.rotation.y = wireMesh.rotation.y = rotY;

        renderer.render(scene, camera);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
}

window.initORB3D = initORB3D;
