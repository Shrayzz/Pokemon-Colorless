// Scene loader

const app = document.getElementById('app');
let path;

async function loadScene(scene, func = null) {
    if (!scene) {
        console.error('Aucune scène sélectionnée en argument.');
        return;
    }

    try {
        if (!func) {
            path = `scenes/${scene}/${scene}.html`;
        } else {
            path = `scenes/${scene}/${func}/${func}.html`;
        }
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();

        app.innerHTML = html;
        injectCSS(scene);
        await readScripts(app);
    }
    catch (err) {
        console.error('Une erreur est survenue lors du chargement de la scène :', err);
    }
}


function injectCSS(scene) {
    const oldLink = document.querySelector(`link[data-scene-style]`);
    if (oldLink) oldLink.remove();

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `scenes/${scene}/style.css`;
    link.setAttribute('data-scene-style', 'true');

    document.head.appendChild(link);
}


async function readScripts(container) {
    const scripts = container.querySelectorAll('script');

    scripts.forEach(scriptTag => {
        const newScript = document.createElement('script');

        Array.from(scriptTag.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });

        if (scriptTag.src) {
            newScript.src = scriptTag.src;
        } else {
            newScript.textContent = scriptTag.textContent;
        }

        scriptTag.parentNode.replaceChild(newScript, scriptTag);
    });
}

loadScene('mainMenu', 'mainMenu');