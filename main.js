let version = "b0.0.1";
let player = new Object();
player.variation = 0;
player.number = 1;
player.glucose = 15;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
function update(){
    $("#resnumnum")[0].innerHTML = player.number.toFixed(0).toString();
    $("#resnumglu")[0].innerHTML = player.glucose.toFixed(0).toString();
}
function load(){
    $("#ver")[0].innerHTML = version;
    $("#resetsure").hide();
    $("#variation").click(function (e) {
        player.variation += 1;
        if(player.variation >= 5){
            player.variation = 5;
            $("#varbox").fadeOut(1000);
            $("#splbox").fadeIn(1000);
        }
        update();
    });
    $("#split").click(function (e) {
        if(player.glucose < 1){
            return;
        }
        player.glucose -= 1;
        player.number *= 1.5;
        if(player.number >= 5){
            $(".resourcebox").fadeIn(1000);
        }
        if(player.glucose <= 5){
            $("#splhint").fadeIn(1000);
            $("#gluresbox").fadeIn(1000);
        }
        update();
    });
    $("#reset").click(function (e) {
        $("#reset").hide();
        $("#resetsure").show();
        setTimeout(() => {
            $("#reset").show();
            $("#resetsure").hide();
        },10000);
    });
    $("#resetsure").click(function (e) {
        localStorage.removeItem("cancer");
        location.reload();
    });
    $("#save").click(function (e) {
        saveToClipboard();
    });
    $("#load").click(function (e) {
        saveFromText();
    });
}
function writeSave(){
    localStorage["cancer"] = JSON.stringify(player);
}
function readSave(){
    if(!localStorage["cancer"]){
        return;
    }
    player = JSON.parse(localStorage["cancer"]);
    if(player.variation >= 5){
        $("#varbox").hide();
        $("#splbox").show();
    }
    if(player.number >= 5){
        $(".resourcebox").show();
    }
    update();
}
async function autoSave(){
    dates = Date.now();
    while((Date.now()-dates)<=5000){
        $("#autosave")[0].innerHTML = `自动保存 ${((dates+5000-Date.now())/1000).toFixed(1)}s`
        await sleep(100);
    }
    writeSave();
    setTimeout(autoSave,0);
}
async function saveToClipboard(){
    try {
        await navigator.clipboard.writeText(localStorage["cancer"]);
        alert("已保存到剪贴板");
    } catch (err) {
        alert("保存失败");
    }
}
function saveFromText(){
    try {
        var s = prompt("输入存档","abc");
        if(s != null){
            localStorage["cancer"]=JSON.stringify(JSON.parse(s));
            location.reload();
        }
    } catch (err) {
        alert("加载失败");
    }
}
async function init(){
    try{
        readSave();
    }catch(err){
        if(confirm("存档损坏。要删除存档吗？（选否复制存档）")){
            localStorage.removeItem("cancer");
            location.reload();
        }else{
            try {
                await navigator.clipboard.writeText(localStorage["cancer"]);
                alert("存档已保存到剪贴板");
            } catch (err) {
                alert("存档保存失败");
            }
            location.reload();
        }
    }
}
init();
load();
setTimeout(autoSave,0);