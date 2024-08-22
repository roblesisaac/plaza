import { ref, onMounted, onUnmounted } from 'vue';

export default function useScreen() {
    const extraSmall = '(max-width: 32em)';
    const small = '(min-width: 32.0625em) and (max-width: 47.9375em)';
    const medium = '(min-width: 48em) and (max-width: 63.9375em)';
    const screenSize = ref(getScreenSize());

    const sizes = ['extraSmall', 'small', 'medium', 'large'];

    function getScreenSize() {
        if (window.matchMedia(extraSmall).matches) {
            return 'extraSmall';
        } else if (window.matchMedia(small).matches) {
            return 'small';
        } else if (window.matchMedia(medium).matches) {
            return 'medium';
        } else {
            return 'large';
        }
    }

    const updateScreenSize = () => {
        screenSize.value = getScreenSize();
    };

    onMounted(() => {
        window.addEventListener('resize', updateScreenSize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateScreenSize);
    });

    function isLessThan(screenSizeToTest) {
        const currentScreenSizeIndex = sizes.indexOf(screenSize.value);
        const screenSizeIndex = sizes.indexOf(screenSizeToTest);

        return currentScreenSizeIndex < screenSizeIndex;
    }

    function isGreaterThan(screenSizeToTest) {
        const currentScreenSizeIndex = sizes.indexOf(screenSize.value);
        const screenSizeIndex = sizes.indexOf(screenSizeToTest);

        return currentScreenSizeIndex > screenSizeIndex;
    }

    return { screenSize, isLessThan, isGreaterThan };
}