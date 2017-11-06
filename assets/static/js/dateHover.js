var datesParent = document.querySelector('section.recent-posts-list');
var toggleDateType = (e) => {

    let node = e.target;

    if (node.classList.contains('post-published')) {
        let tmp = node.innerHTML;
        node.innerHTML = node.getAttribute('data-numeric-date');
        node.setAttribute('data-numeric-date', tmp);
    } 

};

datesParent.addEventListener('mouseover', toggleDateType);
datesParent.addEventListener('mouseout', toggleDateType);
