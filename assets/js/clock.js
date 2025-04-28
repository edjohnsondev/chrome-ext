$(function() {
    var appendEls,
        attachEvents,
        enableTransitions,
        nthDigit,
        reset,
        setAttributes,
        setClasses,
        startClock,
        tick,
        updateDateDisplay;

    nthDigit = function(intVal, nth) {
        return parseInt(intVal.toString().substr(nth, 1), 10);
    };

    setAttributes = function() {
        var now       = new Date(),
            hours     = now.getHours(),
            minutes   = now.getMinutes(),
            seconds   = now.getSeconds();

        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
        $('.js-clock[data-dur="hh"]').attr('data-cur', hours + 1);

        if (minutes < 10) {
            $('.js-clock[data-dur="mm"]').attr('data-cur', 1);
            $('.js-clock[data-dur="m"]').attr('data-cur', minutes + 1);
        } else {
            $('.js-clock[data-dur="mm"]').attr('data-cur', nthDigit(minutes, 0) + 1);
            $('.js-clock[data-dur="m"]').attr('data-cur', nthDigit(minutes, 1) + 1);
        }

        if (seconds < 10) {
            $('.js-clock[data-dur="ss"]').attr('data-cur', 1);
            $('.js-clock[data-dur="s"]').attr('data-cur', seconds + 1);
        } else {
            $('.js-clock[data-dur="ss"]').attr('data-cur', nthDigit(seconds, 0) + 1);
            $('.js-clock[data-dur="s"]').attr('data-cur', nthDigit(seconds, 1) + 1);
        }
    };

    tick = function(el) {
        var active = el.find('.dial--active');
        active
            .removeClass('dial--active')
            .addClass('dial--flipped');
        active.next()
            .removeClass('dial--next')
            .addClass('dial--active');
        active.next().next()
            .addClass('dial--next')
            .removeClass('dial--later');

        if (active.next().hasClass('dial--last')) {
            setTimeout(function() {
                reset(el);
            }, 300);
        }
    };

    enableTransitions = function(el) {
        el.removeClass('transitions-off');
    };

    reset = function(el) {
        el.addClass('transitions-off')
          .children().removeClass('dial--flipped dial--active dial--next dial--later');
        el.children().first().addClass('dial--active');
        el.children().eq(1).addClass('dial--next');
        el.children(':nth-child(n+3)').addClass('dial--later');

        setTimeout(function() {
            enableTransitions(el);
        }, 300);

        tick(el);

        var dur = el.attr('data-dur');
        if (dur === 's')  $(document).trigger('10s');
        if (dur === 'ss') $(document).trigger('60s');
        if (dur === 'm')  $(document).trigger('10m');
        if (dur === 'mm') $(document).trigger('60m');
    };

    setClasses = function(el) {
        var curIndex = parseInt(el.attr('data-cur'), 10);
        el.children(':nth-child(' + curIndex + ')').addClass('dial--active');
        el.children(':nth-child(' + (curIndex + 1) + ')').addClass('dial--next');
        el.children(':lt(' + curIndex + ')').addClass('dial--flipped');
        el.children(':gt(' + (curIndex + 1) + ')').addClass('dial--later');
        tick(el);
    };

    startClock = function() {
        setInterval(function() {
            tick($('.js-clock[data-dur="s"]'));
        }, 1000);
    };

    appendEls = function() {
        $('.js-clock').each(function() {
            var el    = $(this),
                start = parseInt(el.data('start'), 10),
                end   = parseInt(el.data('end'), 10),
                k;

            el.empty();

            for (k = start; k <= end; k++) {
                var next = (k + 1 > end) ? 0 : k + 1;
                el.append('<div class="dial"><span>' + k + '</span><span>' + next + '</span></div>');
            }

            el.prepend('<div class="dial"><span>0</span><span>0</span></div>');
            el.append('<div class="dial dial--last"><span>0</span><span>0</span></div>');

            setClasses(el);
        });
    };

    attachEvents = function() {
        $('.js-clock').on('click', function(e) {
            e.preventDefault();
            tick($(this));
        });

        $(document).on('10s', function() {
            tick($('.js-clock[data-dur="ss"]'));
        });
        $(document).on('60s', function() {
            tick($('.js-clock[data-dur="m"]'));
        });
        $(document).on('10m', function() {
            tick($('.js-clock[data-dur="mm"]'));
            $(document).on('60m', function() {});
            tick($('.js-clock[data-dur="hh"]'));
        });
    };

    updateDateDisplay = function() {
        var now       = new Date(),
            days      = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'],
            months    = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
            dayName   = days[now.getDay()],
            monthName = months[now.getMonth()],
            dateNum   = now.getDate();

        $('#day-name').text(dayName);
        $('#day-number').text(dateNum);
        $('#month-name').text(monthName);
    };

    // Initialize
    setAttributes();
    appendEls();
    attachEvents();
    startClock();
    updateDateDisplay();
    setInterval(updateDateDisplay, 60000);
});