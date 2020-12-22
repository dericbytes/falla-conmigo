function init(){
    //debugger;
    let element = document.createElement("div");
    let text = document.createTextNode('yippie');
    element.appendChild(text);
    document.getElementsByTagName('body')[0].appendChild(element);

}




window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    init();
});
