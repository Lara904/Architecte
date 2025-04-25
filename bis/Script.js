document.addEventListener('DOMContentLoaded', () => {
    const projetsContainer = document.getElementById('projets-container');
    fetch('projets.json')
    .then(response => response.json())
    .then(data => {
        projetsContainer.innerHTML = '';
        data.forEach(projet => {
            const projetDiv = document.createElement('div');
            projetDiv.classList.add('projet');
            projetDiv.innerHTML = `<img src="${projet.image}" alt="${projet.titre}">
                                   <h3>${projet.titre}</h3>
                                   <p>${projet.description}</p>`;
            projetsContainer.appendChild(projetDiv);
        });
    });
});
