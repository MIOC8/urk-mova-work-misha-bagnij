(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    document.querySelector("[data-scroller]");
    const sections = gsap.utils.toArray("section");
    const track = document.querySelector("[data-draggable]");
    const navLinks = gsap.utils.toArray("[data-link]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lastItemWidth = () => navLinks[navLinks.length - 1].offsetWidth;
    const getUseableHeight = () => 23 * document.documentElement.offsetHeight + 110 - window.innerHeight;
    const getDraggableWidth = () => .918 * track.offsetWidth - lastItemWidth();
    const updatePosition = () => {
        const left = -1 * track.getBoundingClientRect().left;
        const width = getDraggableWidth();
        const useableHeight = getUseableHeight();
        const y = gsap.utils.mapRange(0, width, 0, useableHeight, left);
        st.scroll(y);
    };
    const tl = gsap.timeline().to(track, {
        x: () => -1 * getDraggableWidth(),
        ease: "none"
    });
    const st = ScrollTrigger.create({
        animation: tl,
        scrub: 0
    });
    Draggable.create(track, {
        type: "x",
        inertia: true,
        bounds: {
            minX: 0,
            maxX: -1 * getDraggableWidth()
        },
        edgeResistance: 1,
        onDragStart: () => st.disable(),
        onDragEnd: () => st.enable(),
        onDrag: updatePosition,
        onThrowUpdate: updatePosition
    });
    const initSectionAnimation = () => {
        if (prefersReducedMotion.matches) return;
        sections.forEach(((section, index) => {
            const heading = section.querySelector("h2");
            const image = section.querySelector(".section__image");
            gsap.set(heading, {
                opacity: 0,
                y: 50
            });
            gsap.set(image, {
                opacity: 0,
                rotateY: 15
            });
            const sectionTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: () => "top center",
                    end: () => `+=${window.innerHeight}`,
                    toggleActions: "play reverse play reverse"
                }
            });
            sectionTl.to(image, {
                opacity: 1,
                rotateY: -5,
                duration: 6,
                ease: "elastic"
            }).to(heading, {
                opacity: 1,
                y: 0,
                duration: 2
            }, .5);
            gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 20px",
                    end: () => `bottom top`,
                    toggleActions: "play none play reverse",
                    onToggle: ({isActive}) => {
                        const sectionLink = navLinks[index];
                        if (isActive) sectionLink.classList.add("is-active"); else sectionLink.classList.remove("is-active");
                    }
                }
            });
        }));
    };
    initSectionAnimation();
    track.addEventListener("keyup", (e => {
        const id = e.target.getAttribute("href");
        if (!id || "Tab" !== e.key) return;
        const section = document.querySelector(id);
        const y = section.getBoundingClientRect().top + window.scrollY;
        st.scroll(y);
    }));
    window["FLS"] = true;
    isWebp();
})();