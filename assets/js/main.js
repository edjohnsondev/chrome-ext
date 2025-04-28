$(function() {
    const fetchJoke = (callback) => {
        $.ajax({
            url: 'https://icanhazdadjoke.com/',
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            success: (response) => {
                const joke = formatJoke(response.joke);
                callback(joke);
            },
            error: () => callback('Oops! Failed to load a joke.')
        });
    };

    const fetchFact = () => {
        $.ajax({
            url: 'https://uselessfacts.jsph.pl/random.json?language=en',
            method: 'GET',
            success: (response) => {
                const text = response?.text || 'No fact available.';
                $('#fact').hide()
                           .text(`Did you know? ${text}`)
                           .fadeIn(500);
            },
            error: () => {
                $('#fact').hide()
                           .text('Failed to load fact.')
                           .fadeIn(500);
            }
        });
    };

    const formatJoke = (jokeText) => {
        const match = jokeText.match(/(.+?[.?!])\s+(.*)/);
        return match
            ? `${match[1]}<br><strong>${match[2]}</strong>`
            : jokeText;
    };

    const getRandomPastelColor = () => {
        const r = Math.floor(Math.random() * 100) + 155;
        const g = Math.floor(Math.random() * 100) + 155;
        const b = Math.floor(Math.random() * 100) + 155;
        return rgbToHex(r, g, b);
    };

    const modifyPastelColor = (baseColor) => {
        let r = parseInt(baseColor.slice(1, 3), 16);
        let g = parseInt(baseColor.slice(3, 5), 16);
        let b = parseInt(baseColor.slice(5, 7), 16);
        r = clamp(r + randomOffset(), 155, 255);
        g = clamp(g + randomOffset(), 155, 255);
        b = clamp(b + randomOffset(), 155, 255);
        return rgbToHex(r, g, b);
    };

    const setPastelGradient = () => {
        const color1 = getRandomPastelColor();
        const color2 = modifyPastelColor(color1);
        const color3 = getRandomPastelColor();
        const angle  = Math.floor(Math.random() * 360);
        $('#gradient-background').css({
            background:       `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`,
            'background-size': '400% 400%'
        });
    };

    const randomOffset = () => Math.floor(Math.random() * 81) - 40;
    const clamp        = (v, min, max) => Math.min(Math.max(v, min), max);
    const rgbToHex     = (r, g, b) => {
        const toHex = (n) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const createJokeBox = (content) => $(`
        <div class="col-xl-4 col-lg-6 col-12">
            <div class="joke-box" id="joke" style="display:none;">
                ${content}
            </div>
        </div>
    `);

    // initial load
    fetchJoke((j) => $('#joke').html(j));
    fetchFact();
    setPastelGradient();

    // new joke on plus-click
    $('.joke-new').on('click', () => {
        fetchJoke((j) => {
            const box = createJokeBox(j);
            $('.joke-new').parent().before(box);
            box.find('.joke-box').fadeIn(400);
        });
    });
});