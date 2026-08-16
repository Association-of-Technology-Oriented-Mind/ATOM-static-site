import * as THREE from "three";

export default class GlowingAtom {
    constructor() {
        this.group = new THREE.Group();
        this.group.name = "GlowingAtom";

        // Properties for animation
        this.electrons = [];
        this.particleCount = 120;
        this.particleSpeed = 2.5;

        this.setNucleus();
        this.setOrbitRings();
        this.setParticleStream();

        // Default hidden/collapsed state for entrance animation
        this.group.scale.set(0.001, 0.001, 0.001);
        this.opacity = 0;
        this.updateOpacity(0);
    }

    setNucleus() {
        // Glowing nucleus core
        const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);

        // Core bright material
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x38bdf8,
            emissiveIntensity: 2.5,
            roughness: 0.2,
            metalness: 0.8,
        });

        this.nucleus = new THREE.Mesh(sphereGeo, coreMat);
        this.group.add(this.nucleus);

        // Outer translucent glow shell
        const glowGeo = new THREE.SphereGeometry(0.72, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
        });

        this.glowShell = new THREE.Mesh(glowGeo, glowMat);
        this.group.add(this.glowShell);

        // Nucleus light source
        this.pointLight = new THREE.PointLight(0x38bdf8, 3, 10);
        this.group.add(this.pointLight);
    }

    setOrbitRings() {
        this.orbitGroup = new THREE.Group();
        this.group.add(this.orbitGroup);

        const ringRadius = 1.4;
        const ringTube = 0.015;
        const ringGeo = new THREE.TorusGeometry(ringRadius, ringTube, 16, 100);

        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x9966cc,
            emissive: 0x9966cc,
            emissiveIntensity: 1.2,
            roughness: 0.3,
            metalness: 0.7,
            transparent: true,
            opacity: 0.85,
        });

        const electronGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const electronMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x38bdf8,
            emissiveIntensity: 3.0,
        });

        // 3 Orbital rings angled at distinct rotations
        const angles = [
            { x: Math.PI / 3, y: 0, z: Math.PI / 6, speed: 2.2 },
            { x: -Math.PI / 3, y: Math.PI / 4, z: -Math.PI / 4, speed: -1.8 },
            { x: 0, y: Math.PI / 2.5, z: Math.PI / 3, speed: 2.6 },
        ];

        this.ringData = [];

        angles.forEach((rot, index) => {
            const ringHolder = new THREE.Group();
            ringHolder.rotation.set(rot.x, rot.y, rot.z);

            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringHolder.add(ringMesh);

            const electron = new THREE.Mesh(electronGeo, electronMat);
            ringHolder.add(electron);

            this.orbitGroup.add(ringHolder);

            this.ringData.push({
                holder: ringHolder,
                electron: electron,
                radius: ringRadius,
                speed: rot.speed,
                angle: (index * Math.PI * 2) / 3,
            });
        });
    }

    setParticleStream() {
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = [];

        for (let i = 0; i < this.particleCount; i++) {
            // Spawn near nucleus
            positions[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

            velocities.push({
                x: (Math.random() - 0.5) * 0.6,
                y: -(Math.random() * 1.5 + 0.8), // downward drift
                z: (Math.random() - 0.5) * 0.6,
                life: Math.random(),
            });
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3),
        );

        // Soft glowing particle canvas texture
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.4, "rgba(56, 189, 248, 0.8)");
        grad.addColorStop(0.8, "rgba(153, 102, 204, 0.4)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);

        const particleTex = new THREE.CanvasTexture(canvas);

        const particleMat = new THREE.PointsMaterial({
            size: 0.28,
            map: particleTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.7,
        });

        this.particles = new THREE.Points(particleGeo, particleMat);
        this.particleVelocities = velocities;
        this.group.add(this.particles);
    }

    updateOpacity(val) {
        this.opacity = val;
        this.group.traverse((child) => {
            if (child.material) {
                child.material.transparent = true;
                if (child.material.userDataOriginalOpacity === undefined) {
                    child.material.userDataOriginalOpacity =
                        child.material.opacity ?? 1.0;
                }
                child.material.opacity =
                    child.material.userDataOriginalOpacity * val;
            }
        });
    }

    update(delta, elapsed) {
        // Continuous rotation of the nucleus and entire orbit group
        if (this.nucleus) {
            this.nucleus.rotation.y += delta * 0.8;
            this.nucleus.rotation.x += delta * 0.4;
        }

        if (this.orbitGroup) {
            this.orbitGroup.rotation.y += delta * 0.5;
            this.orbitGroup.rotation.z += delta * 0.3;
        }

        // Move electrons along orbits
        this.ringData.forEach((ring) => {
            ring.angle += ring.speed * delta;
            ring.electron.position.x = Math.cos(ring.angle) * ring.radius;
            ring.electron.position.z = Math.sin(ring.angle) * ring.radius;
        });

        // Update downward drifting particle stream
        if (this.particles && this.opacity > 0.05) {
            const posAttr = this.particles.geometry.attributes.position;
            const pos = posAttr.array;

            for (let i = 0; i < this.particleCount; i++) {
                const vel = this.particleVelocities[i];
                vel.life += delta * 0.6;

                pos[i * 3 + 0] += vel.x * delta;
                pos[i * 3 + 1] += vel.y * delta;
                pos[i * 3 + 2] += vel.z * delta;

                // Reset particle when it drifts too far downward
                if (pos[i * 3 + 1] < -4.5 || vel.life > 2.5) {
                    pos[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
                    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
                    vel.life = 0;
                }
            }

            posAttr.needsUpdate = true;
        }
    }
}
