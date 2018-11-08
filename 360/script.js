const container = document.getElementById("container")
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;
// Scène et contrôles
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth /
    window.innerHeight, 0.1, 200)
const controls = new THREE.OrbitControls(camera)


// Sphère
const geometry = new THREE.SphereGeometry(50, 32, 32)
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('360.jpg');
texture.wrapS = THREE.RepeatWrapping
texture.repeat.x = -1;
const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
})
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)



//Renderer
const renderer = new THREE.WebGLRenderer()
//renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
container.appendChild(renderer.domElement)
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
camera.position.set(1, 0, 0)
controls.update()


function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

function onResize() {
    renderer.setSize(window.innerWidth, innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix();
}
function addToolTip(position) {
    let spriteMap = new THREE.TextureLoader().load("info.png");
    let spriteMaterial = new THREE.SpriteMaterial({map: spriteMap});
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position.clone().normalize().multiplyScaler(30))
    scene.add(sprite);
}

function onClick(e) {
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
    )
    console.log(mouse)
    let rayCaster = THREE.Raycaster();
    //rayCaster.setFromCamera( mouse, camera );

    let intersect = rayCaster.intersectObject(sphere)

}

window.addEventListener('resize', onResize);
container.addEventListener('click', onClick)
animate()