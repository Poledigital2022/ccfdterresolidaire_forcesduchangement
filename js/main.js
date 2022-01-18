(function ($) {

    function countUp(block, num, duration){
        var interval = duration / num;
        var i = 0,
            k = 1;
        if( interval < 3 ){
            k = 250;
        }
        if( interval < 1){
            k = 500;
        }
        var count = setInterval(function(){
            if( i > num ){
                block.text(num.toLocaleString('ru'));
                clearInterval(count);
            }else{
                block.text(i.toLocaleString('ru'));
                i += 1 * k;
            }
        },interval);

    }
    function countPrecent(block, num, duration){
        var interval = duration / num;
        var i = 0,
            k = 1;
        if( interval < 3 ){
            k = 3;
        }
        if( interval < 1){
            k = 5;
        }
        var count = setInterval(function(){
            if( i > num ){
                block.text(num+' %');
                clearInterval(count);
            }else{
                block.text(i+' %');
                i += 1 * k;
            }
            if( i > 10 ){
                block.removeClass('text-hidden');
            }
        },interval);

    }

    function donation(block){
        var sum = parseInt(block.attr('data-sum')),
            goal = parseInt(block.attr('data-goal')),
            percent = parseInt(sum / ( goal / 100 ));
        //block.find('.text-block--progress span').text(sum.toLocaleString());
        countUp(block.find('.text-block--progress span'), sum, 2000);
        block.find('.text-block--goal span').text(goal.toLocaleString('ru'));
        //block.find('.numb').text(percent + ' %');
        countPrecent(block.find('.numb'), percent, 2000);
        block.find('.line').css({width: percent+'%'});
        if( block.find('.countdown').length ){
            var endDate =  block.find('.countdown').attr('data-end'),
            days = countdown(endDate);
            block.find('.countdown span').text(days);
            if(days <= 0){
                block.find('.countdown').hide();
            }
            if(days == 1){
                block.find('.countdown').text('1 jour restant');
            }
        }
    }

    function countdown(end){
        var now = Date.now(),
            end = Date.parse(end),
            count = Math.ceil(( end - now ) / 1000 / 60 / 60 / 24);
            count -= Math.floor(count/7);
        return count;
    }

    function donationScroll(block){
        var scrollH = $(window).scrollTop(),
            winH = $(window).height(),
            blockTop = block.offset().top;
        if( blockTop < scrollH + winH * 0.8 && !block.hasClass('is-animated')){
            block.addClass('is-animated');
            donation(block);
        }
    }

    function SiteCookie(){
        if(Cookies.get('agree') ){
            $('.cookie-block').remove();
        }else{
            $('.video-link').click();

            $('.cookie-block .cookie-link').on('click', function(){
                Cookies.set('agree','1');
                $('.cookie-block').addClass('closed');
                setTimeout(function(){
                    $('.cookie-block').remove();
                },1000);
            });
        }
    }

    $(document).ready(function () {

        //
        //$('#map').bind("DOMSubtreeModified",function(){
        //    console.log(1111);
        //});

        $(".popup-block .inner-wrapper,.slider-block .slide-text").mCustomScrollbar();
        if ( $(window).width() < 768){
            $(".slider-block .slide-text").mCustomScrollbar("disable",true);
        }else{
            $(".slider-block .slide-text").mCustomScrollbar("update");
        }

        $('.btn').hover(function(e){
            var then = $(this);
            var x = e.pageX - then.offset().left;
            var y = e.pageY - then.offset().top;
            then.find('.hover').css({top: y + 'px', left: x + 'px'});
        },function(e){
            var then = $(this);
            var x = e.pageX - then.offset().left;
            var y = e.pageY - then.offset().top;
            then.find('.hover').css({top: y + 'px', left: x + 'px'});
        });


        //popups

        $('.popup-link').on('click', function(){
            var then = $(this),
                target = then.attr('data-target');
            $('html').addClass('no-scroll');
            $(target +', .popup-wrapper').fadeIn(500);
            if( then.hasClass('video-link') ){
                if( !$('.popup-block--video iframe').hasClass('is-true') ){
                    var src = $(this).attr('data-video');
                    player.loadVideoById({
                        videoId: src
                    });
                    player.playVideo();
                    player.unMute();
                    $('.popup-block--video iframe').addClass('is-true');
                }else{
                    player.playVideo();
                }
            }
            return false;
        });

        $('.popup-block .close,.popup-wrapper').on('click', function(){
            $('html').removeClass('no-scroll');
            player.pauseVideo();
            $('.popup-block, .popup-wrapper').fadeOut(500);
        });

        //slider

        $('.block-02 .slider-block').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true,
            prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
            nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>',
            asNavFor: '.block-02 .slider-bottom',
            speed: 700,
            autoplay: true,
            autoplaySpeed: 10000,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        autoplay: false,
                        arrows: false,
                        adaptiveHeight: true,
                        dots: true
                    }
                }
            ]
        });

        $('.block-02 .more-block').on('click', function(){
            $(this).closest('.text-block').find('.slide-text .mobile-hidden').toggleClass('mobile-hidden mobile-visible');
            $(this).remove();
            $('.block-02 .slider-block').slick('setPosition',null, null, true);
        });

        $('.block-02 .slider-block').on('beforeChange', function(event, slick, currentSlide, nextSlide){
            var topSlideActive = $('.block-02 .slider-top .active').index();
            if( topSlideActive != nextSlide && $(window).width() > 767 ){
                $('.block-02 .slider-top .active').removeClass('active');
                $('.block-02 .slider-top li:eq('+nextSlide+')').addClass('active');
            }
        });
        $('.block-02 .slider-bottom').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.block-02 .slider-block',
            speed: 700,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        draggable: false,
                        swipe: false
                    }
                }
            ]

        });
        $('.block-02 .slider-top li').on('click', function(){
            var then = $(this),
                indexSlide = then.index();
            if( !then.hasClass('active') && $(window).width() > 767 ){
                $('.block-02 .slider-top .active').removeClass('active');
                then.addClass('active');
                $('.block-02 .slider-block').slick('slickGoTo', indexSlide);
            }
        });

        $('.sliders-wrapper').hover(function(){
            $('.block-02 .slider-block').slick('slickSetOption','autoplay', false, false)
        },function(){
            $('.block-02 .slider-block').slick('slickSetOption','autoplay', true, true)
        });

        if ( $(window).width() < 768 &&  !$('.block-02 .slider-top.slick-initialized').length){
            $('.block-02 .slider-top').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false,
                fade: true,
                asNavFor: '.block-02 .slider-block,.block-02 .slider-bottom',
                prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
                nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>'
            });
        }else if( $(window).width() > 767 && $('.block-02 .slider-top.slick-initialized').length ){
            $('.block-02 .slider-top.slick-initialized').slick('unslick');
        }

        if ( $(window).width() < 768 &&  !$('.block-02 .slider-bottom ul.slick-initialized').length){
            $('.block-02 .slider-bottom ul').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                fade: true,
                adaptiveHeight: true,
                prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
                nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>'
            });
        }else if( $(window).width() > 767 && $('.block-02 .slider-bottom ul.slick-initialized').length ){
            $('.block-02 .slider-bottom ul.slick-initialized').slick('unslick');
        }
        if ( $(window).width() < 768 &&  !$('.block-03 ul.slick-initialized').length){
            $('.block-03 ul').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                fade: true,
                adaptiveHeight: true,
                prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
                nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>'
            });
        }else if( $(window).width() > 767 && $('.block-03 ul.slick-initialized').length ){
            $('.block-03 ul.slick-initialized').slick('unslick');
        }

        if ( $(window).width() < 768 &&  !$('.block-04 ul.slick-initialized').length){
            $('.block-04 ul').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                fade: true,
                adaptiveHeight: true,
                prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
                nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>'
            });
        }else if( $(window).width() > 767 && $('.block-04 ul.slick-initialized').length ){
            $('.block-04 ul.slick-initialized').slick('unslick');
        }

        $('.block-06 ul').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
            nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>',
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
        if( $(window).width() < 992 ){
            $('.parallax').toggleClass('parallax parallax-none');
        }else{
            $('.parallax-none').toggleClass('parallax parallax-none');
        }

        countdown('2019-04-15');

        $('input,textarea').on('input',function(){
            if( $(this).val() != '' ){
                $(this).addClass('not-empty');
            }else{
                $(this).removeClass('not-empty');
            }
        });
        if ( $('textarea').length && $('textarea').attr('maxlength').length ){
            $('textarea').each(function(){
                var then = $(this),
                    maxLength = then.attr('maxlength'),
                    id = then.attr('id');
                $('.text-count[data-id="'+id+'"]').text(maxLength);
                then.on('input', function(){
                    var value = then.val().length;
                    $('.text-count[data-id="'+id+'"]').text(maxLength-value);
                });
            });
        }

        $('.form-block .toggle-btn').on('click', function(){
            $(this).closest('.form-block').toggleClass('is-closed');
        });

        $('.scroll-block').on('click', function(){
            var target = $(this).attr('data-target');
            $('html, body').animate({ scrollTop: $('#'+target).offset().top },500);
            return false;
        });

    });

    $(window).load(function(){
        $('html').addClass('is-load');
        SiteCookie();

        donation($('.donate-block--header'));
        donationScroll($('.block-02 .donate-block'));

        //map

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 6
        });
        var markerImg = 'img/marker.png';
        var geocoder = new google.maps.Geocoder();
        var location = "France";
        geocoder.geocode({ 'address': location }, function(results, status){
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
            }
        });
        map.addListener('bounds_changed', function() {
            $('#map .initialized').attr('class','');
            $('#map .message-block').remove();
            $('#map .gm-style-pbc').prev().addClass('bottom-layer');
            //var open = $('.marker-wrapper.open');
            //var then = open,
            //    to = then.attr('data-to');
            //$('.'+to).fadeOut(300);
            //setTimeout(function(){
            //    var top = then[1].offsetTop,
            //        left = then[1].offsetLeft;
            //    $('.'+to).addClass('no-animate').css({'top': top, 'left': left});
            //    $('.'+to).removeClass('no-animate');
            //    $('.'+to).show();
            //},500);
        });
        $.getJSON('actions/users.php',{format: 'json'}).done(function(data){
            var users = data;
            var marker = [];
            for( var i = 0; i < users.length; i++ ){

                marker[i] = new google.maps.Marker({
                    position: {lat: parseFloat(users[i].lat), lng:  parseFloat(users[i].lng)},
                    map: map,
                    icon: markerImg
                });
                marker[i].setValues({type: "point", id: "marker-"+users[i].id});
                var markerId = marker[i].get("id");
                marker[i].icon = markerImg +'?'+ markerId;
                marker[i].pathIcon = marker[i].icon,
                    marker[i].authorName = users[i].nom,
                    marker[i].message = users[i].message;

                marker[i].addListener('click', function() {
                    var then = $(this);
                    var image = $('#map img[src="'+then[0].pathIcon+'"]'),
                        markerWrapper = image.parent(),
                        t = markerWrapper.css('top'),
                        l = markerWrapper.css('left');
                    if( !markerWrapper.hasClass('initialized') ){
                        markerWrapper.addClass('initialized marker-wrapper marker-wrapper'+then[0].id).attr('data-to','map-message-'+then[0].id);
                        markerWrapper.after('<div class="message-block map-message-'+then[0].id+'"><div class="message">'+then[0].message+'</div><div class="author">'+then[0].authorName+'</div></div>');
                        $('.map-message-'+then[0].id).css({'top': t, 'left': l });
                    }
                    if( !markerWrapper.hasClass('open')){
                        $('#map .open').removeClass('open');
                        setTimeout(function(){
                            markerWrapper.addClass('open');
                        },100);
                    }
                    return false;
                });
            }
        });

        $('#formulaire-form').submit(function(){
            var form = $(this);
            var geocoder = new google.maps.Geocoder(),
                address = $('#postal').val();
            geocoder.geocode( { 'address': address, componentRestrictions: {
                country: 'FR'
            }}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $('input[name="lat"]').val(results[0].geometry.location.lat());
                    $('input[name="lng"]').val(results[0].geometry.location.lng());

                    $.ajax({
                        type: 'POST',
                        cache: false,
                        url: 'actions/form_submit.php',
                        dataType: 'json',
                        data: form.serialize()
                    }).done(function(response) {
                        if (response.success) {
                            form.closest('.form-block').addClass('is-submit');
                            form.fadeOut(500);
                            var name = $('#formulaire-form input[name="prenom"]').val(),
                                lat =  $('#formulaire-form input[name="lat"]').val(),
                                lng = $('#formulaire-form input[name="lng"]').val(),
                                message = $('#formulaire-form textarea').val();
                            //markerImg = 'img/marker.png',
                            //map = $('#map');
                            var markerNew = new google.maps.Marker({
                                position: {lat: parseFloat(lat), lng:  parseFloat(lng)},
                                map: map,
                                icon: markerImg
                            });
                            markerNew.setValues({type: "point", id: "marker-new"});
                            var markerId = markerNew.get("id");
                            markerNew.icon = markerImg +'?'+ markerId;

                            markerNew.addListener('click', function() {
                                var then = $(this);
                                var image = $('#map img[src="'+markerNew.icon+'"]'),
                                    markerWrapper = image.parent(),
                                    t = markerWrapper.css('top'),
                                    l = markerWrapper.css('left');
                                if( !markerWrapper.hasClass('initialized') ){
                                    markerWrapper.addClass('initialized marker-wrapper marker-wrapper'+then[0].id).attr('data-to','map-message-'+then[0].id);
                                    markerWrapper.after('<div class="message-block  map-message-'+then[0].id+'"><div class="message">'+message+'</div><div class="author">'+name+'</div></div>');
                                    $('.map-message-'+then[0].id).css({'top': t, 'left': l });
                                }
                                if( !markerWrapper.hasClass('open')){
                                    $('#map .open').removeClass('open');
                                    setTimeout(function(){
                                        markerWrapper.addClass('open');
                                    },100);
                                }
                            });
                        }
                        else if (response.errors) {
                            console.log('error-submit');
                        }
                    });
                }
            });
            return false;
            e.preventDefault();
        });

        $('#map').on('click','.marker-wrapper', function(){
            $('#map .marker-wrapper').removeClass('open');
        });

        //end map

        $('.cookie-block').removeClass('is-hidden');

        $('.cookie-link').on('click', function(){
            $('.cookie-block').addClass('is-hidden');
            setTimeout(function(){
                $('.cookie-block').remove();
            },1000);
        });

    });

    $(window).on('resize', function(){
        if( $(window).width() < 992 ){
            $('.parallax').toggleClass('parallax parallax-none');
        }else{
            $('.parallax-none').toggleClass('parallax parallax-none');
        }
    });

    $(window).scroll(function(){ //parallax
        var scrollH = $(window).scrollTop(),
            winH = $(window).height();
        $('.parallax').each(function(){
            var n = 1;
            if( $(this).hasClass('p-down') ){
                n = -1;
            }
            $(this).css({
                '-webkit-transform': 'translate(0,'+(0-(scrollH*.05*n))+'px'+')',
                '-ms-transform':'translate(0,'+(0-(scrollH*.05*n))+'px'+')',
                'transform':'translate(0,'+(0-(scrollH*.05*n))+'px'+')'
            });
        });
        donationScroll($('.block-02 .donate-block'));

        if ( $(window).width() < 768 &&  !$('.block-02 .slider-top.slick-initialized').length){
            $('.block-02 .slider-top').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false,
                fade: true,
                asNavFor: '.block-02 .slider-block,.block-02 .slider-bottom',
                prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
                nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>'
            });
        }else if( $(window).width() > 767 && $('.block-02 .slider-top.slick-initialized').length ){
            $('.block-02 .slider-top.slick-initialized').slick('unslick');
        }
        if ( $(window).width() < 768 &&  !$('.block-02 .slider-bottom ul.slick-initialized').length){
            $('.block-02 .slider-bottom ul').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                fade: true,
                arrows: true,
                adaptiveHeight: true,
                prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
                nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>'
            });
        }else if( $(window).width() > 767 && $('.block-02 .slider-bottom ul.slick-initialized').length ){
            $('.block-02 .slider-bottom ul.slick-initialized').slick('unslick');
        }

        if ( $(window).width() < 768 &&  !$('.block-03 ul.slick-initialized').length){
            $('.block-03 ul').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                fade: true,
                adaptiveHeight: true,
                prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
                nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>'
            });
        }else if( $(window).width() > 767 && $('.block-03 ul.slick-initialized').length ){
            $('.block-03 ul.slick-initialized').slick('unslick');
        }

        if ( $(window).width() < 768 &&  !$('.block-04 ul.slick-initialized').length){
            $('.block-04 ul').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                fade: true,
                adaptiveHeight: true,
                prevArrow: '<button type="button" class="slick-prev icon-arrow-left"></button>',
                nextArrow: '<button type="button" class="slick-next icon-arrow-right"></button>'
            });
        }else if( $(window).width() > 767 && $('.block-04 ul.slick-initialized').length ){
            $('.block-04 ul.slick-initialized').slick('unslick');
        }

        if ( $(window).width() < 768){
            $(".slider-block .slide-text").mCustomScrollbar("disable",true);
        }else{
            $(".slider-block .slide-text").mCustomScrollbar("update");
        }

    });

})(jQuery);;
//= partials/app.js