import {
  animate,
  keyframes,
  query,
  sequence,
  stagger,
  style,
  transition,
  trigger,
} from "@angular/animations";

export const DropDownAnimation = trigger("slide", [
  transition(":enter", [
    style({ height: 0, overflow: "hidden" }),
    query(".sub-item", [style({ opacity: 0, transform: "translateY(-50px)" })]),
    sequence([
      animate("200ms", style({ height: "*" })),
      query(".sub-item", [
        stagger(-50, [
          animate("200ms ease", style({ opacity: 1, transform: "none" })),
        ]),
      ]),
    ]),
  ]),

  transition(":leave", [
    style({ height: "*", overflow: "hidden" }),
    query(".sub-item", [style({ opacity: 1, transform: "none" })]),
    sequence([
      query(".sub-item", [
        stagger(50, [
          animate(
            "200ms ease",
            style({ opacity: 0, transform: "translateY(-50px)" })
          ),
        ]),
      ]),
      animate("200ms", style({ height: 0 })),
    ]),
  ]),
]);

export const StaggerAnimation = trigger("staggerAnimation", [
  transition("void => *", [
    query(
      ":enter",
      [
        style({ opacity: 0, transform: "translateY(-20px)" }),
        stagger(100, [
          animate("500ms", style({ opacity: 1, transform: "translateY(0)" })),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);

export const FadeOut = trigger("fadeOut", [
  transition(":leave", [
    animate(
      "800ms ease-out",
      keyframes([
        style({ opacity: 0, transform: "scale(0.5)", offset: 0.5 }),
        style({
          transform: "scale(0)",
          width: 0,
          offset: 1,
        }),
      ])
    ),
  ]),
]);

export const SlideInOut = trigger("slide", [
  transition(":enter", [
    style({ height: 0, opacity: 0 }),
    animate("400ms ease-in", style({ height: "*", opacity: 1 })),
  ]),
  transition(":leave", [
    style({ height: "*", opacity: 1 }),
    animate("400ms ease-out", style({ height: 0, opacity: 0 })),
  ]),
]);

export const FadeInOut = trigger("fade", [
  transition(":enter", [
    style({ opacity: 0 }),
    animate("200ms ease-in", style({ opacity: 1 })),
  ]),
  transition(":leave", [
    style({ opacity: 1 }),
    animate("200ms ease-out", style({ opacity: 0 })),
  ]),
]);

export const navigationAnimation = trigger("navAnim", [
  transition(":enter", [
    style({ opacity: 0 }),
    animate("800ms", style({ opacity: 1 })),
  ]),
  transition(":leave", [animate("800ms", style({ opacity: 0 }))]),
]);
