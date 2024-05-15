import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { RectAreaLightHelper } from 'RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';
import { Scene } from 'three';



// Создаем сцену
var scene = new THREE.Scene();
scene.scale.set(8,8,8)

// Создаем камеру
var camera = new THREE.PerspectiveCamera(75, (window.innerWidth) / (window.innerHeight), 0.1, 1000);
camera.position.set(2, 0.001, 0.0001);


// Создаем рендерер с прозрачным фоном
let canvas = document.querySelector(".canvas")
canvas.style.position = "absolute"
var renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });
renderer.setSize((window.innerWidth), (window.innerHeight));
document.body.appendChild(renderer.domElement);

// Создаем свет
var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

// Создаем загрузчик текстур
var textureLoader = new THREE.TextureLoader();

// Загружаем текстуру
var texture = textureLoader.load('model/textures/BoltSteel_baseColor.jpeg'); // замените на путь к вашей текстуре

// Создаем материал с текстурой
var material = new THREE.MeshBasicMaterial({ map: texture });

// Загружаем модель
var object;
var loader = new GLTFLoader();
loader.load(
    'model/scene.gltf', // замените на путь к вашей модел
    function (gltf) {
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.material = material; // применяем материал с текстурой к каждому Mesh в сцене
            }
        });
        scene.add(gltf.scene);
        object = gltf.scene;
    },
    undefined,
    function (error) {
        console.error(error);
    }
);


// Создаем контроллеры для вращения модели мышью
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false; // Отключаем панорамирование



// Функция анимации
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); // обновляем tweens при каждом кадре
    controls.update(); // обновляем контроллеры при каждом кадре
    renderer.render(scene, camera);
    }

// Создаем вектор для хранения позиции касания
var touch = new THREE.Vector2();

// Создаем лучевой проектор для определения пересечений с объектами
var raycaster = new THREE.Raycaster();
console.log(raycaster)

// Создаем переменную для хранения текущего таймера
var currentTimer = null;

function onTouchStart(event) {
    // Нормализуем позицию касания от -1 до 1 для обоих направлений
    touch.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    touch.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

    // Обновляем лучевой проектор с новой позицией касания
    raycaster.setFromCamera(touch, camera);

    // Получаем массив всех объектов, которые пересекаются с лучом
    var intersects = raycaster.intersectObjects(scene.children, true);

    // Если есть пересечения и первое пересечение - это наша модель
    if (intersects.length > 0) {
        // Определяем направление вращения на основе позиции касания
        var directionX = (touch.x > 0) ? 1 : -1;
        var directionY = (touch.y > 0) ? -1 : 1;
    
        // Создаем новый tween для вращения модели
        new TWEEN.Tween(intersects[0].object.rotation)
            .to({
                y: intersects[0].object.rotation.y - directionX * 0.5,
                x: intersects[0].object.rotation.x - directionY * 0.5
            }, 1000) // 2000 мс = 2 секунды
            .easing(TWEEN.Easing.Quadratic.Out) // функция плавности
            .start(); // начинаем анимацию
    
        // Сохраняем текущее положение модели
        var currentRotationY = intersects[0].object.rotation.y;
        var currentRotationX = intersects[0].object.rotation.x;
    }
    
}

// Добавляем слушатель событий для касания
document.addEventListener('touchstart', onTouchStart, false);







animate();



// Функция анимации

    
