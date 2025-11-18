
/**
 * Habilita scroll mediante arrastre (mouse + touch)
 * para cualquier contenedor scrollable.
 */

export function enableDragScroll(wrapper: HTMLElement): void {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;

    // --- MOUSE ---
    wrapper.addEventListener("mousedown", (e: MouseEvent) => {
        isDragging = true;

        wrapper.style.cursor = "grabbing";

        startX = e.pageX - wrapper.offsetLeft;
        startY = e.pageY - wrapper.offsetTop;

        scrollLeft = wrapper.scrollLeft;
        scrollTop = wrapper.scrollTop;

        e.preventDefault();
    });

    wrapper.addEventListener("mousemove", (e: MouseEvent) => {
        if (!isDragging) return;

        const x = e.pageX - wrapper.offsetLeft;
        const y = e.pageY - wrapper.offsetTop;

        wrapper.scrollLeft = scrollLeft - (x - startX);
        wrapper.scrollTop = scrollTop - (y - startY);
    });

    wrapper.addEventListener("mouseup", () => {
        isDragging = false;
        wrapper.style.cursor = "grab";
    });

    wrapper.addEventListener("mouseleave", () => {
        isDragging = false;
        wrapper.style.cursor = "grab";
    });

    // --- TOUCH ---
    wrapper.addEventListener("touchstart", (e: TouchEvent) => {
        isDragging = true;

        const touch = e.touches[0];
        if (!touch) return;

        startX = touch.pageX - wrapper.offsetLeft;
        startY = touch.pageY - wrapper.offsetTop;

        scrollLeft = wrapper.scrollLeft;
        scrollTop = wrapper.scrollTop;
    }, { passive: true });

    wrapper.addEventListener("touchmove", (e: TouchEvent) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        if (!touch) return;

        const x = touch.pageX - wrapper.offsetLeft;
        const y = touch.pageY - wrapper.offsetTop;

        wrapper.scrollLeft = scrollLeft - (x - startX);
        wrapper.scrollTop = scrollTop - (y - startY);

        e.preventDefault(); // evita scroll del body
    }, { passive: false });

    wrapper.addEventListener("touchend", () => {
        isDragging = false;
        wrapper.style.cursor = "grab";
    });
}
