/**
 * Created by wangshuai on 2016/12/20.
 */
function refreshWebPageOnLoadEvent() {
    StoreManagePort = new CollectionsManage();


    //Refresh the Navigate Sidebar
    var NavigateUL = document.getElementById('navigate-icon');
    var allCollectionMsg = StoreManagePort.getCollectionDefinition_array();

    //Clear all the animation
    for(var eleCount = NavigateUL.childElementCount;
            eleCount>0;--eleCount){
        NavigateUL.removeChild(NavigateUL.firstElementChild);
    }

    //Protected the animation
    if (allCollectionMsg.length == 0){
        NavigateUL.innerHTML = '<li><a>Please AddOn!</a><p>Collect Name!</p>'+
                                '<ul><li><div><a>Please AddOn!</a></div>'+
                                '</li></ul></li>';
        //初始化内容面板
        var hotArticle = document.getElementById('newstab-header').firstElementChild;
        getContentPanel(hotArticle.firstElementChild);

        return;
    }

    for(var itemIndex = 0;itemIndex<allCollectionMsg.length;++itemIndex){
        var nodeMsgUnit = allCollectionMsg.slice(itemIndex,itemIndex+1)[0];

        //create navigate sidebar icon only
        var newhref = generateNewElementFromMsg(nodeMsgUnit);
        newhref.setAttribute('collectNum',itemIndex);
        newhref.setAttribute('onmouseover','navigateImgOnMouseOver(this)');

        //create Area-Name items
        var newText3 = document.createTextNode(nodeMsgUnit.websiteName);
        var newBlock = document.createElement('p');
        newBlock.appendChild(newText3);

        //create hover-visible items
        var newText2 = document.createTextNode('Please Wait!');
        var newhref2 = document.createElement('a');
        newhref2.appendChild(newText2);
        var newCol = document.createElement('div');
        newCol.appendChild(newhref2);

        var newRow = document.createElement('li');
        newRow.appendChild(newCol);

        var NodeUL = document.createElement('ul');

        NodeUL.appendChild(newRow);


        //link components to sidebar
        var newItemLI = document.createElement('li');
        newItemLI.appendChild(newhref);
        newItemLI.appendChild(newBlock);
        newItemLI.appendChild(NodeUL);
        newItemLI.firstElementChild.style.animationDelay=Math.floor(Math.random()*10+1)+'s';
        NavigateUL.appendChild(newItemLI);
    }

    //初始化内容面板
    var hotArticle = document.getElementById('newstab-header').firstElementChild;
    getContentPanel(hotArticle.firstElementChild);
}
//Refresh the popupPanel content
function navigateImgOnMouseOver(objNode) {
    //Get the HovervisibleUl
    var HovervisibleUL = objNode.nextElementSibling.nextElementSibling;
    var collectNum = parseInt(objNode.getAttribute('collectNum'));

    //Clear all the childnode
    for(var eleCount=HovervisibleUL.childElementCount;
        eleCount>0;--eleCount){
        HovervisibleUL.removeChild(HovervisibleUL.firstElementChild);
    }

    //create new panel
    var collectionContent = StoreManagePort.getCollectionContent_array(collectNum);
    var workRow = null;

    for(var index=0;index<collectionContent.length;++index){

        if(index % 4 == 0){
            //create an row workBranch
            workRow = document.createElement('li');
            HovervisibleUL.appendChild(workRow);
        }
        //at the end of row Branch add Col
        var colBlock = document.createElement('div');
        workRow.appendChild(colBlock);
        var colhref = generateNewElementFromMsg(collectionContent[index]);
        colBlock.appendChild(colhref);
    }

}


function getContentPanel(EventObj) {
    var contentArea = document.getElementById('newstab-content');

    if (EventObj.innerHTML == '导航定制'){
        contentArea.innerHTML = getCustomsPanel().innerHTML;

        var toolsList = document.getElementById('custom-tools');
        var collectManage = toolsList.firstElementChild.firstElementChild;
        collectManage.onclick = function () {
            collectManageProcess(collectManage);};

        var addwebsite = toolsList.firstElementChild.nextElementSibling.
            firstElementChild;
        addwebsite.onclick = function () {
            addWebsiteProcess(addwebsite);};

        var linkManage = toolsList.firstElementChild.
                nextElementSibling.nextElementSibling.firstElementChild;
        linkManage.onclick = function () {
            linkWithCollectProcess(linkManage);};
    }else{
        contentArea.innerHTML = simulateAjaxForContainedItem(EventObj.innerHTML).innerHTML;
    }

    function simulateAjaxForContainedItem(flagString) {
        var contentContainer = document.createElement('div');
        //panelCustom
        var ullist = document.createElement('ul');
        ullist.setAttribute('id', 'news-list');

        for(var ccy=0;ccy<10;++ccy){
            var textNode = document.createTextNode(flagString + '>>>>>ServerSide has been building.');
            var hrefNode = document.createElement('a');
            hrefNode.appendChild(textNode);
            var itemsli = document.createElement('li');
            itemsli.appendChild(hrefNode);
            ullist.appendChild(itemsli);

            contentContainer.appendChild(ullist);
        }

        return contentContainer;
    }

    function getCustomsPanel(){
        var contentContainer = document.createElement('div');
        //panelCustom
        var areaCount = document.createElement('ul');
        areaCount.setAttribute('id', 'custom-tools');

        var textNode = document.createTextNode('管理收藏夹');
        var titleNode = document.createElement('h2');
        titleNode.appendChild(textNode);
        var clickArea = document.createElement('li');
        clickArea.appendChild(titleNode);

        var textNode2 = document.createTextNode('收藏网址');
        var titleNode2 = document.createElement('h2');
        titleNode2.appendChild(textNode2);
        var clickArea2 = document.createElement('li');
        clickArea2.appendChild(titleNode2);

        var textNode3 = document.createTextNode('网址关联收藏夹');
        var titleNode3 = document.createElement('h2');
        titleNode3.appendChild(textNode3);
        var clickArea3 = document.createElement('li');
        clickArea3.appendChild(titleNode3);


        areaCount.appendChild(clickArea);
        areaCount.appendChild(clickArea2);
        areaCount.appendChild(clickArea3);

        contentContainer.appendChild(areaCount);

        return contentContainer;
    }

    function collectManageProcess(ObjSrc) {
        var brother = ObjSrc.nextElementSibling;
        if(brother == null){
            var ulList = document.createElement('ul');
            ObjSrc.parentNode.appendChild(ulList);

            var topline = document.createElement('li');
            ulList.appendChild(topline);

            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id','collectinput');
            input.setAttribute('value','点此键入分类名，查询或新建分类');
            input.onfocus = function () {
                this.value = '';
            };
            input.onkeyup = function () {
                var stemp = topline.nextElementSibling;
                while (stemp != null){
                    topline.parentNode.removeChild(stemp);
                    stemp = topline.nextElementSibling;
                }
                if (input.value == '')
                    return;

                //Get All the Collection's Array
                var collectArray = StoreManagePort.getCollectionDefinition_array();

                //Scan the array for special keywords
                for(var cycle=0;cycle<collectArray.length;++cycle){
                    var item = collectArray[cycle];
                    var Name = item.websiteName;

                    if(Name.match(input.value) == null)
                        continue;

                    var aline = document.createElement('li');
                    ulList.appendChild(aline);

                    var atitle   = document.createElement('h1');
                    atitle.innerHTML=Name;

                    var ahhref = document.createElement('a');
                    ahhref.innerHTML='删除该分类';
                    ahhref.setAttribute('index', ''+cycle);
                    ahhref.onclick = function () {
                        StoreManagePort.deleteCollectionMessage
                        (parseInt(this.getAttribute('index')));
                        refreshWebPageOnLoadEvent();
                    };

                    aline.appendChild(atitle);
                    aline.appendChild(ahhref);

                    var bottomlimit = document.createElement('div');
                    bottomlimit.setAttribute('class', 'empty');
                    aline.appendChild(bottomlimit);
                }
                //if the operation return null item,add a button 'Addon'
                if (ulList.childElementCount==1){
                    var aline = document.createElement('li');
                    ulList.appendChild(aline);

                    var atitle   = document.createElement('h1');
                    atitle.innerHTML='新建分类：'+ input.value;

                    var ahhref = document.createElement('a');
                    ahhref.innerHTML='点击新建';
                    ahhref.onclick = function () {
                        StoreManagePort.addCollections(input.value);
                        refreshWebPageOnLoadEvent();
                    };

                    aline.appendChild(atitle);
                    aline.appendChild(ahhref);

                    var bottomlimit = document.createElement('div');
                    bottomlimit.setAttribute('class', 'empty');
                    aline.appendChild(bottomlimit);
                }

                var bottomlimit = document.createElement('li');
                bottomlimit.setAttribute('class', 'empty');
                ulList.appendChild(bottomlimit);

            };

            topline.appendChild(input);

            var bottomlimit = document.createElement('li');
            bottomlimit.setAttribute('class', 'empty');
            ulList.appendChild(bottomlimit);

        }else{
            var parent = ObjSrc.parentNode;
            while(brother != null){
                parent.removeChild(brother);
                brother = ObjSrc.nextElementSibling;
            }
        }
    }

    function addWebsiteProcess(ObjSrc) {
        var brother = ObjSrc.nextElementSibling;
        if(brother == null){
            var ulList = document.createElement('ul');
            ObjSrc.parentNode.appendChild(ulList);

            var topline = document.createElement('li');
            ulList.appendChild(topline);

            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id','collectinput');
            input.setAttribute('value','点此键入网址，收录或查询已收录网站');
            input.onfocus = function () {
                this.value = '';
            };
            input.onkeyup = function () {
                //Clear the Items Contained in this collection
                var stemp = topline.nextElementSibling;//topline is only one
                while (stemp != null){
                    topline.parentNode.removeChild(stemp);
                    stemp = topline.nextElementSibling;
                }
                //No response if the input value is bad
                if (input.value == ''||input.value == 'CollectionCount' ||
                        'Item_'.match(input.value) != null )
                    return;

                //Filter is successful
                for (var cycle=0;cycle<localStorage.length;++cycle){
                    var keyString = localStorage.key(cycle);
                    if (keyString.match(input.value)==null)
                        continue;

                    //the items that is match value has been find
                    var aline = document.createElement('li');
                    ulList.appendChild(aline);

                    var atitle   = document.createElement('h1');
                    atitle.innerHTML = 'Name:'+localStorage.getItem(keyString)+
                    '==>'+keyString;
                    atitle.setAttribute('weburl', keyString);

                    var aaherf = document.createElement('a');
                    aaherf.innerHTML='修改条目';
                    aaherf.onclick = function () {
                        //remove empty div
                        var condition = this.nextElementSibling;
                        if (condition.getAttribute('class') != 'empty'){//condition is name
                            //It is second click action, finish modify
                            var condition2 = condition.nextElementSibling;//condition is imagelink
                            if (condition2 != null){
                                var name = condition.value;
                                var imgs = condition2.value;

                                StoreManagePort.addWebsiteItemToDatabase(
                                    this.previousElementSibling.
                                    getAttribute('weburl'), name, imgs);
                                this.parentNode.removeChild(condition);
                                this.parentNode.removeChild(condition2);
                                input.onfocus();
                                input.onkeyup();
                                input.value = '在此键入';
                            }

                            return;//get data from form;
                        }


                        //It is the first click action,it is meaning modify
                        //popup the input frame filled with exits value
                        this.parentNode.removeChild(condition);
                        var modifyName = document.createElement('input');
                        modifyName.setAttribute('type','text');
                        var flv = localStorage.getItem(this.previousElementSibling.
                                                            getAttribute('weburl'));
                        modifyName.setAttribute('value', flv);
                        modifyName.onfocus=function () {
                            this.value = '';
                        }

                        var modifyImg = document.createElement('input');
                        modifyImg.setAttribute('type', 'text');
                        modifyImg.setAttribute('value', localStorage.getItem(flv));
                        modifyImg.onfocus=function () {
                            this.value = '';
                        }

                        var aline = this.parentNode;
                        aline.appendChild(modifyName);
                        aline.appendChild(modifyImg);

                        //keep up with area
                        var bottomlimit = document.createElement('div');
                        bottomlimit.setAttribute('class', 'empty');
                        aline.appendChild(bottomlimit);
                    };

                    aline.appendChild(atitle);
                    aline.appendChild(aaherf);

                    var bottomlimit = document.createElement('div');
                    bottomlimit.setAttribute('class', 'empty');
                    aline.appendChild(bottomlimit);
                }

                if (ulList.childElementCount==1){
                    var aline = document.createElement('li');
                    ulList.appendChild(aline);

                    //网址输入
                    var input2 = document.createElement('input');
                    input2.setAttribute('type', 'text');
                    input2.setAttribute('id','Namecollect');
                    input2.setAttribute('value','点此键入网址名称');
                    input2.onfocus = function () {
                        this.value = '';
                    };
                    //网站图片
                    var input3 = document.createElement('input');
                    input3.setAttribute('type', 'text');
                    input3.setAttribute('id','Imgcollect');
                    input3.setAttribute('value','点此键入图片网址');
                    input3.onfocus = function () {
                        this.value = '';
                    };

                    var ahhref = document.createElement('a');
                    ahhref.innerHTML='添加网址';
                    ahhref.onclick = function () {
                        StoreManagePort.addWebsiteItemToDatabase(input.value,
                            input2.value, input3.value);
                        input.onfocus();
                        input.onkeyup();
                        input.value = '在此键入';
                    };

                    aline.appendChild(input2);
                    aline.appendChild(input3);
                    aline.appendChild(ahhref);

                    var bottomlimit = document.createElement('div');
                    bottomlimit.setAttribute('class', 'empty');
                    aline.appendChild(bottomlimit);
                }

                var bottomlimit = document.createElement('li');
                bottomlimit.setAttribute('class', 'empty');
                ulList.appendChild(bottomlimit);



            };

            topline.appendChild(input);

            var bottomlimit = document.createElement('li');
            bottomlimit.setAttribute('class', 'empty');
            ulList.appendChild(bottomlimit);
        }else{
            var parent = ObjSrc.parentNode;
            while(brother != null){
                parent.removeChild(brother);
                brother = ObjSrc.nextElementSibling;
            }
        }

    }

    function linkWithCollectProcess(ObjSrc) {
        var brother = ObjSrc.nextElementSibling;
        if(brother == null){
            var ulList = document.createElement('ul');
            ObjSrc.parentNode.appendChild(ulList);

            //main operation always at ullist
            var collectionMsgArray = StoreManagePort.getCollectionDefinition_array();

            for(var num=0;num<collectionMsgArray.length;++num){
                var oneCollection = collectionMsgArray[num];

                var oneLine = document.createElement('li');
                ulList.appendChild(oneLine);

                var title = document.createElement('h1');
                title.innerHTML = oneCollection.websiteName;
                title.setAttribute('arrayIndex', num);
                oneLine.appendChild(title);

                title.onclick = function () {
                    var thisline = this.parentNode;
                    var cycleLimits = ulList.childElementCount;

                    //Remove else line which is contained in parentNode
                    for (var sp=0;sp<cycleLimits;++sp){
                        var sLine = ulList.firstElementChild;//Get a line

                        if (sLine.firstElementChild.innerHTML == this.innerHTML)
                            sLine = sLine.nextElementSibling;

                        if (sLine.getAttribute('class') == 'empty')
                            break;
                        ulList.removeChild(sLine);
                    }


                    //remove all the resteded element
                    var removedNode = this.nextElementSibling;//empty div or else node
                    while(removedNode != null){
                        thisline.removeChild(removedNode);
                        removedNode = this.nextElementSibling;
                    }


                    //Add one input frame under the title
                    var inputframe = document.createElement('input');
                    inputframe.setAttribute('type', 'text');
                    inputframe.setAttribute('value', '键入网址,搜索收录内容');
                    inputframe.onfocus = function () {
                        this.value = '';
                    }
                    inputframe.onkeyup = function () {
                        var empthdiv = this.nextElementSibling;
                        while (empthdiv != null){
                            this.parentNode.removeChild(empthdiv);
                            empthdiv = this.nextElementSibling;
                        }

                        //No response if the input value is bad
                        if (this.value == ''||this.value == 'CollectionCount' ||
                            'Item_'.match(this.value) != null )
                            return;

                        //all the rest will be append under this node
                        var thisdivforappend = this.parentNode;

                        for (var cycle=0;cycle<localStorage.length;++cycle){
                            var keyString = localStorage.key(cycle);
                            if (keyString.match(this.value)==null || keyString == 'CollectionCount'
                                    )
                                continue;

                            //the item is fit the condition is found
                            var titt = document.createElement('h1');
                            titt.innerHTML = 'Name:'+localStorage.getItem(keyString)+'==>'+keyString;
                            titt.setAttribute('weblink',keyString);


                            var clickBtn = document.createElement('a');
                            if (localStorage.getItem('Item_'+parseInt(this.previousElementSibling.
                                getAttribute('arrayIndex'))).match(keyString) == null){
                                //the link has not be added in
                                clickBtn.innerHTML = '添加关联';
                            }else{
                                //the link has been added in
                                clickBtn.innerHTML = '解除关联';
                            }
                            clickBtn.setAttribute('CollectIndex',this.previousElementSibling.
                            getAttribute('arrayIndex'));

                            clickBtn.onclick = function () {
                                if (this.innerHTML == '添加关联'){
                                    this.innerHTML = '解除关联';

                                    StoreManagePort.addItemToSpecialCollection(
                                        parseInt(this.getAttribute('CollectIndex')),
                                        this.previousElementSibling.getAttribute('weblink')
                                    )


                                }else{
                                    this.innerHTML = '添加关联';

                                    StoreManagePort.delateWebsiteFromSpecialCollection(
                                        parseInt(this.getAttribute('CollectIndex')),
                                        this.previousElementSibling.getAttribute('weblink')
                                    )

                                }
                            }

                            thisdivforappend.appendChild(titt);
                            thisdivforappend.appendChild(clickBtn);

                        }


                        //baodi============================================
                        var bottomlimit = document.createElement('div');
                        bottomlimit.setAttribute('class', 'empty');
                        thisdivforappend.appendChild(bottomlimit);
                    }

                    //readd the input and empty div
                    thisline.appendChild(inputframe);
                    console.log(thisline.childElementCount);

                    var bottomlimit = document.createElement('div');
                    bottomlimit.setAttribute('class', 'empty');
                    thisline.appendChild(bottomlimit);

                    console.log(thisline.childElementCount);
                }

                var bottomlimit = document.createElement('div');
                bottomlimit.setAttribute('class', 'empty');
                oneLine.appendChild(bottomlimit);
            }

            var bottomlimit = document.createElement('li');
            bottomlimit.setAttribute('class', 'empty');
            ulList.appendChild(bottomlimit);

        }else{
            //remove the ullist

            var parent = ObjSrc.parentNode;
            while(brother != null){
                parent.removeChild(brother);
                brother = ObjSrc.nextElementSibling;
            }
        }
    }
}

function generateNewElementFromMsg(MsgObj) {
    //get A href
    var hrefBlock = document.createElement('a');
    hrefBlock.setAttribute('href',MsgObj.websiteLink.indexOf('http') == -1? 'http://'+MsgObj.websiteLink:MsgObj.websiteLink);
    hrefBlock.setAttribute('target', '_blank');

    var imgblock = document.createElement('img');
    if (MsgObj.webimgSrc == 'None' || MsgObj.webimgSrc == null
        || MsgObj.webimgSrc == ''){
        imgblock.setAttribute('src', 'index_src/SymbolicGril.jpg');
    }else{
        imgblock.setAttribute('src', MsgObj.webimgSrc);
    }
    hrefBlock.appendChild(imgblock);

    return hrefBlock;

}

function CollectionsManage() {
    if (localStorage.length == 0){
        localStorage.CollectionCount = 0;
    }

    var collectLinks = new Array();

    for(var itemNum = 0;itemNum<parseInt(localStorage.CollectionCount);++itemNum){
        var keyString = 'Item_' + itemNum;

        var collectAll = localStorage.getItem(keyString);
        //CollectionName;memberLink;memberLink;......

        collectLinks.push(collectAll);
    }


    //Create a new Collection
    this.addCollections = function (nameString) {
        localStorage.CollectionCount = parseInt(localStorage.CollectionCount) + 1;
        var keyString = 'Item_' + (parseInt(localStorage.CollectionCount) -1);

        var collectAll = nameString + ';' ;

        localStorage.setItem(keyString, collectAll);
        collectLinks.push(collectAll);
    }

    //Add Items to special collection
    this.addItemToSpecialCollection = function (numInt, webLink) {
        var collectionSpecial = collectLinks[numInt];

        collectionSpecial += webLink + ';';
        collectLinks[numInt] = collectionSpecial;

        localStorage.setItem('Item_'+numInt, collectionSpecial);
    }
    //Delate the website from speical collection
    this.delateWebsiteFromSpecialCollection = function (indexInt, webLink) {
        var linkArray = collectLinks[indexInt].split(';');
        var newCollectPackage = '';

        for (var cycle=0; cycle < linkArray.length; ++cycle){
            if (linkArray[cycle] == webLink || linkArray[cycle] == null
                || linkArray[cycle] == '')
                continue;
            newCollectPackage += linkArray[cycle] + ';';
        }

        collectLinks[indexInt] = newCollectPackage;

        localStorage.setItem('Item_'+indexInt, newCollectPackage);
    }


    //Add weblink to browser local database
    this.addWebsiteItemToDatabase = function(webLink_String, webName_String, webImgSrc_String){
        localStorage.setItem(webLink_String, webName_String);
        localStorage.setItem(webName_String, webImgSrc_String);
    }


    //Refresh the Collection Items Message
    this.deleteCollectionMessage = function (IndexInt) {
        collectLinks.splice(IndexInt,1);
        localStorage.CollectionCount = collectLinks.length;

        for(var ss=0;ss<collectLinks.length;++ss){
            var keyString = 'Item_' + ss;

            var newContent = collectLinks.slice(ss, ss+1);
            localStorage.setItem(keyString,newContent[0]);
        }
    }


    //Return array which present The Collections
    this.getCollectionDefinition_array = function () {
        var rtnArray = new Array();

        for(var s=0;s<collectLinks.length;++s){
            var collectionName = collectLinks[s].split(';')[0];
            var collectionLink = collectLinks[s].split(';')[1];
            var collectionImg  = localStorage.getItem(localStorage.getItem(collectionLink));

            var CollectionHead = new Object();

            CollectionHead.websiteName = collectionName;
            CollectionHead.websiteLink = collectionLink;
            CollectionHead.webimgSrc   = collectionImg;

            rtnArray.push(CollectionHead);
        }

        return rtnArray;
    }

    //Return the content of special collection
    this.getCollectionContent_array = function (numInt) {
        var rtnArray = new Array();

        var collectionSpecial = collectLinks[numInt].split(';');
        for(var s=1;s<collectionSpecial.length - 1;++s){
            var websiteLink = collectionSpecial[s];

            var websiteunit = new WebsiteMsgUnit(websiteLink);
            rtnArray.push(websiteunit);
        }

        return rtnArray;
    }




    //The MsgUnit of Website accroding the website link
    function WebsiteMsgUnit (websiteLink_string) {
        this.websiteLink = websiteLink_string;
        this.websiteName = localStorage.getItem(websiteLink_string);
        this.webimgSrc = localStorage.getItem(this.websiteName);
    }

}

function initthistest() {
    StoreManagePort = new CollectionsManage();

    for(var a=0;a<5;++a){
        StoreManagePort.addCollections('Items_' + a);

        for(var b=0;b<20;++b){
            StoreManagePort.addWebsiteItemToDatabase('#a'+a+b,"Web_"+a+b,'#none')
            StoreManagePort.addItemToSpecialCollection(a,'#a'+a+b);
        }
    }
}
