"use client";

import { useEffect } from "react";
import styles from "../../app/page.module.css";

export default function Scroll() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const historySectionId = styles["about"];
    const recipeSectionId = styles["recipe-section"];
    const historySection = document.getElementById(historySectionId);
    const recipeSection = document.getElementById(recipeSectionId);
    const historyElements = historySection
      ? Array.from(
          historySection.querySelectorAll(
            [
              `#${styles["history"]} > .${styles["section-label"]}`,
              `#${styles["history"]} > h1`,
              `.${styles["history-img"]}`,
              `.${styles["history-text"]}`,
              `#${styles["fr1"]}`,
              `#${styles["fr1"]}`,
              `#${styles["fr2"]}`,
              `#${styles["fr2"]}`,
              `.${styles["info-block"]}`,
              `.${styles["info-block"]}`,
            ].join(", "),
          ),
        )
      : [];

    const revealElements = [
      ...Array.from(
        document.querySelectorAll("main > section, main > footer"),
      ).filter(
        (element) =>
          element.id !== historySectionId && element.id !== recipeSectionId,
      ),
      ...historyElements,
      ...(recipeSection
        ? Array.from(
            recipeSection.querySelectorAll(
              `#${styles["recipe"]} > .${styles["section-label"]}`,
            ),
          )
        : []),
      ...Array.from(
        document.querySelectorAll(
          [
            `.${styles["recipe-heading"]}`,
            `.${styles["ingredient-area"]}`,
            `.${styles["recipe-content"]}`,
          ].join(", "),
        ),
      ),
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles["is-visible"]);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    revealElements.forEach((element) => {
      element.classList.add(styles["fade-scroll"]);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
