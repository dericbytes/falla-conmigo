function init(){
    //debugger;
    var element = document.createElement("div");
    var para = document.createTextNode('yippie');
    element.appendChild(para);
    document.getElementsByTagName('body')[0].appendChild(element);

}

window.onload=init();
