(function(){
    var pageNum = 10;
    var pageLength = $('.page a').length;
    var curPage = 1;

    //跳转页码方法:
    function changePage(that,whichOne){

        //获取到当前页码数:
        whichOne = whichOne<=0?1:whichOne;
        whichOne = whichOne || parseInt(that.text());

        //如果页码>=4，页码发生变化:
        if(whichOne >= 4 && whichOne < pageNum-3){
            if(whichOne < pageNum-3){

                $('.page a').each(function(index,ele){
                    if(index <= 3){
                        $(this).text(whichOne-2+index);
                        if(parseInt($(ele).text()) >= pageNum-3){
                            $('.page span').css('display','none');
                        }else {
                            $('.page span').css('display','inline');
                        }
                    }

                });
            }
        }else if(whichOne >= pageNum-3){

            $('.page a').each(function(index,ele){

                if(index <= 3){
                    $(this).text(pageNum-3-3+index);
                    $('.page span').css('display','none');
                }

            });
        }else {
            $('.page a').each(function(index,ele){
                if(index <= 3){
                    $(this).text(index+1);

                    if(parseInt($(ele).text()) >= pageNum-3){
                        $('.page span').css('display','none');
                    }else {
                        $('.page span').css('display','inline');
                    }
                }
            });
        }

        //当前点击页码选中状态:
        $('.page a').each(function(index,ele){
            if(whichOne == $(ele).text()){
                $(ele).addClass('active').siblings('a').removeClass('active');
            }
        });

        curPage = whichOne;
        //当跳转页码时，把正在加载显示，模块隐藏:
        $('.loading').css('display','block');
        $('.movieCon').css('display','none');
    }

    //初始化页码:
    initPage();
    function initPage(){
        $('.page a').each(function(index,ele){

            //前4页的页码：
            $(this).text(index+1);

            //后3页的页码:
            if(index>3) $(this).text(pageNum-(pageLength-1-index));

        });
    }

    //给每一页添加跳转页码事件:
    $('.page a').each(function(index,ele){
        $(this).click(function(){
            changePage($(this));
            getData(curPage);
        });
    });

    //首页:
    $('.box>a:nth-child(1)').click(function(){
        if(curPage == 1 || curPage == pageNum) return;
        changePage(null,1);
        getData(curPage);
    });

    //上一页:
    $('.box>a:nth-child(2)').click(function(){
        if(curPage == 1) return;
        curPage = curPage<=0?1: --curPage;
        changePage(null,curPage);
        getData(curPage);
    });

    //下一页:
    $('.box>a:nth-child(4)').click(function(){
        if(curPage == pageNum) return;
        curPage = curPage>=pageNum?pageNum:++curPage;
        changePage(null,curPage);
        getData(curPage);

    });

    //格式查询参数:
    function json2str(data) {
        var arr=[];
        for(var key in data){
            arr.push(key+'='+data[key]);
        }
        return encodeURI(arr.join("&"));
    }

    //再次初始化页码，加载数据：
    function getData(start,init){

        var url = 'https://api.douban.com/v2/movie/top250';
        var movieData = null;

        var movieParams = json2str({
            apiKey:'0b2bdeda43b5688921839c8ecb20399b',
            start:(start-1)*5,
            count:5
        });

        $.ajax({
            type:'get',
            url:url+'?'+movieParams,
            dataType:"jsonp",
            success:function(res){

                pageNum = Math.ceil(res.total/5);
                movieData = res;
                var tpl = template('movie',movieData);
                $('.movieCon').html(tpl);

                //根据数据条数初始化页码:
                if(init) init();
                //当数据加载完时，把正在加载隐藏，模块显示:
                $('.loading').css('display','none');
                $('.movieCon').css('display','block');
            },
            error:function(code){
                console.log(code);
            }
        });
    }
    getData(curPage,function(){
        initPage();
    });
})();
