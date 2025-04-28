// assets/js/main.js
$(function() {
    // Helpers for gradient animation
    function randByte() { return Math.random() * 100 + 155; }
    function toHex(n)   { return Math.round(n).toString(16).padStart(2, '0'); }
    function lerp(a,b,t){ return a + (b - a) * t; }

    // Build 3 pastel color stops
    function makeStops() {
        return [
            [randByte(), randByte(), randByte()],
            [randByte(), randByte(), randByte()],
            [randByte(), randByte(), randByte()]
        ];
    }

    function stopsCss(stops) {
        return stops
            .map(c => `#${toHex(c[0])}${toHex(c[1])}${toHex(c[2])}`)
            .join(', ');
    }

    // State for background animation
    let gradA = makeStops(),
        gradB = makeStops(),
        start = performance.now();

    const morphDuration = 1000000;     // 20s color morph
    const rotateSpeed   = 2 * 360 / 20000; // 2 rotations in morphDuration

    function tick(now) {
        let t = (now - start) / morphDuration;
        if (t >= 1) {
            gradA = gradB;
            gradB = makeStops();
            start = now;
            t = 0;
        }

        // interpolate stops
        const interp = gradA.map((cA, i) => {
            const cB = gradB[i];
            return [
                lerp(cA[0], cB[0], t),
                lerp(cA[1], cB[1], t),
                lerp(cA[2], cB[2], t)
            ];
        });

        // compute rotation angle
        const angle = ((now - start) * rotateSpeed) % 360;

        // subtle background-size oscillation
        const size = 400 + 100 * Math.sin((now / morphDuration) * Math.PI * 2);

        $('#gradient-background').css({
            'background-image': `linear-gradient(${angle.toFixed(1)}deg, ${stopsCss(interp)})`,
            'background-size': `${size.toFixed(1)}% ${size.toFixed(1)}%`
        });

        requestAnimationFrame(tick);
    }

    // Start the background animation
    requestAnimationFrame(tick);

    // ——— Fact, Joke, and Dog Image ———

    function formatJoke(txt) {
        const m = txt.match(/(.+?[.?!])\s+(.*)/);
        return m ? `${m[1]}<br><strong>${m[2]}</strong>` : txt;
    }

    function fetchJoke() {
        $.ajax({
            url: 'https://icanhazdadjoke.com/',
            headers: { Accept: 'application/json' },
            success: res => {
                $('#joke').html(formatJoke(res.joke));
            },
            error: () => {
                $('#joke').html('Oops! Failed to load a joke.');
            }
        });
    }

    function fetchFact() {
        $.ajax({
            url: 'https://uselessfacts.jsph.pl/random.json?language=en',
            success: res => {
                const t = res?.text || 'No fact available.';
                $('#fact').hide().text(`Did you know? ${t}`).fadeIn(500);
            },
            error: () => {
                $('#fact').hide().text('Failed to load fact.').fadeIn(500);
            }
        });
    }

    function fetchDogImage() {
        $.ajax({
            url: 'https://dog.ceo/api/breeds/image/random',
            success: res => {
                $('#dog-image').attr('src', res.message);
            },
            error: () => {
                $('#dog-image').attr('alt', 'Failed to load dog image.');
            }
        });
    }

    // Initialize on page load
    fetchJoke();
    fetchFact();
    fetchDogImage();
});
