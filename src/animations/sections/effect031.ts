import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Реєструємо плагін
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Анімація секції пакетних рішень (effect031)
 * PINNED секція з 3D трансформаціями карток
 * Логіка відповідає прикладу: кожен слайд pinned на 100vh, fade out коли наступна картка видна на 50%
 */
export function initEffect031(): (() => void) | undefined {
  if (typeof window === "undefined") return;

  const section = document.querySelector<HTMLElement>("#effect031");
  if (!section) return;

  const slides = section.querySelectorAll<HTMLElement>(".slide");

  if (slides.length === 0) return;

  // Спочатку видаляємо всі існуючі ScrollTriggers для цієї секції
  // щоб уникнути дублікатів при повторній ініціалізації
  // І спочатку скидаємо всі стани карток
  slides.forEach((slide) => {
    const content = slide.querySelector<HTMLElement>(".content");
    if (content) {
      // Скидаємо всі трансформації та видимість
      gsap.set(content, {
        rotationZ: 0,
        scale: 1,
        rotationX: 0,
        opacity: 1,
        visibility: "visible",
        filter: "blur(0px)", // Скидаємо blur
        clearProps: "all", // Очищаємо всі GSAP властивості
      });
    }
  });

  // Тепер видаляємо ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => {
    const triggerElement = trigger.trigger as HTMLElement;
    if (triggerElement && section.contains(triggerElement)) {
      trigger.kill();
    }
  });

  // Додаткова перевірка: встановлюємо видимість через CSS
  slides.forEach((slide) => {
    const content = slide.querySelector<HTMLElement>(".content");
    if (content) {
      content.style.opacity = "1";
      content.style.visibility = "visible";
      content.style.filter = "blur(0px)"; // Скидаємо blur через CSS
    }
  });

  const triggers: ScrollTrigger[] = [];
  const tweens: gsap.core.Tween[] = [];

  /** Pin на `.content-wrapper` без фіксованої висоти розтягує блок на viewport. Тримаємо висоту = `.slide`. */
  function lockWrapperToSlideHeight(
    slideEl: HTMLElement,
    wrapper: HTMLElement
  ) {
    const h = slideEl.offsetHeight;
    wrapper.style.height = `${h}px`;
    wrapper.style.maxHeight = `${h}px`;
  }

  function unlockWrapperHeight(wrapper: HTMLElement) {
    wrapper.style.removeProperty("height");
    wrapper.style.removeProperty("max-height");
  }

  // Анімація для кожного слайда
  slides.forEach((slide, index) => {
    const contentWrapper = slide.querySelector<HTMLElement>(".content-wrapper");
    const content = slide.querySelector<HTMLElement>(".content");

    if (!contentWrapper || !content) return;

    const isLastSlide = index === slides.length - 1;

    // Переконуємося, що картка видима перед створенням анімації
    gsap.set(content, {
      rotationZ: 0,
      scale: 1,
      rotationX: 0,
      autoAlpha: 1,
      filter: "blur(0px)", // Початковий стан без blur
      immediateRender: true, // Застосовуємо одразу
    });

    // Для останнього слайда не створюємо анімацію - він просто скролиться з потоком
    if (isLastSlide) {
      return;
    }

    lockWrapperToSlideHeight(slide, contentWrapper);

    // Основна анімація: 3D трансформації з pin на content-wrapper (як було задумано).
    // Висота wrapper зафіксована відносно `.slide`, щоб фон не займав весь екран.
    const mainTween = gsap.to(content, {
      rotationZ: (Math.random() - 0.5) * 10, // RotationZ between -5 and 5 degrees
      scale: 0.7, // Slight reduction of the content
      rotationX: 40,
      ease: "power1.in", // Starts gradually
      scrollTrigger: {
        pin: contentWrapper,
        trigger: slide,
        start: "top 10%", // Starts when its top reaches the top of the viewport
        end: `+=${window.innerHeight}`, // Ends 100vh later
        scrub: true, // Progresses with the scroll
        invalidateOnRefresh: true,
        onRefresh: () => lockWrapperToSlideHeight(slide, contentWrapper),
      },
    });
    tweens.push(mainTween);
    if (mainTween.scrollTrigger) triggers.push(mainTween.scrollTrigger);

    // Fade out та blur анімація - коли наступна картка видна на 50%
    const fadeTween = gsap.to(content, {
      autoAlpha: 0, // Ends at opacity: 0 and visibility: hidden
      filter: "blur(20px)", // Додаємо blur коли картка йде на другий план
      ease: "power1.in", // Starts gradually
      scrollTrigger: {
        trigger: content,
        start: "top -40%",
        end: `+=${0.3 * window.innerHeight}`, // Ends 30% later для плавності
        scrub: true, // Progresses with the scroll
        invalidateOnRefresh: true,
      },
    });
    tweens.push(fadeTween);
    if (fadeTween.scrollTrigger) triggers.push(fadeTween.scrollTrigger);
  });

  // Повертаємо cleanup функцію
  return () => {
    triggers.forEach((trigger) => trigger.kill());
    tweens.forEach((tween) => tween.kill());
    slides.forEach((slide) => {
      const wrapper = slide.querySelector<HTMLElement>(".content-wrapper");
      if (wrapper) unlockWrapperHeight(wrapper);
    });
  };
}
