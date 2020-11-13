/****www.mosq.cn***/

var seting = {
    apiUrl: "api.php",    // api鍦板潃
    ratio: 0.618,        // 鍥剧墖瀹介珮姣�
    types: '360new',     // 鍔犺浇澹佺焊鐨勭绫�
    downApi: 'http://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=' // 鐢ㄤ簬涓嬭浇鍥剧墖鐨刟pi鍦板潃
};

var jigsaw = {
    count: 0,            // 宸插姞杞界殑鎬绘暟
    halfHtml: '',        // 鏈€鍚庝竴涓姞杞界殑html
    loadBig: false,      // 鏄惁宸插姞杞芥渶澶х殑閭ｄ釜
    ajaxing: false        //鏄惁姝ｅ湪ajax鍔犺浇
};

// 澶у皬鏀瑰彉
window.onresize = function () {
    resizeHeight();
};

// 鍒濆鍖�
window.onload = function () {
    ajax360Tags();
    loadData(seting.types, true);   // 鍒濆鍔犺浇澹佺焊
    resizeHeight();
};

// // ajax鍔犺浇鏃舵ā绯婂寲
// $(document).ajaxStart(function () {
//     $('html').addClass("blur");
// });

// $(document).ajaxStop(function () {
//     $("html").removeClass("blur");
// });

$(function () {

    // 鐩戝惉婊氬姩娑堟伅
    $(window).scroll(function () {
        if ($(this).scrollTop() + $(window).height() + 20 >= $(document).height() && $(this).scrollTop() > 20) {
            loadData(seting.types, false);
        }
        if(seting.types != 'bing' && seting.types != 'ciba'){
            if($(window).scrollTop() >= 300){
                $('#toolBall').fadeIn(400);
            }else{
                $('#toolBall').fadeOut(200);
            }
        }
    });

    $("#toolBall").click(function(){
        if(seting.types == 'bing' || seting.types == 'ciba'){
            return true;
        }
        $('body').animate({scrollTop:0},300,'swing');
        return false;
    });

    // 鐐瑰嚮鍏抽棴寮瑰嚭灞�
    $("body").on("click","#full-img", function() {
        $("#full-img").remove();
    });

    // 鐐瑰嚮灏忓浘鏄剧ず澶у浘
    $("#walBox").on("click","img", function() {
        // var imgWidth = parseInt(screen.width / 2),
        // imgHeight = parseInt(imgWidth * seting.ratio);
        // showImg(decode360Url($(this).data('realurl'), imgWidth, imgHeight, 100));
        showImg($(this).data('realurl'));
    });
});


// 鍔犺浇澹佺焊瀹瑰櫒涓殑澹佺焊
function loadData(types, newload){
    if(types != seting.types || newload === true)
    {
        seting.types = types;
        jigsaw = {
            count: 0,            // 宸插姞杞界殑鎬绘暟
            halfHtml: '',        // 鏈€鍚庝竴涓姞杞界殑html
            loadBig: false,      // 鏄惁宸插姞杞芥渶澶х殑閭ｄ釜
            ajaxing: false        //鏄惁姝ｅ湪ajax鍔犺浇
        };
        $("#walBox").html('');
        $(document).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');    // 瑙ｉ櫎鍏ㄥ睆婊氬姩鐨勭粦瀹�
        $(".onepage-pagination").remove();
        $("body").removeClass();
        $(".jigsaw").removeAttr("style");
        $("#toolBall").attr('href','javascript:void(0);');
        $("#toolBall").attr('class','uptoTop');
        $("#toolBall").attr('title','杩斿洖椤堕儴');
        $("#toolBall").hide();
    }

    switch (seting.types)
    {
        case 'bing':    //鍔犺浇蹇呭簲澹佺焊
            ajaxBingWal(-1, 8);
            ajaxBingWal(7, 8);
            $("#toolBall").show();
            $("#toolBall").attr('class','downBing');
            $("#toolBall").attr('title','涓嬭浇杩欏紶鍥剧墖');
        break;

        case 'ciba':    // 鍔犺浇閲戝北璇嶉湼姣忔棩涓€鍙ュ绾�
            if(newload === false) return;
            ajaxCiba(1);
            $("#toolBall").show();
            $("#toolBall").attr('class','downBing');
            $("#toolBall").attr('title','涓嬭浇杩欏紶鍥剧墖');
        break;

        default:    // 鍔犺浇鏉ヨ嚜360鐨勫绾�
            ajax360Wal(seting.types, jigsaw.count, 30);
    }
}

resizeHeight();

// 閲嶆柊璋冩暣楂樺害
function resizeHeight() {
    switch (seting.types)
    {
        default:
            var newHeight = $("#walBox").width() * (seting.ratio / 2);    // parseInt($(".jigsaw .half").css('width'))
            $(".jigsaw .item").css('height', newHeight);
            $(".jigsaw .Hhalf").css('height', newHeight/2);
    }
    return true;
}

// 鏄剧ず涓€寮犳嫾鍥惧绾�
function addJigsaw(img, alt){
    var newHtml;    // 鏂板鐨勫唴瀹�
    var imgWidth,imgHeight;
    jigsaw.count++;    // 宸插姞杞藉绾告暟鑷姞

    if(jigsaw.halfHtml !== '')    //  1/4 鐨勫绾革紝宸插姞杞藉畬涓婇潰涓€鍗婏紝鎺ョ潃鍔犺浇涓嬮潰閭ｅ崐
    {
        imgWidth = parseInt(screen.width / 4);
        imgHeight = parseInt(imgWidth * seting.ratio);

        newHtml = '    <div class="Hhalf oneImg" onmouseover="hoverJigsaw(this)">'
                + '        <img data-original="' + decode360Url(img, imgWidth, imgHeight, 0) + '" alt="' + alt + '" title="鍏抽敭瀛楋細' + alt + '" data-realurl="' + img + '">'
                + '    </div>'
                + '</div>';
        contAdd(jigsaw.halfHtml + newHtml);    //寰€瀹瑰櫒涓姞鍏ュ唴瀹�
        jigsaw.halfHtml = '';    // 鍙﹀鍗婅竟鍔犺浇瀹屾垚
        return true;    // 鍑芥暟鍔熻兘宸插畬鎴�
    }

    if(((jigsaw.count-1) % 5) === 0){jigsaw.loadBig = false;}    // 鏂扮殑涓€琛岋紝鐘舵€侀噸缃�

    if((jigsaw.loadBig === false) && ( (Math.floor(Math.random()*3) === 0) || ((jigsaw.count % 5) === 0) ))    // 闅忔満鍔犺浇澶у紶澹佺焊
    {
        imgWidth = parseInt(screen.width / 2);
        imgHeight = parseInt(imgWidth * seting.ratio);

        newHtml = '<div class="item half oneImg" onmouseover="hoverJigsaw(this)">'
                + '    <img data-original="' +decode360Url(img, imgWidth, imgHeight, 0)+ '" alt="' + alt + '" title="鍏抽敭瀛楋細' + alt + '" data-realurl="' + img + '">'
                + '</div>';
        contAdd(newHtml);    //寰€瀹瑰櫒涓姞鍏ュ唴瀹�
        jigsaw.loadBig = true;    // 澶у紶澹佺焊宸茶鍔犺浇
        return true;    // 鍑芥暟鍔熻兘宸插畬鎴�
    }

    // 鍔犺浇鍗婂紶鐨勫绾�
    imgWidth = parseInt(screen.width / 4);
    imgHeight = parseInt(imgWidth * seting.ratio);

    jigsaw.halfHtml = '<div class="item quater">'
            + '    <div class="Hhalf oneImg" onmouseover="hoverJigsaw(this)">'
            + '        <img data-original="' +decode360Url(img, imgWidth, imgHeight, 0)+ '" alt="' + alt + '" title="鍏抽敭瀛楋細' + alt + '" data-realurl="' + img + '">'
            + '    </div>';
    return true;
}

// 寰€澹佺焊瀹瑰櫒涓姞鍏ュ唴瀹�
function contAdd(html)
{
    var myBox = $("#walBox");    // 瑁呭绾哥殑瀹瑰櫒
    var $newHtml = $(html);
    myBox.append($newHtml);    // 鍔犺浇鍒板鍣ㄤ腑
    $("img", $newHtml).lazyload({
        effect:'fadeIn',
        threshold: 200 // 鎻愬墠寮€濮嬪姞杞�
    });
}

// ajax鍔犺浇蹇呭簲澹佺焊
function ajaxBingWal(start, count){
    $.ajax({
        type: "GET",
        url: seting.apiUrl,
        data: "cid=bing&start=" + start + "&count=" + count,
        dataType : "json",
        success: function(jsonData){
            var newHtml = '<link rel="stylesheet" href="css/onepage-scroll.css">',downUrl = '';
            $("#walBox").append(newHtml);   // 鍏ㄥ睆婊氬姩鎻掍欢css

            for (var i = 0; i < jsonData.images.length; i++){
                if(jsonData.images[i].wp === true){ // BING瀹樻柟涓嶈涓嬭浇鐨勫浘鐗囧鐞�
                    downUrl = 'http://cn.bing.com/hpwp/' + jsonData.images[i].hsh;
                }else{
                    downUrl = 'http://cn.bing.com' + jsonData.images[i].url;
                }
                newHtml += '<section data-url="' + downUrl + '" data-img="http://cn.bing.com' + jsonData.images[i].url + '"><p class="note">' + jsonData.images[i].copyright + '</p></section>';
            }
            $("#walBox").append(newHtml);

            $('#walBox').onepage_scroll({
                // sectionContainer: '#walBox',
                // direction: 'horizontal',  // 姘村钩婊氬姩
                // pagination: false,  // 涓嶆樉绀哄彸渚у渾鐐�
                // easing: 'ease-in',
                loop: false,    // 绂佹寰幆婊氬姩
                beforeMove: function(index){
                    $("#toolBall").attr('href', $(".section").eq(index-1).attr('data-url'));
                    $(".section").eq(index-1).attr('style','background-image: url('+ $(".section").eq(index-1).attr('data-img') +')');
                },
                afterMove: function(index){
                    $(".section").eq(index).attr('style','background-image: url('+ $(".section").eq(index).attr('data-img') +')');
                    $(".section").eq(index-2).attr('style','background-image: url('+ $(".section").eq(index-2).attr('data-img') +')');
                    // $(".section").eq(index-1).attr('style','background-image: url('+ $(".section").eq(index-1).attr('data-img') +')');
                }
            });
            $("#toolBall").attr('href', $(".section").eq(0).attr('data-url'));
            $(".section").eq(0).attr('style','background-image: url('+ $(".section").eq(0).attr('data-img') +')');

        }
    });
    return true;
}

// ajax鍔犺浇閲戝北璇嶉湼姣忔棩鍥剧墖
function ajaxCiba(data){
    $.ajax({
        type: "GET",
        url: "http://open.iciba.com/dsapi/",
        // data: "cid=bing&start=" + start + "&count=" + count,
        dataType : "jsonp",
        success: function(jsonData){
            var newHtml = '<style>#walBox .note{position: fixed;}body{background-image: url(' + jsonData.picture2 + ');overflow: hidden;}</style>' +
            '<p class="note" title="' + jsonData.translation + '"><span onclick="$(\'audio\')[0].play();" title="鐐瑰嚮鏈楄" class="ciba-eng">' + jsonData.content + '</span><br>' + jsonData.note + //鉂�
            ' <span title="' + jsonData.love + '浜哄枩娆�" class="ciba-love" onclick="$(\'.love-count\').html(parseInt($(\'.love-count\').html()) + 1)"><span style="color: red;">鉂�</span>+<span class="love-count">' + jsonData.love + '</span></span></p>' +
            '<audio src="' + jsonData.tts + '" hidden></audio>';

            $("#walBox").append(newHtml);

            $("#toolBall").attr('href', seting.downApi + jsonData.picture2);    // 涓嬭浇閾炬帴

        }
    });
    return true;
}

// ajax鍔犺浇360澹佺焊鏍囩
function ajax360Tags(){
    $.ajax({
        type: "GET",
        url: seting.apiUrl,
        data: "cid=360tags",
        dataType : "json",
        success: function(jsonData){
            var newHtml = '';
            for (var i = 0; i < jsonData.data.length; i++){
                newHtml += '<li data-id=' + jsonData.data[i].id + ' onclick="loadData(' + jsonData.data[i].id + ', true);changeTitle(this)">' + jsonData.data[i].name + '</li>';
            }
            $("#tags").append(newHtml);
        }
    });
    return true;
}

// ajax鍔犺浇鏉ヨ嚜360鐨勫绾�
function ajax360Wal(cid, start, count){
    if(jigsaw.ajaxing === true) return false;
    $("#loadmore").html('鍔姏鍔犺浇涓€︹€�');
    $("#loadmore").show();
    jigsaw.ajaxing = true;
    $.ajax({
        type: "GET",
        url: seting.apiUrl,
        data: "cid=" + cid + "&start=" + start + "&count=" + count,
        dataType : "json",
        success: function(jsonData){
            for (var i = 0; i < jsonData.data.length; i++){
                addJigsaw(jsonData.data[i].url, decode360Tag(jsonData.data[i].tag));
            }
            resizeHeight();
            jigsaw.ajaxing = false;
            if(jsonData.data.length === 0){
                $("#loadmore").html('鎵€鏈夌殑澹佺焊閮藉凡缁忓姞杞藉畬鍟︼紒');
            }else{
                $("#loadmore").hide();
            }
        }
    });
    return true;
}

// 瑙ｇ爜360api鑾峰彇鐨則ag鏍囩
function decode360Tag(oldTag){
    return oldTag.match(/_category_[^_]+_/g).join(" ").replace(/_category_([^_]+)_/g, "$1");
}

// 瑙ｇ爜360鍥剧墖鐨勯摼鎺ワ紝鑾峰緱鎸囧畾灏哄鍥剧墖
function decode360Url(oldUrl, width, height, quality){
    return oldUrl.replace("r\/__85", "m\/" + parseInt(width) + "_" + parseInt(height) + "_" + quality);
}

// 鎷煎浘鍥惧潡榧犳爣绉诲姩鏄剧ず鍒嗚鲸鐜囦笅杞�
function hoverJigsaw(obj){
    if ($(obj).find('.down').length > 0) return true;

    var realUrl = $(obj).find('img').attr("data-realurl");
    var downBox = '';
    downBox = '<ul class="down" title="涓嬭浇澹佺焊">'
    + '<li><a href="' + seting.downApi + decode360Url(realUrl, 2560, 1600, 100)+ '" target="_blank">2560x1600</a></li>'
    + '<li><a href="' + seting.downApi + decode360Url(realUrl, 1440, 900, 100)+ '" target="_blank">1440x900</a></li>'
    + '<li><a href="' + seting.downApi + decode360Url(realUrl, 1024, 768, 100)+ '" target="_blank">1024x768</a></li>'
    + '<li><a href="' + seting.downApi + decode360Url(realUrl, 800, 600, 100)+ '" target="_blank">800x600</a></li>'
    + '<li><a href="' + seting.downApi + decode360Url(realUrl, 0, 0, 100)+ '" target="_blank" title="涓嬭浇鍘熷灏哄鍥剧墖">鍘熷灏哄</a></li></ul>'
    $(obj).append(downBox);
}

// 鍚屾鏀瑰彉娴忚鍣ㄦ爣棰�
function changeTitle(obj){
    $('title').html($(obj).html()+' - 鍦ㄧ嚎澹佺焊');
}

var imgDom;

// 鍏ㄥ睆灞曠ず鍥剧墖
// 鍙傛暟锛氬浘鐗囬摼鎺�
function showImg(img) {
    imgDom = $('<img>').attr('id', 'full-img').attr('src', img).appendTo('body');
}

// 鎴戠殑瑕佹眰骞朵笉楂橈紝淇濈暀杩欎竴鍙ョ増鏉冧俊鎭彲濂斤紵
// 淇濈暀浜嗭紝浣犱笉浼氭崯澶变粈涔堬紱鑰屼繚鐣欑増鏉冿紝鏄浣滆€呮渶澶х殑灏婇噸銆�
console.info('浣滆€咃細mengkun(http://mkblog.cn)\n澹佺焊鏉ユ簮浜庯細360澹佺焊搴撱€佸繀搴旈椤靛绾镐互鍙婇噾灞辫瘝闇稿紑鏀惧钩鍙癨nGithub锛歨ttps://github.com/mengkunsoft/wallpaper');