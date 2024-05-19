import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { RectAreaLightHelper } from 'RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';
import { Scene } from 'three';

// old code

let coin = document.querySelector(".coin");
let point = document.querySelector(".Point");
let energy = document.querySelector(".Energy");
let slesh = document.querySelector(".slesh");

let close = document.querySelector(".close");
let windowMod = document.querySelector(".window");

let boosts_button = document.querySelector(".boosts_button");
let pointBoost = document.querySelector(".pointBoost");

let tapLvl = document.querySelector(".tapLvl");
let regenLvl = document.querySelector(".regenLvl");
let massLvl = document.querySelector(".massLvl");

let priceTap = document.querySelector(".priceTap");
let priceRegen = document.querySelector(".priceRegen");
let priceMass = document.querySelector(".priceMass");


let pointSave = localStorage.getItem('pointSave') || 0;
point.innerHTML = Number(pointSave);
let clickLVL = localStorage.getItem('clickLVL') || 0;
let energyRegenLVL = localStorage.getItem('energyRegenLVL') || 0;
let energyMaxLVL = localStorage.getItem('energyMaxLVL') || 0;

let clickPoints = Number(localStorage.getItem('clickPoints')) || 1;
let energyRegen = Number(localStorage.getItem('energyRegen')) || 1;
let energyMax = Number(localStorage.getItem('energyMax')) || 500;

let clickSell = localStorage.getItem('clickSell') || 100;
let regenSell = localStorage.getItem('regenSell') || 100;
let massEnergySell = localStorage.getItem('massEnergySell') || 100;

// localStorage.clear()


// let currentEnergy = energyMax;
let currentEnergy = localStorage.getItem('currentEnergy') || 500;
energy.textContent = Number(currentEnergy);


let clickApp = document.querySelector(".clickApp")
let RegenApp = document.querySelector(".RegenApp")
let MassEnergyApp = document.querySelector(".MassEnergyApp")

slesh.textContent = '/' + energyMax

// close.addEventListener("click", () => { 
//     windowMod.style.display = "none";
    
// }
// )

// boosts_button.addEventListener("click", () => { 
//     windowMod.style.display = "block";
//     pointBoost.textContent = pointSave + " BLTC";
//     tapLvl.textContent = clickLVL;
//     regenLvl.textContent = energyRegenLVL;
//     massLvl.textContent = energyMaxLVL;
//     priceTap.textContent = clickSell;
//     priceRegen.textContent = regenSell;
//     priceMass.textContent = massEnergySell;
    
    
// }
// )

// Сохраняем текущее время при выходе из приложения
window.addEventListener('unload', function() {
    let exitTime = new Date().getTime();
    localStorage.setItem('exitTime', exitTime);
});

// Восстанавливаем энергию при входе в приложение
window.addEventListener('load', function() {
    let enterTime = new Date().getTime();
    let exitTime = localStorage.getItem('exitTime');
    
    if (exitTime) {
        let timeDifference = enterTime - exitTime; // Время в миллисекундах
        let energyToRegenerate = Math.floor(timeDifference / 1000) * energyRegen; // Предполагая, что энергия восстанавливается каждую секунду

        currentEnergy = Number(currentEnergy) + energyToRegenerate;
        if (currentEnergy > energyMax) {
            currentEnergy = energyMax;
        }

        localStorage.setItem('currentEnergy', currentEnergy);
        energy.textContent = Number(currentEnergy);
    }
});


//

// Функция для восстановления энергии

function regenerateEnergy() {
    currentEnergy = Number(currentEnergy);
    if (currentEnergy + energyRegen >= energyMax) {
        currentEnergy = energyMax; // Устанавливаем максимальное значение
        localStorage.setItem('currentEnergy', currentEnergy);
        energy.textContent = currentEnergy;
        
    } else if (currentEnergy + energyRegen < energyMax) {
        currentEnergy += energyRegen; // Восстанавливаем энергию
        localStorage.setItem('currentEnergy', currentEnergy);
        energy.textContent = Number(currentEnergy);
        
    }
    localStorage.setItem('currentEnergy', currentEnergy);
    energy.textContent = Number(currentEnergy); // Обновляем отображение энергии
}

// Устанавливаем интервал для восстановления энергии
setInterval(regenerateEnergy, 1000);

//old code end

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
        // old code

        if (Number(currentEnergy) > 0 && Number(currentEnergy) - clickPoints > 0) {
            point.innerHTML = Number(point.textContent) + clickPoints;
            pointSave = point.innerHTML
            currentEnergy -= clickPoints; // Отнимаем энергию при клике
            energy.textContent = Number(currentEnergy);
            localStorage.setItem('pointSave', pointSave);
        
            // Создаем элемент для анимации
            let scoreElement = document.createElement('div');
            scoreElement.textContent = '+' + clickPoints;
            scoreElement.style.position = 'absolute';
            scoreElement.style.left = event.touches[0].clientX + 'px'; // Используем координаты касания
            scoreElement.style.top = event.touches[0].clientY + 'px'; // Используем координаты касания
            scoreElement.style.zIndex = "10";
            scoreElement.style.backgroundImage = "url('assets/btc.svg')"
            scoreElement.style.width = "30px"
            scoreElement.style.height = "15px"
            scoreElement.style.backgroundPosition = "left"
            scoreElement.style.paddingLeft = "13px"
            scoreElement.style.backgroundSize = "13px 13px"
            scoreElement.style.backgroundRepeat = "no-repeat"
            scoreElement.style.display = "block"
            document.body.appendChild(scoreElement);
        
            // Добавляем анимацию
            scoreElement.animate([
                { transform: 'translateY(0px)', opacity: 1 },
                { transform: 'translateY(-50px)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
        
            // Удаляем элемент после анимации
            setTimeout(() => {
                document.body.removeChild(scoreElement);
            }, 1000);

            
        } else if (Number(currentEnergy) - clickPoints < 0) {
            point.innerHTML = Number(point.textContent) + Number(currentEnergy);
            pointSave = point.innerHTML
            currentEnergy -= Number(currentEnergy); // Отнимаем энергию при клике
            energy.textContent = Number(currentEnergy);
            localStorage.setItem('pointSave', pointSave);
    
            // Создаем элемент для анимации
            let scoreElement = document.createElement('div');
            scoreElement.textContent = '+' + clickPoints;
            scoreElement.style.position = 'absolute';
            scoreElement.style.left = event.touches[0].clientX + 'px'; // Используем координаты касания
            scoreElement.style.top = event.touches[0].clientY + 'px'; // Используем координаты касания
            scoreElement.style.zIndex = "10";
            scoreElement.style.backgroundImage = "url('assets/btc.svg')"
            scoreElement.style.width = "30px"
            scoreElement.style.height = "15px"
            scoreElement.style.backgroundPosition = "left"
            scoreElement.style.paddingLeft = "13px"
            scoreElement.style.backgroundSize = "13px 13px"
            scoreElement.style.backgroundRepeat = "no-repeat"
            scoreElement.style.display = "block"
            document.body.appendChild(scoreElement);
    
            // Добавляем анимацию
            scoreElement.animate([
                { transform: 'translateY(0px)', opacity: 1 },
                { transform: 'translateY(-50px)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
    
            // Удаляем элемент после анимации
            setTimeout(() => {
                document.body.removeChild(scoreElement);
            }, 1000);
    
        }

        //old code end
    
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

